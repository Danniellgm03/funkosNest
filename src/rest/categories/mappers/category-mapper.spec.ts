import { Test, TestingModule } from '@nestjs/testing'
import { CategoryMapper } from './category-mapper'
import { Category } from '../entities/category.entity'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'

describe('CategoryMapper', () => {
  let provider: CategoryMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryMapper],
    }).compile()

    provider = module.get<CategoryMapper>(CategoryMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  describe('toDto', () => {
    it('toDto mapper', () => {
      const c = new Category()
      c.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      c.name = 'DISNEY'
      c.active = true
      const dto = provider.toDto(c)

      expect(dto.name).toBe(c.name)
      expect(dto.active).toBe(c.active)
    })
  })

  describe('toEntity', () => {
    it('toEntity mapper', () => {
      const dto = new CreateCategoryDto()
      dto.name = 'DISNEY'
      dto.active = true
      const entity = provider.toEntity(dto)

      expect(entity.name).toBe(dto.name)
      expect(entity.active).toBe(dto.active)
    })

    it('toEntity mapper 2', () => {
      const dto = new CreateCategoryDto()
      dto.name = 'DISNEY'
      dto.active = false
      const entity = provider.toEntity(dto)

      expect(entity.name).toBe(dto.name)
      expect(entity.active).toBe(dto.active)
    })
  })

  describe('updateToEntity', () => {
    it('updateToEntity mapper', () => {
      const dto = new UpdateCategoryDto()
      dto.name = 'DISNEY'
      dto.active = true
      const entity = provider.updateToEntity(dto)

      expect(entity.name).toBe(dto.name)
      expect(entity.active).toBe(dto.active)
    })
  })
})
