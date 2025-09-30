import { Injectable, Logger,HttpException,HttpStatus  } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import { PrismaService } from '../prisma.service';

type NullableString = string | null | undefined;

interface OmiseCustomerResp {
  id: string;
  email?: NullableString;
  description?: NullableString;
  // Omise's default_card may be string id OR a card object; allow both
  default_card?: string | { id?: string } | null;
  [k: string]: any;
}

interface OmiseCardResp {
  id: string;
  [k: string]: any;
}

interface OmiseScheduleResp {
  id: string;
  [k: string]: any;
}

interface OmiseEventResp {
  id: string;
  key: string; // e.g., "charge.complete"
  data: { object: any };
  [k: string]: any;
}



@Injectable()
export class OmiseService {
  private readonly logger = new Logger(OmiseService.name);
  private readonly omiseBase = process.env.OMISE_BASE_URL ?? 'https://api.omise.co';
  private readonly secretKey = process.env.OMISE_SECRET_KEY ?? '';
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Create customer + attach card in one call (card token from omise.js).
   * Returns typed result and extracted cardId (if present).
   */
  async createCustomerWithCard(userEmail: NullableString, userId: string, cardToken: string)
    : Promise<{ customer: OmiseCustomerResp; cardId?: string }> {

    const params = new URLSearchParams({
      email: userEmail ?? '', // <-- null-safe
      description: `Echoshape user ${userId}`,
      card: cardToken,
    }).toString();

    const url = `${this.omiseBase}/customers`;

    // Type the response explicitly
    const resp: AxiosResponse<OmiseCustomerResp> = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: { username: this.secretKey, password: '' }, // basic auth
    });

    const customer = resp.data;
    // default_card can be string or object — make extraction robust
    let cardId: string | undefined;
    if (typeof customer.default_card === 'string') cardId = customer.default_card;
    else if (customer.default_card && typeof customer.default_card === 'object') cardId = (customer.default_card as any).id;

    return { customer, cardId };
  }

  /**
   * Attach card token to an existing customer -> returns card id
   */
  async createCardForCustomer(customerId: string, cardToken: string): Promise<OmiseCardResp> {
    const params = new URLSearchParams({ card: cardToken }).toString();
    const url = `${this.omiseBase}/customers/${encodeURIComponent(customerId)}/cards`;

    const resp: AxiosResponse<OmiseCardResp> = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: { username: this.secretKey, password: '' },
    });

    return resp.data;
  }

  /**
   * Create charge schedule (monthly example).
   * amountSatang must be integer (e.g., 299.00 THB => 29900)
   */
  async createSchedule(customerId: string, cardId: string, amountSatang: number, planId: string)
    : Promise<OmiseScheduleResp> {

    const payload = {
      description: `Echoshape ${planId} subscription for customer ${customerId}`,
      start_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      every: '1',
      period: 'month',
      charge: {
        description: `Monthly charge ${planId}`,
        amount: amountSatang.toString(),
        currency: 'thb',
        customer: customerId,
        card: cardId,
      }
    };

    const url = `${this.omiseBase}/schedules`;
    const resp: AxiosResponse<OmiseScheduleResp> = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      auth: { username: this.secretKey, password: '' },
    });

    return resp.data;
  }

  /**
   * Verify event by fetching it from Omise Events API (recommended for webhook verification).
   */
  async getEvent(eventId: string): Promise<OmiseEventResp> {
    const url = `${this.omiseBase}/events/${encodeURIComponent(eventId)}`;
    const resp: AxiosResponse<OmiseEventResp> = await axios.get(url, {
      auth: { username: this.secretKey, password: '' },
    });
    return resp.data;
  }

  /**
   * Delete schedule
   */
  async deleteSchedule(scheduleId: string) {
    const url = `${this.omiseBase}/schedules/${encodeURIComponent(scheduleId)}`;
    const resp = await axios.delete(url, { auth: { username: this.secretKey, password: '' } });
    return resp.status === 204 || resp.status === 200;
  }

    async createPromptPayCharge(amount: number) {
    try {
      const response = await axios.post(
        'https://api.omise.co/charges',
        {
          amount: amount * 100, // Omise ใช้สตางค์
          currency: 'thb',
          source: {
            type: 'promptpay',
          },
          capture: true,
        },
        {
          auth: {
            username: this.secretKey,
            password: '',
          },
        },
      );
      const promptpayUrl = response.data?.source?.scannable_code?.image?.download_uri;

      if (!promptpayUrl) {
        throw new HttpException('Cannot get PromptPay QR URL', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // บันทึกใน DB
      const charge = await this.prisma.charge.create({
        data: {
          amount,
          currency: 'THB',
          promptpayUrl: promptpayUrl,
          status: response.data.status,
        },
      });

      return {
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        promptpayUrl: charge.promptpayUrl,
        status: charge.status,
      };
    } catch (error: any) {
      console.error("Omise error:", error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
