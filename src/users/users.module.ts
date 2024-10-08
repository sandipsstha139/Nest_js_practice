import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, NodemailerModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
