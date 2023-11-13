import { Injectable } from '@nestjs/common';
import * as Craftgate from '@craftgate/craftgate';
import { Client } from '@craftgate/craftgate/';

@Injectable()
export class PaymentService {
  craftgate: any;
  constructor() {
    this.craftgate = new Craftgate.Client({
      apiKey: process.env.CRAFTGATE_API,
      secretKey: process.env.CRAFTGATE_SECRET,
      baseUrl: process.env.CRAFTGATE_BASE_URL,
    });
  }
  async startPayment(price, card, items) {
    try {
      const request = {
        price,
        paidPrice: price * 1.025,
        walletPrice: 0.0,
        installment: 1,
        // conversationId: '456d1297-908e-4bd6-a13b-4be31a6e47d5',
        currency: Craftgate.Model.Currency.TRY,
        paymentGroup: Craftgate.Model.PaymentGroup.ListingOrSubscription,
        callbackUrl: `${process.env.BASE_URL}/payment/approve`,
        card,
        items: [{ price: 32 }],
      };

      this.craftgate
        .payment()
        .init3DSPayment(request)
        .then((result) => console.info('Init 3ds payment successful', result))
        .catch((err) => console.error('Failed to init 3ds payment', err));
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async approvePayment() {
    try {
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
