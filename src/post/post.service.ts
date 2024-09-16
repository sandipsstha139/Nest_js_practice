import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaSerivce: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: User,
    coverImage: Express.Multer.File,
  ): Promise<Post> {
    const { title, content } = createPostDto;

    const cloudinaryResponse =
      await this.cloudinaryService.uploadFile(coverImage);

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      throw new BadRequestException('Error uploading image');
    }

    let post: Post;
    try {
      post = await this.prismaSerivce.post.create({
        data: {
          title,
          content,
          coverImage: cloudinaryResponse.secure_url,
          authorId: user.id,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error creating post: ', error);
    }
    return post;
  }

  async findAll(): Promise<Array<Post>> {
    const posts = await this.prismaSerivce.post.findMany();

    return posts;
  }

  async findOne(id: number): Promise<Post> {
    return await this.prismaSerivce.post.findUnique({ where: { id } });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    coverImage: Express.Multer.File,
  ): Promise<{ message: string; updatedPost: Post }> {
    const { title, content } = updatePostDto;

    let post = await this.prismaSerivce.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    console.log(coverImage);

    let cloudinaryResponse: any;
    if (coverImage && coverImage.size > 0) {
      console.log('hi');
      const coverImagePublicId = post?.coverImage
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];

      await this.cloudinaryService.DeleteFile(coverImagePublicId);

      cloudinaryResponse = await this.cloudinaryService.uploadFile(coverImage);
      console.log(cloudinaryResponse);
    }

    const updatedPost = await this.prismaSerivce.post.update({
      where: { id },
      data: {
        title,
        content,
        coverImage: coverImage
          ? cloudinaryResponse.secure_url
          : post.coverImage,
      },
    });

    return {
      message: 'Post Updated Successfully!',
      updatedPost,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const post = await this.prismaSerivce.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.cloudinaryService.DeleteFile(
      post.coverImage.split('/').slice(-2).join('/').split('.')[0],
    );

    await this.prismaSerivce.post.delete({ where: { id } });
    return {
      message: 'Post Deleted Successfully',
    };
  }

  async updatePostStatus(
    id: number,
    published: { published: boolean },
  ): Promise<{ message: string; updatedPost: Post }> {
    const post = await this.prismaSerivce.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const updatedPost = await this.prismaSerivce.post.update({
      where: { id },
      data: {
        published: published.published,
      },
    });

    return {
      message: 'Post Status Updated Successfully!',
      updatedPost,
    };
  }
}
