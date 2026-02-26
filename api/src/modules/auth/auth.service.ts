import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: CreateUserDto) {
    return await this.userService.create(userData);
  }

  async login(userData: LoginDto) {
    const user = await this.userService.validateUser(
      userData.email,
      userData.password,
    );
    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user,
    };
  }
}
