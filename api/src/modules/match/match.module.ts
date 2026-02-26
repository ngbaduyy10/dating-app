import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from '@/entities/match.entity';
import { UserEntity } from '@/entities/user.entity';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
  imports: [TypeOrmModule.forFeature([MatchEntity, UserEntity])],
})
export class MatchModule {}
