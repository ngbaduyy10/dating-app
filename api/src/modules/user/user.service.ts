import { UserEntity } from '@/entities/user.entity';
import { LikeEntity } from '@/entities/like.entity';
import { MatchEntity } from '@/entities/match.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePasswords, hashPassword } from '@/utils/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
  ) {}

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (user && (await comparePasswords(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async getAllUser(currentUserId: string): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :currentUserId', { currentUserId })
      .getMany();
  }

  async getUserById(
    userId: string,
    currentUserId: string,
  ): Promise<UserEntity & { is_liked: boolean }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isLiked = await this.likeRepository.exists({
      where: {
        from_user_id: currentUserId,
        to_user_id: userId,
      },
    });

    return {
      ...user,
      is_liked: isLiked,
    };
  }

  async likeUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<{ isMatch: boolean }> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot like yourself');
    }

    const targetUser = await this.userRepository.exists({
      where: { id: targetUserId },
    });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const alreadyLiked = await this.likeRepository.exists({
      where: {
        from_user_id: currentUserId,
        to_user_id: targetUserId,
      },
    });

    if (!alreadyLiked) {
      const like = this.likeRepository.create({
        from_user_id: currentUserId,
        to_user_id: targetUserId,
      });
      await this.likeRepository.save(like);
    }

    const isMatch = await this.likeRepository.exists({
      where: {
        from_user_id: targetUserId,
        to_user_id: currentUserId,
      },
    });

    if (isMatch) {
      const [userAId, userBId] = [currentUserId, targetUserId].sort();
      const existingMatch = await this.matchRepository.exists({
        where: {
          user_a_id: userAId,
          user_b_id: userBId,
        },
      });

      if (!existingMatch) {
        const match = this.matchRepository.create({
          user_a_id: userAId,
          user_b_id: userBId,
        });
        await this.matchRepository.save(match);
      }
    }

    return { isMatch };
  }
}
