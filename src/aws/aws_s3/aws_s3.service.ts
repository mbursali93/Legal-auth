import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';


@Injectable()
export class AwsS3Service {
  async upload(file: any, fileName) {
    try {
      const s3 = this.S3();
      const response = (await s3
        .upload({
          Bucket: 'legal-avatars',
          Key: `images/${fileName}.jpg`,
          Body: file.buffer,
        })
        .promise()) as any;

      return await response.Location;
    } catch (err) {
      console.log('eror');
      console.log(err);
      return err;
    }
  }

  S3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
    });
  }
}
