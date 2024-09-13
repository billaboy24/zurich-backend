/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productCode: string;

  @Column()
  productDesc: string;

  @Column()
  location: string;

  @Column()
  price: string;
}
