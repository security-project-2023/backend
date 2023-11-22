import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Purchase } from './purchase.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ nullable: true })
  refreshToken!: string;

  @CreateDateColumn()
  @Exclude()
  createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt!: Date;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases!: Purchase[];
}
