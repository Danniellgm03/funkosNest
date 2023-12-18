import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Funko } from '../../funkos/entities/funko.entity'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 255, nullable: false })
  name: string

  @Column('boolean', { nullable: false, default: false })
  active: boolean

  @OneToMany(() => Funko, (funko) => funko.category)
  funkos: Funko[]
}
