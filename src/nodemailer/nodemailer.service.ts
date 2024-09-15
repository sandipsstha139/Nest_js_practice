import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST'),
      port: configService.get('SMTP_PORT'),
      service: configService.get('SMTP_SERVICE'),
      secure: true,
      auth: {
        user: configService.get('SMTP_EMAIL'),
        pass: configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendMail(options: {
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_EMAIL'),
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
  }
}
