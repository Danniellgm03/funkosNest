import { Injectable } from '@nestjs/common'
import { Funko } from '../entities/funko.entity'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import { Category } from '../../categories/entities/category.entity'

@Injectable()
export class FunkoMapper {
  toCreateDto(entity: Funko) {
    const dto = new CreateFunkoDto()
    dto.name = entity.name
    dto.price = entity.price
    dto.quantity = entity.quantity
    dto.image = entity.image
    dto.category = entity.category.name
    return dto
  }

  CreatetoEntity(dto: CreateFunkoDto) {
    const entity = new Funko()
    entity.name = dto.name
    entity.price = dto.price
    entity.quantity = dto.quantity
    entity.image = dto.image
    entity.createdAt = new Date()
    entity.updatedAt = new Date()
    return entity
  }

  CreatetoEntityWithCategory(dto: CreateFunkoDto, category: Category) {
    const entity = new Funko()
    entity.name = dto.name
    entity.price = dto.price
    entity.quantity = dto.quantity
    entity.image = dto.image
    entity.createdAt = new Date()
    entity.updatedAt = new Date()
    entity.category = category
    return entity
  }

  toDto(entity: Funko) {
    const dto = new ResponseFunkoDto()
    dto.id = entity.id
    dto.name = entity.name
    dto.price = entity.price
    dto.quantity = entity.quantity
    dto.image = entity.image
    dto.category = entity?.category?.name ?? ''
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }

  toEntity(dto: ResponseFunkoDto) {
    const entity = new Funko()
    entity.id = dto.id
    entity.name = dto.name
    entity.price = dto.price
    entity.quantity = dto.quantity
    entity.image = dto.image
    entity.createdAt = dto.createdAt
    entity.updatedAt = dto.updatedAt
    return entity
  }

  toEntityWithCategory(dto: Funko, category: Category) {
    const entity = new Funko()
    entity.id = dto.id
    entity.name = dto.name
    entity.price = dto.price
    entity.quantity = dto.quantity
    entity.image = dto.image
    entity.category = category
    entity.createdAt = dto.createdAt
    entity.updatedAt = dto.updatedAt
    return entity
  }
}
