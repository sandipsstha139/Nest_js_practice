import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'user1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
