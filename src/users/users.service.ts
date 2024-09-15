import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestDto, UpdateAvatarDto, UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.prismaService.user.findMany({
      omit: {
        password: true,
      },
    });
    return users;
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: { ...updateUserDto },
      omit: {
        password: true,
      },
    });
    return user;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.prismaService.user.delete({
      where: { id },
    });

    return { message: 'User Deleted Successfully!' };
  }

  async updateProfileImage(
    updateAvatarDto: UpdateAvatarDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Partial<User>> {
    if (user.avatar.length > 0) {
      const avatarPublicId = user.avatar
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];
      await this.cloudinaryService.DeleteFile(avatarPublicId);
    }

    const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: cloudinaryResponse.secure_url },
      omit: {
        password: true,
      },
    });

    return updatedUser;
  }

  async testNodemailer(testDto: TestDto): Promise<{ message: string }> {
    const mailResponse = await this.nodemailerService.sendMail({
      email: testDto.email,
      subject: 'Test Email',
      message: 'This is a test email from NestJS',
    });

    return { message: 'Email sent successfully!' };
  }
}
