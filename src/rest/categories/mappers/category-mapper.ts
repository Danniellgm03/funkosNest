import { Injectable } from '@nestjs/common'
import { Category } from '../entities/category.entity'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'

@Injectable()
export class CategoryMapper {
  toDto(entity: Category) {
    const dto: CreateCategoryDto = new CreateCategoryDto()
    dto.name = entity.name
    dto.active = entity.active
  }

  toEntity(dto: CreateCategoryDto) {
    const entity = new Category()
    entity.name = dto.name
    entity.active = dto.active ? true : false
    return entity
  }

  updateToEntity(dto: UpdateCategoryDto) {
    const entity = new Category()
    entity.name = dto.name
    entity.active = dto.active
    return entity
  }
}
