import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of a user',
    minLength: 2,
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;
}

export class UpdateAvatarDto {
  @ApiProperty({
    description: 'The avatar of a user',
    required: false,
    format: 'binary',
  })
  @IsOptional()
  avatar: string;
}

export class TestDto {
  @ApiProperty({
    description: 'The email of a user',
    example: 'sandipstha139@gmail.com',
  })
  @IsString()
  email: string;
}
