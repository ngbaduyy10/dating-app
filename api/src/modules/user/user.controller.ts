import { JwtUserDto } from '@/modules/auth/dto/jwt-user.dto';
import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Req() req: { user: JwtUserDto }) {
    return this.userService.getAllUser(req.user.id);
  }

  @Get(':userId')
  async getUserDetail(
    @Param('userId') userId: string,
    @Req() req: { user: JwtUserDto },
  ) {
    return this.userService.getUserById(userId, req.user.id);
  }

  @Post(':userId/like')
  async likeUser(
    @Param('userId') userId: string,
    @Req() req: { user: JwtUserDto },
  ) {
    return this.userService.likeUser(req.user.id, userId);
  }
}
