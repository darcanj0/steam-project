import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Server is running 🚀. Check http://localhost:3001/api for Swagger docs...`;
  }
}
