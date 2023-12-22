import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Funko } from '../../funkos/entities/funko.entity'

@Entity('categories')
export class Category {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column('varchar', { length: 255, nullable: false })
  name: string

  @Column('boolean', { nullable: false, default: false })
  active: boolean

  @OneToMany(() => Funko, (funko) => funko.category)
  funkos: Funko[]

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
