import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from '@/entities/match.entity';
import { UserEntity } from '@/entities/user.entity';
import { AvailabilityEntity } from '@/entities/availability.entity';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
  imports: [TypeOrmModule.forFeature([MatchEntity, UserEntity, AvailabilityEntity])],
})
export class MatchModule {}
