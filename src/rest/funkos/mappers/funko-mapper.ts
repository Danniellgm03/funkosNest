import { Injectable } from '@nestjs/common'
import { Funko } from '../entities/funko.entity'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { ResponseFunkoDto } from '../dto/response-funko.dto'

@Injectable()
export class FunkoMapper {
  toCreateDto(entity: Funko) {
    const dto = new CreateFunkoDto()
    dto.name = entity.name
    dto.price = entity.price
    dto.quantity = entity.quantity
    dto.image = entity.image
    dto.category = entity.category
    return dto
  }

  CreatetoEntity(dto: CreateFunkoDto) {
    const entity = new Funko()
    entity.name = dto.name
    entity.price = dto.price
    entity.quantity = dto.quantity
    entity.image = dto.image
    entity.category = dto.category
    entity.createdAt = new Date()
    entity.updatedAt = new Date()
    return entity
  }

  toDto(entity: Funko) {
    const dto = new ResponseFunkoDto()
    dto.id = entity.id
    dto.name = entity.name
    dto.price = entity.price
    dto.quantity = entity.quantity
    dto.image = entity.image
    dto.category = entity.category
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }

  toEntity(dto: Funko) {
    const entity = new Funko()
    entity.id = dto.id
    entity.name = dto.name
    entity.price = dto.price
    entity.quantity = dto.quantity
    entity.image = dto.image
    entity.category = dto.category
    entity.createdAt = dto.createdAt
    entity.updatedAt = dto.updatedAt
    return entity
  }
}
