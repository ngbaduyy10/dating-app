import { MatchEntity } from '@/entities/match.entity';
import { UserEntity } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getCurrentUserMatches(
    currentUserId: string,
  ): Promise<Array<UserEntity & { match_id: string }>> {
    const matches = await this.matchRepository
      .createQueryBuilder('match')
      .where('match.user_a_id = :currentUserId', { currentUserId })
      .orWhere('match.user_b_id = :currentUserId', { currentUserId })
      .getMany();

    const matchedUserIds = [
      ...new Set(
        matches.map((match) =>
          match.user_a_id === currentUserId ? match.user_b_id : match.user_a_id,
        ),
      ),
    ];

    if (matchedUserIds.length === 0) {
      return [];
    }

    const matchIdByUserId = new Map(
      matches.map((match) => [
        match.user_a_id === currentUserId ? match.user_b_id : match.user_a_id,
        match.id,
      ]),
    );

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...matchedUserIds)', { matchedUserIds })
      .getMany();

    return users
      .filter((user) => Boolean(matchIdByUserId.get(user.id)))
      .map((user) => ({
        ...user,
        match_id: matchIdByUserId.get(user.id)!,
      }));
  }
}
