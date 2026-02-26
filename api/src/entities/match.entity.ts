import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { AvailabilityBlock, MatchStatus } from '@/utils/constant';
import { AvailabilityEntity } from './availability.entity';

@Entity('matches')
@Unique(['user_a_id', 'user_b_id'])
export class MatchEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  user_a_id: string;

  @Column({ type: 'uuid' })
  user_b_id: string;

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.MATCHED })
  status: MatchStatus;

  @Column({ type: 'date', nullable: true })
  first_common_date?: string;

  @Column({ type: 'enum', enum: AvailabilityBlock, nullable: true })
  first_common_block_type?: AvailabilityBlock;

  @ManyToOne(() => UserEntity, (user) => user.matches_as_a, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_a_id' })
  user_a: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.matches_as_b, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_b_id' })
  user_b: UserEntity;

  @OneToMany(() => AvailabilityEntity, (availability) => availability.match)
  availabilities: AvailabilityEntity[];
}
