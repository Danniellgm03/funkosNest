import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { CategoryMapper } from './mappers/category-mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { Funko } from '../funkos/entities/funko.entity'
import { NotificationsModule } from '../../websockets/notifications/notifications.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Funko]),
    NotificationsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryMapper],
})
export class CategoriesModule {}
