import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      imports: [ConfigModule],
      inject: [ConfigService],
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image', folder: 'nest-js' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async DeleteFile(public_id: string): Promise<void> {
    new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }
}
