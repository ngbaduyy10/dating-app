import { AvailabilityEntity } from '@/entities/availability.entity';
import { MatchEntity } from '@/entities/match.entity';
import { UserEntity } from '@/entities/user.entity';
import { AvailabilityBlock, MatchStatus } from '@/utils/constant';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AvailabilityEntity)
    private readonly availabilityRepository: Repository<AvailabilityEntity>,
  ) {}

  async getCurrentUserMatches(
    currentUserId: string,
  ): Promise<
    Array<
      UserEntity & {
        match_id: string;
        status: MatchStatus;
        first_common_date?: string;
        first_common_block_type?: AvailabilityBlock;
      }
    >
  > {
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

    const matchInfoByUserId = new Map(
      matches.map((match) => [
        match.user_a_id === currentUserId ? match.user_b_id : match.user_a_id,
        {
          match_id: match.id,
          status: match.status,
          first_common_date: match.first_common_date,
          first_common_block_type: match.first_common_block_type,
        },
      ]),
    );

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...matchedUserIds)', { matchedUserIds })
      .getMany();

    return users
      .filter((user) => Boolean(matchInfoByUserId.get(user.id)))
      .map((user) => ({
        ...user,
        ...matchInfoByUserId.get(user.id)!,
      }));
  }

  async saveCurrentUserAvailability(
    currentUserId: string,
    matchId: string,
    slots: Array<{ date: string; block_type: AvailabilityBlock }>,
  ): Promise<{ saved_count: number }> {
    const match = await this.matchRepository.findOne({ where: { id: matchId } });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const isMember =
      match.user_a_id === currentUserId || match.user_b_id === currentUserId;
    if (!isMember) {
      throw new ForbiddenException('You are not part of this match');
    }

    const validBlocks = new Set(Object.values(AvailabilityBlock));
    const uniqueSlots = new Map<string, { date: string; block_type: AvailabilityBlock }>();

    for (const slot of slots ?? []) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(slot.date)) {
        throw new BadRequestException('Invalid date format');
      }

      if (!validBlocks.has(slot.block_type)) {
        throw new BadRequestException('Invalid availability block');
      }

      uniqueSlots.set(`${slot.date}|${slot.block_type}`, slot);
    }

    await this.availabilityRepository.delete({
      match_id: matchId,
      user_id: currentUserId,
    });

    const newSlots = Array.from(uniqueSlots.values());
    if (newSlots.length > 0) {
      await this.availabilityRepository.save(
        newSlots.map((slot) =>
          this.availabilityRepository.create({
            match_id: matchId,
            user_id: currentUserId,
            date: slot.date,
            block_type: slot.block_type,
          }),
        ),
      );
    }

    const otherUserId =
      match.user_a_id === currentUserId ? match.user_b_id : match.user_a_id;
    const otherUserSlots = await this.availabilityRepository.find({
      where: {
        match_id: matchId,
        user_id: otherUserId,
      },
    });

    if (otherUserSlots.length === 0) {
      await this.matchRepository
        .createQueryBuilder()
        .update(MatchEntity)
        .set({
          status: MatchStatus.MATCHED,
          first_common_date: () => 'NULL',
          first_common_block_type: () => 'NULL',
        })
        .where('id = :matchId', { matchId })
        .execute();
      return { saved_count: newSlots.length };
    }

    const currentUserSlotKeys = new Set(
      newSlots.map((slot) => `${slot.date}|${slot.block_type}`),
    );
    const blockOrder: Record<AvailabilityBlock, number> = {
      [AvailabilityBlock.MORNING]: 1,
      [AvailabilityBlock.AFTERNOON]: 2,
      [AvailabilityBlock.EVENING]: 3,
    };

    const commonSlots = otherUserSlots
      .map((slot) => ({
        date: slot.date,
        block_type: slot.block_type,
      }))
      .filter((slot) => currentUserSlotKeys.has(`${slot.date}|${slot.block_type}`))
      .sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return blockOrder[a.block_type] - blockOrder[b.block_type];
      });

    if (commonSlots.length === 0) {
      await this.matchRepository
        .createQueryBuilder()
        .update(MatchEntity)
        .set({
          status: MatchStatus.NO_COMMON_SLOT,
          first_common_date: () => 'NULL',
          first_common_block_type: () => 'NULL',
        })
        .where('id = :matchId', { matchId })
        .execute();
      return { saved_count: newSlots.length };
    }

    const nearestCommonSlot = commonSlots[0];
    await this.matchRepository.update(
      { id: matchId },
      {
        status: MatchStatus.SCHEDULED,
        first_common_date: nearestCommonSlot.date,
        first_common_block_type: nearestCommonSlot.block_type,
      },
    );

    return { saved_count: newSlots.length };
  }

  async getCurrentUserAvailability(
    currentUserId: string,
    matchId: string,
  ): Promise<{
    matched_user: { id: string; first_name: string; last_name: string };
    slots: Array<{ date: string; block_type: AvailabilityBlock }>;
  }> {
    const match = await this.matchRepository.findOne({ where: { id: matchId } });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const isMember =
      match.user_a_id === currentUserId || match.user_b_id === currentUserId;
    if (!isMember) {
      throw new ForbiddenException('You are not part of this match');
    }

    const matchedUserId =
      match.user_a_id === currentUserId ? match.user_b_id : match.user_a_id;
    const matchedUser = await this.userRepository.findOne({
      where: { id: matchedUserId },
    });
    if (!matchedUser) {
      throw new NotFoundException('Matched user not found');
    }

    const slots = await this.availabilityRepository.find({
      where: {
        match_id: matchId,
        user_id: currentUserId,
      },
      order: {
        date: 'ASC',
        block_type: 'ASC',
      },
    });

    return {
      matched_user: {
        id: matchedUser.id,
        first_name: matchedUser.first_name,
        last_name: matchedUser.last_name,
      },
      slots: slots.map((slot) => ({
        date: slot.date,
        block_type: slot.block_type,
      })),
    };
  }
}
