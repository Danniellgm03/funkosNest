import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Category } from '../../categories/entities/category.entity'

@Entity('funkos')
export class Funko {
  public static IMAGE_DEFAULT = 'https://via.placeholder.com/150'

  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 255, nullable: false })
  name: string

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  price: number

  @Column('int', { nullable: false })
  quantity: number

  @Column('varchar', {
    length: 255,
    nullable: false,
    default: Funko.IMAGE_DEFAULT,
  })
  image: string

  @ManyToOne(() => Category, (category) => category.funkos)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
