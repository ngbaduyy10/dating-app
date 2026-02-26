import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { MatchEntity } from './match.entity';
import { UserEntity } from './user.entity';
import { AvailabilityBlock } from '@/utils/constant';

@Entity('availabilities')
@Unique(['match_id', 'user_id', 'date', 'block_type'])
export class AvailabilityEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  match_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: AvailabilityBlock })
  block_type: AvailabilityBlock;

  @ManyToOne(() => MatchEntity, (match) => match.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;

  @ManyToOne(() => UserEntity, (user) => user.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
