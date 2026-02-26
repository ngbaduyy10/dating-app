import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('likes')
@Unique(['from_user_id', 'to_user_id'])
@Check(`"from_user_id" <> "to_user_id"`)
export class LikeEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  from_user_id: string;

  @Column({ type: 'uuid' })
  to_user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.sent_likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_user_id' })
  from_user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.received_likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_user_id' })
  to_user: UserEntity;
}
