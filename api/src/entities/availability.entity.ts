import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { MatchEntity } from './match.entity';
import { UserEntity } from './user.entity';

@Entity('availabilities')
@Check(`"start_at" < "end_at"`)
export class AvailabilityEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  match_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'timestamptz' })
  start_at: Date;

  @Column({ type: 'timestamptz' })
  end_at: Date;

  @ManyToOne(() => MatchEntity, (match) => match.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;

  @ManyToOne(() => UserEntity, (user) => user.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
