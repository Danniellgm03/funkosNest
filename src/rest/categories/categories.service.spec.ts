import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesService } from './categories.service'
import { DeleteResult, Repository } from 'typeorm'
import { Funko } from '../funkos/entities/funko.entity'
import { CategoryMapper } from './mappers/category-mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

describe('CategoriesService', () => {
  let service: CategoriesService
  let funkoRepository: Repository<Funko>
  let categoryRepository: Repository<Category>
  let mapper: CategoryMapper

  const mapperMock = {
    toDto: jest.fn(),
    toEntity: jest.fn(),
    updateToEntity: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Funko), useClass: Repository },
        { provide: getRepositoryToken(Category), useClass: Repository },
        { provide: CategoryMapper, useValue: mapperMock },
      ],
    }).compile()
    service = module.get<CategoriesService>(CategoriesService)
    funkoRepository = module.get(getRepositoryToken(Funko))
    categoryRepository = module.get(getRepositoryToken(Category))
    mapper = module.get<CategoryMapper>(CategoryMapper)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    const categories = []
    const category = new Category()
    beforeEach(() => {
      category.id = '96f0da7e-2d33-4e54-b502-625fecb38257'
      category.name = 'DISNEY'
      category.active = true
      category.createdAt = new Date()
      category.updatedAt = new Date()
      categories.push(category)
    })

    it('should return all categories', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(categories)

      const result = await service.findAll()
      expect(result[0]).toEqual(category)
      expect(result[0].name).toBe(result[0].name)
      expect(result[0].id).toBe(result[0].id)
      expect(result[0].active).toBe(result[0].active)
    })

    it('should return empty list categories', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([])

      const result = await service.findAll()
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    const category = new Category()

    beforeEach(() => {
      category.id = '96f0da7e-2d33-4e54-b502-625fecb38257'
      category.name = 'DISNEY'
      category.active = true
      category.createdAt = new Date()
      category.updatedAt = new Date()
    })

    it('should return category valid', async () => {
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category)

      const result = await service.findById(category.id)
      expect(result).toEqual(category)
    })

    it('should return category not found exception', async () => {
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null)

      await expect(service.findById(category.id)).rejects.toThrow(
        NotFoundException,
      )

      await expect(service.findById(category.id)).rejects.toThrowError(
        `La categoria con el id: ${category.id} no existe`,
      )
    })
  })

  describe('create', () => {
    const category = new Category()
    const categoryCreateDto = new CreateCategoryDto()

    beforeEach(() => {
      category.name = 'DISNEY'
      category.active = true
      category.createdAt = new Date()
      category.updatedAt = new Date()

      categoryCreateDto.name = 'DISNEY'
      categoryCreateDto.active = true
    })

    it('should create category', async () => {
      jest.spyOn(mapper, 'toEntity').mockReturnValue(category)
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(category)
      jest.spyOn(service, 'exists').mockResolvedValue(false)

      const result = await service.create(categoryCreateDto)
      expect(result.name).toBe(category.name)
      expect(result.active).toBeTruthy()
      expect(result.id).toMatch(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      )
    })

    it('should not create category because the nama already exists', async () => {
      jest.spyOn(service, 'exists').mockResolvedValue(true)

      await expect(service.create(categoryCreateDto)).rejects.toThrow(
        BadRequestException,
      )

      await expect(service.create(categoryCreateDto)).rejects.toThrowError(
        `La categoria con el nombre ${categoryCreateDto.name} ya existe`,
      )
    })
  })

  describe('update', () => {
    const category = new Category()
    let responseCategory
    const updateCategoryDto = new UpdateCategoryDto()

    beforeEach(() => {
      category.id = '96f0da7e-2d33-4e54-b502-625fecb38257'
      category.name = 'DISNEY'
      category.active = true
      category.createdAt = new Date()
      category.updatedAt = new Date()

      responseCategory = {
        ...category,
        active: false,
      }

      updateCategoryDto.name = 'DISNEY'
      updateCategoryDto.active = false
    })

    it('should update category', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(responseCategory)

      const result = await service.update(category.id, updateCategoryDto)

      expect(result.name).toBe(responseCategory.name)
      expect(result.active).toBeFalsy()
      expect(result.id).toBe(responseCategory.id)
    })

    it('should update category with name only', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      responseCategory.name = 'pepe'
      responseCategory.active = true
      jest.spyOn(service, 'exists').mockResolvedValue(false)
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(responseCategory)
      updateCategoryDto.name = 'pepe'
      updateCategoryDto.active = undefined

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrow(BadRequestException)

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrowError(
        'Para actualizar una categoria es necesario los siguientes datos (name, active)',
      )
    })

    it('should update category with active only', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      responseCategory.active = false
      jest.spyOn(service, 'exists').mockResolvedValue(false)
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(responseCategory)
      updateCategoryDto.name = undefined
      updateCategoryDto.active = false

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrow(BadRequestException)

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrowError(
        'Para actualizar una categoria es necesario los siguientes datos (name, active)',
      )
    })

    it('should update category without changes in name and active', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      responseCategory.active = undefined
      jest.spyOn(service, 'exists').mockResolvedValue(false)
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(responseCategory)
      updateCategoryDto.name = undefined
      updateCategoryDto.active = undefined

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrow(BadRequestException)

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrowError(
        'Para actualizar una categoria es necesario los siguientes datos (name, active)',
      )
    })

    it('should not update category, not found', async () => {
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null)

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrow(NotFoundException)

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrowError(`La categoria con el id: ${category.id} no existe`)
    })

    it('should not update category, with diferent name and already exists', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      jest.spyOn(service, 'exists').mockResolvedValue(true)
      updateCategoryDto.name = 'pepe'

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrow(BadRequestException)

      await expect(
        service.update(category.id, updateCategoryDto),
      ).rejects.toThrowError(
        `La categoria con el nombre ${updateCategoryDto.name} ya existe`,
      )
    })

    it('should not update category, with diferent name but not exist', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      jest.spyOn(service, 'exists').mockResolvedValue(false)
      responseCategory.name = 'pepe'
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(responseCategory)
      updateCategoryDto.name = 'pepe'

      const result = await service.update(category.id, updateCategoryDto)

      expect(result.name).toBe(responseCategory.name)
      expect(result.id).toBe(responseCategory.id)
      expect(result.active).toBe(responseCategory.active)
    })
  })

  describe('remove', () => {
    const category = new Category()

    beforeEach(() => {
      category.id = '96f0da7e-2d33-4e54-b502-625fecb38257'
      category.name = 'DISNEY'
      category.active = true
      category.createdAt = new Date()
      category.updatedAt = new Date()
    })
    it('should remove category', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      jest.spyOn(funkoRepository, 'count').mockResolvedValue(0)
      jest
        .spyOn(categoryRepository, 'delete')
        .mockResolvedValue(new DeleteResult())

      await service.remove(category.id)

      expect(categoryRepository.delete).toHaveBeenCalledTimes(1)
    })

    it('should not remove category, not found', async () => {
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null)

      await expect(service.remove(category.id)).rejects.toThrow(
        NotFoundException,
      )

      await expect(service.remove(category.id)).rejects.toThrowError(
        `La categoria con el id: ${category.id} no existe`,
      )
    })

    it('should not remove category, has funkos', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)
      jest.spyOn(funkoRepository, 'count').mockResolvedValue(1)

      await expect(service.remove(category.id)).rejects.toThrow(
        BadRequestException,
      )

      await expect(service.remove(category.id)).rejects.toThrowError(
        'La categoria tiene funkos asociados',
      )
    })
  })

  describe('exists', () => {
    it('should return true', async () => {
      const createQueryBuilderSpy = jest.spyOn(
        categoryRepository,
        'createQueryBuilder',
      )
      createQueryBuilderSpy.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getExists: jest.fn().mockResolvedValue(true),
      } as any)

      const result = await service.exists('DISNEY')

      expect(result).toBeTruthy()
    })

    it('should return false', async () => {
      const createQueryBuilderSpy = jest.spyOn(
        categoryRepository,
        'createQueryBuilder',
      )
      createQueryBuilderSpy.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getExists: jest.fn().mockResolvedValue(false),
      } as any)

      const result = await service.exists('DISNEY')

      expect(result).toBeFalsy()
    })
  })
})
