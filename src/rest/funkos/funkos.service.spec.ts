import { Test, TestingModule } from '@nestjs/testing'
import { FunkosService } from './funkos.service'
import { DeleteResult, Repository } from 'typeorm'
import { Funko } from './entities/funko.entity'
import { Category } from '../categories/entities/category.entity'
import { CategoryMapper } from '../categories/mappers/category-mapper'
import { FunkoMapper } from './mappers/funko-mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ResponseFunkoDto } from './dto/response-funko.dto'
import { NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'

describe('FunkosService', () => {
  let service: FunkosService
  let funkoRepository: Repository<Funko>
  let categoryRepository: Repository<Category>
  let mapper: FunkoMapper

  const mapperMock = {
    CreatetoEntity: jest.fn(),
    toEntity: jest.fn(),
    toDto: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FunkosService,
        { provide: getRepositoryToken(Funko), useClass: Repository },
        { provide: getRepositoryToken(Category), useClass: Repository },
        { provide: FunkoMapper, useValue: mapperMock },
      ],
    }).compile()

    service = module.get<FunkosService>(FunkosService)
    funkoRepository = module.get(getRepositoryToken(Funko))
    categoryRepository = module.get(getRepositoryToken(Category))
    mapper = module.get<FunkoMapper>(FunkoMapper)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    const funkos = []
    const funko = new Funko()
    const funkoDto = new ResponseFunkoDto()

    beforeEach(() => {
      const category = new Category()
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funko.id = 1
      funko.name = 'Pepe'
      funko.image = 'http://localhost/pepe.jpg'
      funko.quantity = 19
      funko.price = 20
      funko.createdAt = new Date()
      funko.updatedAt = new Date()
      funko.category = category
      funkos.push(category)

      funkoDto.id = funko.id
      funkoDto.name = funko.name
      funkoDto.image = funko.image
      funkoDto.price = funko.price
      funkoDto.quantity = funko.quantity
      funkoDto.updatedAt = funko.updatedAt
      funkoDto.createdAt = funko.createdAt
      funkoDto.category = funko.category.name
    })

    it('should return array with funkos', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(funkos),
      } as any)

      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)

      const result = await service.findAll()

      expect(result.length).toBeGreaterThan(0)
      expect(result[0].name).toBe(funko.name)
      expect(result[0].id).toBe(funko.id)
      expect(result[0].category).toBe(funkoDto.category)
      expect(result[0].image).toBe(funko.image)
      expect(result[0].price).toBe(funko.price)
      expect(result[0].quantity).toBe(funko.quantity)
    })

    it('should return empty array', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      } as any)

      const result = await service.findAll()

      expect(result.length).toBe(0)
    })
  })

  describe('findById', () => {
    const funko = new Funko()
    const funkoDto = new ResponseFunkoDto()

    beforeEach(() => {
      const category = new Category()
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funko.id = 1
      funko.name = 'Pepe'
      funko.image = 'http://localhost/pepe.jpg'
      funko.quantity = 19
      funko.price = 20
      funko.createdAt = new Date()
      funko.updatedAt = new Date()
      funko.category = category

      funkoDto.id = funko.id
      funkoDto.name = funko.name
      funkoDto.image = funko.image
      funkoDto.price = funko.price
      funkoDto.quantity = funko.quantity
      funkoDto.updatedAt = funko.updatedAt
      funkoDto.createdAt = funko.createdAt
      funkoDto.category = funko.category.name
    })

    it('should return funko', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(funko),
      } as any)

      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)

      const result = await service.findById(funko.id)

      expect(result.name).toBe(funko.name)
      expect(result.id).toBe(funko.id)
      expect(result.image).toBe(funko.image)
      expect(result.price).toBe(funko.price)
      expect(result.quantity).toBe(funko.quantity)
      expect(result.category).toBe(funko.category.name)
    })

    it('should throw NotFoundException', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any)

      await expect(service.findById(funko.id)).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.findById(funko.id)).rejects.toThrowError(
        `El funko con id ${funko.id} no existe`,
      )
    })
  })

  describe('create', () => {
    const funko = new Funko()
    const funkoDto = new ResponseFunkoDto()
    const createFunko = new CreateFunkoDto()
    const category = new Category()

    beforeEach(() => {
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funko.id = 1
      funko.name = 'Pepe'
      funko.image = 'http://localhost/pepe.jpg'
      funko.quantity = 19
      funko.price = 20
      funko.createdAt = new Date()
      funko.updatedAt = new Date()
      funko.category = category

      funkoDto.id = funko.id
      funkoDto.name = funko.name
      funkoDto.image = funko.image
      funkoDto.price = funko.price
      funkoDto.quantity = funko.quantity
      funkoDto.updatedAt = funko.updatedAt
      funkoDto.createdAt = funko.createdAt
      funkoDto.category = funko.category.name

      createFunko.name = funko.name
      createFunko.price = funko.price
      createFunko.image = funko.image
      createFunko.quantity = funko.quantity
      createFunko.category = funko.category.name
    })

    it('should create funkos, is valid funko', async () => {
      createFunko.category = undefined
      jest.spyOn(mapper, 'CreatetoEntity').mockReturnValue(funko)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(funko)
      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)

      const result = await service.create(createFunko)

      expect(result.name).toBe(funko.name)
      expect(result.id).toBe(funko.id)
      expect(result.image).toBe(funko.image)
      expect(result.price).toBe(funko.price)
      expect(result.quantity).toBe(funko.quantity)
    })

    it('should create funko with correct cartegory', async () => {
      createFunko.category = category.name
      jest.spyOn(mapper, 'CreatetoEntity').mockReturnValue(funko)
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(funko)
      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)

      const result = await service.create(createFunko)

      expect(result.name).toBe(funko.name)
      expect(result.id).toBe(funko.id)
      expect(result.image).toBe(funko.image)
      expect(result.price).toBe(funko.price)
      expect(result.quantity).toBe(funko.quantity)
    })

    it('should not create funko because category not exist', async () => {
      jest.spyOn(mapper, 'CreatetoEntity').mockReturnValue(funko)
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(funko)
      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)
      await expect(service.create(createFunko)).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.create(createFunko)).rejects.toThrowError(
        `La categoria ${createFunko.category} no existe o no esta activa`,
      )
    })

    it('should not create funkos because category is not active', async () => {
      category.active = false
      jest.spyOn(mapper, 'CreatetoEntity').mockReturnValue(funko)
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(funko)
      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)
      await expect(service.create(createFunko)).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.create(createFunko)).rejects.toThrowError(
        `La categoria ${createFunko.category} no existe o no esta activa`,
      )
    })
  })

  describe('update', () => {
    const funko = new Funko()
    const funkoDto = new ResponseFunkoDto()
    const updateFunkoDto = new UpdateFunkoDto()
    const category = new Category()

    beforeEach(() => {
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funko.id = 1
      funko.name = 'Pepe'
      funko.image = 'http://localhost/pepe.jpg'
      funko.quantity = 19
      funko.price = 20
      funko.createdAt = new Date()
      funko.updatedAt = new Date()
      funko.category = category

      funkoDto.id = funko.id
      funkoDto.name = funko.name
      funkoDto.image = funko.image
      funkoDto.price = funko.price
      funkoDto.quantity = funko.quantity
      funkoDto.updatedAt = funko.updatedAt
      funkoDto.createdAt = funko.createdAt
      funkoDto.category = funko.category.name

      updateFunkoDto.name = funko.name
      updateFunkoDto.price = funko.price
      updateFunkoDto.image = funko.image
      updateFunkoDto.quantity = funko.quantity
      updateFunkoDto.category = funko.category.name
    })

    it('should update funko, funko is valid', async () => {
      jest.spyOn(mapper, 'toEntity').mockReturnValue(funko)
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(funko)
      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)

      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(funko),
      } as any)

      const result = await service.update(funko.id, updateFunkoDto)

      expect(result.name).toBe(funko.name)
      expect(result.id).toBe(funko.id)
      expect(result.image).toBe(funko.image)
      expect(result.price).toBe(funko.price)
      expect(result.quantity).toBe(funko.quantity)
      expect(result.category).toBe(funko.category.name)
    })

    it('should not update, funko not found', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any)

      await expect(service.update(funko.id, updateFunkoDto)).rejects.toThrow(
        NotFoundException,
      )

      await expect(
        service.update(funko.id, updateFunkoDto),
      ).rejects.toThrowError(`El funko con id ${funko.id} no existe`)
    })

    it('should not update, category not exists', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(funko),
      } as any)

      jest.spyOn(mapper, 'toEntity').mockReturnValue(funko)
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null)

      await expect(service.update(funko.id, updateFunkoDto)).rejects.toThrow(
        NotFoundException,
      )
      await expect(
        service.update(funko.id, updateFunkoDto),
      ).rejects.toThrowError(
        `La categoria ${updateFunkoDto.category} no existe o no esta activa`,
      )
    })

    it('should not update, with category inactive', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(funko),
      } as any)

      jest.spyOn(mapper, 'toEntity').mockReturnValue(funko)
      category.active = false
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category)

      await expect(service.update(funko.id, updateFunkoDto)).rejects.toThrow(
        NotFoundException,
      )
      await expect(
        service.update(funko.id, updateFunkoDto),
      ).rejects.toThrowError(
        `La categoria ${updateFunkoDto.category} no existe o no esta activa`,
      )
    })

    it('should update without category', async () => {
      jest.spyOn(mapper, 'toEntity').mockReturnValue(funko)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(funko)
      jest.spyOn(mapper, 'toDto').mockReturnValue(funkoDto)

      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(funko),
      } as any)

      updateFunkoDto.category = undefined
      const result = await service.update(funko.id, updateFunkoDto)

      expect(result.name).toBe(funko.name)
      expect(result.id).toBe(funko.id)
      expect(result.image).toBe(funko.image)
      expect(result.price).toBe(funko.price)
      expect(result.quantity).toBe(funko.quantity)
      expect(result.category).toBe(funko.category.name)
    })
  })

  describe('remove', () => {
    const funko = new Funko()
    const category = new Category()

    beforeEach(() => {
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funko.id = 1
      funko.name = 'Pepe'
      funko.image = 'http://localhost/pepe.jpg'
      funko.quantity = 19
      funko.price = 20
      funko.createdAt = new Date()
      funko.updatedAt = new Date()
      funko.category = category
    })

    it('should remove funko', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(funko),
      } as any)

      jest.spyOn(funkoRepository, 'remove').mockResolvedValue(funko)

      await service.remove(funko.id)

      expect(funkoRepository.remove).toHaveBeenCalledTimes(1)
    })

    it('should not remove funko, not found', async () => {
      jest.spyOn(funkoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any)

      await expect(service.remove(funko.id)).rejects.toThrow(NotFoundException)
      await expect(service.remove(funko.id)).rejects.toThrowError(
        `El funko con id ${funko.id} no existe`,
      )
    })
  })
})
