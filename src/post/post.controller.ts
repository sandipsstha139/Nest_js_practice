import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { User as UserEntity } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Create Post' })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('coverImage'))
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @User() user: UserEntity,
    @UploadedFile() coverImage: Express.Multer.File,
  ) {
    console.log(createPostDto);
    return this.postService.create(createPostDto, user, coverImage);
  }

  @ApiOperation({ summary: 'Get All Posts' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @ApiOperation({ summary: 'Get Post By Id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Post' })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('coverImage'))
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() coverImage: Express.Multer.File,
  ) {
    return this.postService.update(id, updatePostDto, coverImage);
  }

  @ApiOperation({ summary: 'Delete Post' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }

  @ApiOperation({ summary: 'Update Post Status' })
  // @UseGuards(JwtAuthGuard)
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: number,
    @Body() published: { published: boolean },
  ) {
    return this.postService.updatePostStatus(id, published);
  }
}
