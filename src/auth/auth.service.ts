import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDTO } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { AuthDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDTO) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: signupDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(signupDto.password, 10);

    const newUser = this.prismaService.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    return newUser;
  }

  async login(authDto: AuthDTO): Promise<{ accessToken: string }> {
    const { email, password } = authDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new BadRequestException('Invalid Credentials');
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload = {
      sub: existingUser.id,
      username: existingUser.name,
      email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(profile: any): Promise<any> {
    let user = await this.prismaService.user.findFirst({
      where: {
        googleId: profile.id,
      },
    });

    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        },
        omit: {
          password: true,
        },
      });
      return newUser;
    }

    return user;
  }
}
