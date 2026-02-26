import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '@/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() userData: CreateUserDto) {
    return await this.authService.register(userData);
  }

  @Post('login')
  @Public()
  async login(@Body() userData: LoginDto) {
    return await this.authService.login(userData);
  }
}
