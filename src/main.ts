import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 1000;

  const multerOptions: multer.Options = {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  };

  // Create a FileInterceptor instance with custom options
  const fileInterceptor = FileInterceptor('file', multerOptions);

  // Apply FileInterceptor globally
  app.useGlobalInterceptors(new fileInterceptor());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () =>
    console.log(`user-service running on port: ${PORT}`),
  );
}
bootstrap();
