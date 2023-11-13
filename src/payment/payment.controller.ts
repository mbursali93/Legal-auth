import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async startPayment(@Body() body) {
    const { price, card, items } = body;
    return await this.paymentService.startPayment(price, card, items);
  }

  @Post('approve')
  async approvePayment(@Body() body) {
    console.log('approve');
    return;
  }
}
