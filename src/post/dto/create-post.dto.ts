import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, minLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Post Title',
    description: 'The title of the Post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Post Content',
    description: 'The content of the Post',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'Post Cover Image',
    description: 'The cover image of the Post',
    format: 'binary',
  })
  coverImage: string;
}
