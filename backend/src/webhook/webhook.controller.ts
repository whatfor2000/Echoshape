import { Controller, Post, Req, Res, Logger } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import axios from 'axios';

@Controller('webhook/omise')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private readonly omiseBase = process.env.OMISE_BASE_URL || 'https://api.omise.co';
  private readonly secretKey = process.env.OMISE_SECRET_KEY;

  constructor(private readonly svc: SubscriptionsService) {}

  private authHeader() {
    const token = Buffer.from(`${this.secretKey}:`).toString('base64');
    return { Authorization: `Basic ${token}` };
  }

  @Post()
  async handle(@Req() req, @Res() res) {
    const event = req.body;
    if (!event?.id) return res.status(400).send('invalid');

    try {
      const resp = await axios.get(`${this.omiseBase}/events/${event.id}`, {
        headers: this.authHeader(),
      });
      const verified = resp.data;
      this.logger.log(`Got event ${verified.key}`);

      if (verified.key === 'charge.complete') {
        await this.svc.createSubscription; // TODO: map charge to user
      }
      return res.status(200).send('ok');
    } catch (e) {
      this.logger.error('webhook error', e);
      return res.status(400).send('fail');
    }
  }
}
