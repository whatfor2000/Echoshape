import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import { PrismaService } from '../prisma.service';

type NullableString = string | null | undefined;

interface OmiseCustomerResp {
  id: string;
  email?: NullableString;
  description?: NullableString;
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
  key: string;
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
   * Create customer + attach card in one call
   */
  async createCustomerWithCard(
    userEmail: NullableString,
    userId: string,
    cardToken: string
  ): Promise<{ customer: OmiseCustomerResp; cardId?: string }> {
    try {
      const params = new URLSearchParams({
        email: userEmail ?? '',
        description: `Echoshape user ${userId}`,
        card: cardToken,
      }).toString();

      const url = `${this.omiseBase}/customers`;
      const resp: AxiosResponse<OmiseCustomerResp> = await axios.post(url, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: { username: this.secretKey, password: '' },
      });

      const customer = resp.data;
      let cardId: string | undefined;
      if (typeof customer.default_card === 'string') cardId = customer.default_card;
      else if (customer.default_card && typeof customer.default_card === 'object')
        cardId = (customer.default_card as any).id;

      return { customer, cardId };
    } catch (error: any) {
      this.logger.error('Failed to create customer with card', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Attach card to existing customer
   */
  async createCardForCustomer(customerId: string, cardToken: string): Promise<OmiseCardResp> {
    try {
      const params = new URLSearchParams({ card: cardToken }).toString();
      const url = `${this.omiseBase}/customers/${encodeURIComponent(customerId)}/cards`;

      const resp: AxiosResponse<OmiseCardResp> = await axios.post(url, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: { username: this.secretKey, password: '' },
      });

      return resp.data;
    } catch (error: any) {
      this.logger.error('Failed to create card for customer', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create schedule with full payload
   */
  async createScheduleFromPayload(payload: Record<string, any>): Promise<OmiseScheduleResp> {
    try {
      const url = `${this.omiseBase}/schedules`;
      const resp: AxiosResponse<OmiseScheduleResp> = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        auth: { username: this.secretKey, password: '' },
      });
      return resp.data;
    } catch (error: any) {
      this.logger.error('Failed to create schedule', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create monthly schedule for subscription
   */
  async createSchedule(
    customerId: string,
    cardId: string,
    amountSatang: number,
    planId: string
  ): Promise<OmiseScheduleResp> {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

  const payload = {
    description: `Echoshape ${planId} subscription for customer ${customerId}`,
    start_date: today.toISOString().split('T')[0],
    end_date: nextYear.toISOString().split('T')[0],
    every: 1,
    period: 'month',
    on: { days_of_month: [today.getDate()] },
    charge: {
      description: `Monthly charge ${planId}`,
      amount: amountSatang, // <-- number ไม่ใช่ string
      currency: 'thb',
      customer: customerId,
      card: cardId,
    },
  };

  console.log('Creating schedule with payload:', payload);

    return this.createScheduleFromPayload(payload);
  }

  /**
   * Fetch Omise event
   */
  async getEvent(eventId: string): Promise<OmiseEventResp> {
    try {
      const url = `${this.omiseBase}/events/${encodeURIComponent(eventId)}`;
      const resp: AxiosResponse<OmiseEventResp> = await axios.get(url, {
        auth: { username: this.secretKey, password: '' },
      });
      return resp.data;
    } catch (error: any) {
      this.logger.error('Failed to fetch event', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete schedule
   */
  async deleteSchedule(scheduleId: string): Promise<boolean> {
    try {
      const url = `${this.omiseBase}/schedules/${encodeURIComponent(scheduleId)}`;
      const resp = await axios.delete(url, { auth: { username: this.secretKey, password: '' } });
      return resp.status === 204 || resp.status === 200;
    } catch (error: any) {
      this.logger.error('Failed to delete schedule', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create PromptPay charge
   */
  async createPromptPayCharge(amount: number) {
    try {
      const response = await axios.post(
        'https://api.omise.co/charges',
        {
          amount: amount * 100,
          currency: 'thb',
          source: { type: 'promptpay' },
          capture: true,
        },
        {
          auth: { username: this.secretKey, password: '' },
        }
      );

      const promptpayUrl = response.data?.source?.scannable_code?.image?.download_uri;
      if (!promptpayUrl) throw new HttpException('Cannot get PromptPay QR URL', HttpStatus.INTERNAL_SERVER_ERROR);

      const charge = await this.prisma.charge.create({
        data: {
          amount,
          currency: 'THB',
          promptpayUrl,
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
      this.logger.error('Failed to create PromptPay charge', error.response?.data || error.message);
      throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Helper: convert THB to Satang
   */
  thbToSatang(amount: number): number {
    return Math.round(amount * 100);
  }
}
