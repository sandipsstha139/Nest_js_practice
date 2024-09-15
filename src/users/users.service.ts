import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
