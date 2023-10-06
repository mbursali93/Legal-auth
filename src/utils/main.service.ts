import { Injectable } from '@nestjs/common';
import { SNS, SES } from 'aws-sdk';

@Injectable()
export class MainService {
  sns: SNS;
  ses: SES;
  constructor() {
    this.sns = new SNS({
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
    });

    this.ses = new SES({
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
    });
  }

  async sendSms(phoneNumber, code) {
    try {
      const text = `Merhaba, LegaL hesabınıza erişim sağlamak için doğrulama kodunuz: ${code}. Bu kodu kimseyle paylaşmayın. `;
      const params = { Message: text, PhoneNumber: phoneNumber };
      const sms = await this.sns.publish(params).promise();
    } catch (err) {
      console.log(err);
    }
  }

  async sendMail(email, code) {
    try {
      const message = `Merhaba, LegaL hesabınıza erişim sağlamak için doğrulama kodunuz: ${code}. Bu kodu kimseyle paylaşmayın. `;
      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: message,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Legal 2FA',
          },
        },
        Source: process.env.SOURCE_EMAIL, // Sender email address
      };

      try {
        await this.ses.sendEmail(params).promise();

        // console.log(`Email sent successfully to ${email}`);
      } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
