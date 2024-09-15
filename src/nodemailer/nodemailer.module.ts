import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
