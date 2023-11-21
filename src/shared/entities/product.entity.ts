import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Age {
  ALL = 'all',
  OVER_12 = 'over_12',
  OVER_15 = 'over_15',
  OVER_19 = 'over_19',
}

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  thumbnail!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column('enum', { enum: Age })
  age!: Age;

  @Column()
  place!: string;

  @Column('simple-array', { array: true })
  prices: string[] = [];

  @Column('simple-array', { array: true })
  tiers: string[] = [];

  @Column()
  time!: string;
}
