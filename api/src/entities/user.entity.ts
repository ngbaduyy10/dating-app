import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Gender } from '@/utils/constant';
import { LikeEntity } from './like.entity';
import { MatchEntity } from './match.entity';
import { AvailabilityEntity } from './availability.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => LikeEntity, (like) => like.from_user)
  sent_likes: LikeEntity[];

  @OneToMany(() => LikeEntity, (like) => like.to_user)
  received_likes: LikeEntity[];

  @OneToMany(() => MatchEntity, (match) => match.user_a)
  matches_as_a: MatchEntity[];

  @OneToMany(() => MatchEntity, (match) => match.user_b)
  matches_as_b: MatchEntity[];

  @OneToMany(() => AvailabilityEntity, (availability) => availability.user)
  availabilities: AvailabilityEntity[];
}
