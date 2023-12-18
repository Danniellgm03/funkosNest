import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { CategoryMapper } from './mappers/category-mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryMapper],
})
export class CategoriesModule {}
