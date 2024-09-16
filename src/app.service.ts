import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<a href="http://localhost:4000/auth/google">google Login</a>`;
  }
}
