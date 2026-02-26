import { JwtUserDto } from '@/modules/auth/dto/jwt-user.dto';
import { AvailabilityBlock } from '@/utils/constant';
import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getCurrentUserMatches(@Req() req: { user: JwtUserDto }) {
    return this.matchService.getCurrentUserMatches(req.user.id);
  }

  @Put(':matchId/availability')
  async saveCurrentUserAvailability(
    @Param('matchId') matchId: string,
    @Body()
    body: { slots: Array<{ date: string; block_type: AvailabilityBlock }> },
    @Req() req: { user: JwtUserDto },
  ) {
    return this.matchService.saveCurrentUserAvailability(
      req.user.id,
      matchId,
      body?.slots ?? [],
    );
  }

  @Get(':matchId/availability')
  async getCurrentUserAvailability(
    @Param('matchId') matchId: string,
    @Req() req: { user: JwtUserDto },
  ) {
    return this.matchService.getCurrentUserAvailability(req.user.id, matchId);
  }
}
