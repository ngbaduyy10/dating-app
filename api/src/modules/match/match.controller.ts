import { JwtUserDto } from '@/modules/auth/dto/jwt-user.dto';
import { Controller, Get, Req } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getCurrentUserMatches(@Req() req: { user: JwtUserDto }) {
    return this.matchService.getCurrentUserMatches(req.user.id);
  }
}
