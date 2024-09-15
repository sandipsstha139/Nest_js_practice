import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [ConfigService, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
