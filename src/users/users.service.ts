import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAvatarDto, UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
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
    console.log('hi');
    console.log(file);
    console.log(user);
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);
    console.log(cloudinaryResponse);
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: cloudinaryResponse.secure_url },
      omit: {
        password: true,
      },
    });

    return updatedUser;
  }
}
