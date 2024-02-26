import { Test, TestingModule } from '@nestjs/testing'
import { FunkoMapper } from './funko-mapper'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { Funko } from '../entities/funko.entity'
import { Category } from '../../categories/entities/category.entity'
import { ResponseFunkoDto } from '../dto/response-funko.dto'

describe('FunkoMapper', () => {
  let provider: FunkoMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunkoMapper],
    }).compile()

    provider = module.get<FunkoMapper>(FunkoMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  describe('CreateToEntity', () => {
    it('CreateToEntity mapper', () => {
      const dto = new CreateFunkoDto()
      dto.name = 'PEPE'
      dto.category = 'DISNEY'
      dto.image = 'image'
      dto.quantity = 2
      dto.price = 10

      const entity = provider.CreatetoEntity(dto)

      expect(entity.name).toBe(dto.name)
      expect(entity.image).toBe(dto.image)
      expect(entity.quantity).toBe(dto.quantity)
      expect(entity.price).toBe(dto.price)
    })

    describe('toDto', () => {
      it('toDto entity', () => {
        const c = new Category()
        c.name = 'DISNEY'
        c.active = true
        c.id = '62191f4a-35f7-4d00-b790-326d6777d78c'
        const entity = new Funko()
        entity.id = 1
        entity.price = 10
        entity.category = c
        entity.name = 'Pepe'
        entity.image = 'image'
        entity.quantity = 2

        const dto = provider.toDto(entity)

        expect(dto.id).toBe(entity.id)
        expect(dto.name).toBe(entity.name)
        expect(dto.price).toBe(entity.price)
        expect(dto.quantity).toBe(entity.quantity)
        expect(dto.image).toBe(entity.image)
        expect(dto.category).toBe(entity.category.name)
      })

      it('toDto entity 2', () => {
        const entity = new Funko()
        entity.id = 1
        entity.price = 10
        entity.category = undefined
        entity.name = 'Pepe'
        entity.image = 'image'
        entity.quantity = 2

        const dto = provider.toDto(entity)

        expect(dto.id).toBe(entity.id)
        expect(dto.name).toBe(entity.name)
        expect(dto.price).toBe(entity.price)
        expect(dto.quantity).toBe(entity.quantity)
        expect(dto.image).toBe(entity.image)
        expect(dto.category).toBe('')
      })
    })

    describe('toEntity', () => {
      it('toEntity mapper', () => {
        const dto = new ResponseFunkoDto()
        dto.id = 1
        dto.name = 'Pepe'
        dto.price = 10
        dto.quantity = 2
        dto.image = 'image'
        dto.category = 'DISNEY'
        dto.createdAt = new Date()
        dto.updatedAt = new Date()

        const entity = provider.toEntity(dto)

        expect(entity.id).toBe(dto.id)
        expect(entity.name).toBe(dto.name)
        expect(entity.price).toBe(dto.price)
        expect(entity.quantity).toBe(dto.quantity)
        expect(entity.image).toBe(dto.image)
      })
    })
  })
})
