import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  async sign(payload) {
    return await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  async verify(token) {
    return await jwt.verify(token, process.env.JWT_SECRET);
  }
}
