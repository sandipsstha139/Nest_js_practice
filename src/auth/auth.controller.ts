import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { AuthDTO } from './dto/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as passport from 'passport';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up ' })
  @Post('/signup')
  async signup(@Body() signupDto: SignupDTO) {
    return await this.authService.signup(signupDto);
  }
  @ApiOperation({ summary: 'Login ' })
  @Post('/login')
  async login(@Body() authDto: AuthDTO) {
    return await this.authService.login(authDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }
}
