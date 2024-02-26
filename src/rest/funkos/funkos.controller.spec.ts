import { Test, TestingModule } from '@nestjs/testing'
import { FunkosController } from './funkos.controller'
import { FunkosService } from './funkos.service'
import { Funko } from './entities/funko.entity'
import { ResponseFunkoDto } from './dto/response-funko.dto'
import { Category } from '../categories/entities/category.entity'
import { NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { Not } from 'typeorm'
import { Paginated, SortBy } from 'nestjs-paginate'

describe('FunkosController', () => {
  let controller: FunkosController
  let service: FunkosService

  const mockFunkoService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateImage: jest.fn(),
    findAllQuery: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunkosController],
      providers: [{ provide: FunkosService, useValue: mockFunkoService }],
    }).compile()

    controller = module.get<FunkosController>(FunkosController)
    service = module.get<FunkosService>(FunkosService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    const funkos = []
    const funkoDto = new ResponseFunkoDto()

    beforeEach(() => {
      const category = new Category()
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funkoDto.id = 1
      funkoDto.name = 'Pepe'
      funkoDto.image = 'http://localhost/pepe.jpg'
      funkoDto.quantity = 19
      funkoDto.price = 20
      funkoDto.createdAt = new Date()
      funkoDto.updatedAt = new Date()
      funkoDto.category = category.name
      funkos.push(funkoDto)
    })

    it('should return all funkos', async () => {
      const resTest = new Paginated<ResponseFunkoDto>()
      resTest.data = funkos

      jest.spyOn(service, 'findAllQuery').mockResolvedValue(resTest)

      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'funkos',
      }

      const result = await controller.findAll(paginateOptions)

      expect(result.data[0]).toEqual(funkoDto)
      expect(result.data[0].id).toBe(funkoDto.id)
      expect(result.data[0].name).toBe(funkoDto.name)
      expect(result.data[0].category).toBe(funkoDto.category)
      expect(result.data[0].image).toBe(funkoDto.image)
      expect(result.data[0].price).toBe(funkoDto.price)
      expect(result.data[0].quantity).toBe(funkoDto.quantity)
    })

    it('should return empty array', async () => {
      const resTest = new Paginated<ResponseFunkoDto>()
      resTest.data = []

      jest.spyOn(service, 'findAllQuery').mockResolvedValue(resTest)

      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'funkos',
      }

      const result = await controller.findAll(paginateOptions)

      expect(result.data).toEqual([])
    })
  })

  describe('findById', () => {
    const funkoDto = new ResponseFunkoDto()

    beforeEach(() => {
      const category = new Category()
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funkoDto.id = 1
      funkoDto.name = 'Pepe'
      funkoDto.image = 'http://localhost/pepe.jpg'
      funkoDto.quantity = 19
      funkoDto.price = 20
      funkoDto.createdAt = new Date()
      funkoDto.updatedAt = new Date()
      funkoDto.category = category.name
    })

    it('should return funko', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(funkoDto)

      const result = await controller.findById(funkoDto.id)

      expect(result.id).toBe(funkoDto.id)
      expect(result.name).toBe(funkoDto.name)
      expect(result.price).toBe(funkoDto.price)
      expect(result.quantity).toBe(funkoDto.quantity)
      expect(result.image).toBe(funkoDto.image)
      expect(result.category).toBe(funkoDto.category)
    })

    it('should not return funko, NotFoundException', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException())

      const result = controller.findById(funkoDto.id)

      await expect(result).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    const funkoDto = new ResponseFunkoDto()
    const createFunko = new CreateFunkoDto()
    const category = new Category()

    beforeEach(() => {
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funkoDto.id = 1
      funkoDto.name = 'Pepe'
      funkoDto.image = 'http://localhost/pepe.jpg'
      funkoDto.quantity = 19
      funkoDto.price = 20
      funkoDto.createdAt = new Date()
      funkoDto.updatedAt = new Date()
      funkoDto.category = category.name

      createFunko.name = funkoDto.name
      createFunko.price = funkoDto.price
      createFunko.image = funkoDto.image
      createFunko.quantity = funkoDto.quantity
      createFunko.category = funkoDto.category
    })

    it('should create funko', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(funkoDto)

      const result = await controller.create(createFunko)

      expect(result.name).toBe(funkoDto.name)
      expect(result.price).toBe(funkoDto.price)
      expect(result.image).toBe(funkoDto.image)
      expect(result.quantity).toBe(funkoDto.quantity)
    })

    it('should create funko, without category', async () => {
      funkoDto.category = undefined
      createFunko.category = undefined
      jest.spyOn(service, 'create').mockResolvedValue(funkoDto)

      const result = await controller.create(createFunko)

      expect(result.name).toBe(funkoDto.name)
      expect(result.image).toBe(funkoDto.image)
      expect(result.category).toBe(funkoDto.category)
      expect(result.quantity).toBe(funkoDto.quantity)
      expect(result.price).toBe(funkoDto.price)
    })

    it('should not create funko because category not exists', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())

      const result = controller.create(createFunko)

      await expect(result).rejects.toThrow(NotFoundException)
    })

    it('should not create funko because category is not active', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())

      const result = controller.create(createFunko)

      await expect(result).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    const funkoDto = new ResponseFunkoDto()
    const updateFunkoDto = new UpdateFunkoDto()
    const category = new Category()

    beforeEach(() => {
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funkoDto.id = 1
      funkoDto.name = 'Pepe'
      funkoDto.image = 'http://localhost/pepe.jpg'
      funkoDto.quantity = 19
      funkoDto.price = 20
      funkoDto.createdAt = new Date()
      funkoDto.updatedAt = new Date()
      funkoDto.category = category.name

      updateFunkoDto.name = funkoDto.name
      updateFunkoDto.price = funkoDto.price
      updateFunkoDto.image = funkoDto.image
      updateFunkoDto.quantity = funkoDto.quantity
      updateFunkoDto.category = funkoDto.category
    })

    it('should update funko', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(funkoDto)

      const result = await controller.update(funkoDto.id, updateFunkoDto)

      expect(result.name).toBe(funkoDto.name)
      expect(result.id).toBe(funkoDto.id)
      expect(result.image).toBe(funkoDto.image)
      expect(result.quantity).toBe(funkoDto.quantity)
      expect(result.price).toBe(funkoDto.price)
      expect(result.category).toBe(funkoDto.category)
    })

    it('should not update, funko not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())

      const result = controller.update(funkoDto.id, updateFunkoDto)

      await expect(result).rejects.toThrow(NotFoundException)
    })

    it('should not update, category not exists', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())

      const result = controller.update(funkoDto.id, updateFunkoDto)

      await expect(result).rejects.toThrow(NotFoundException)
    })

    it('should not update, category inactive', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())

      const result = controller.update(funkoDto.id, updateFunkoDto)

      await expect(result).rejects.toThrow(NotFoundException)
    })

    it('should update without category', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(funkoDto)

      updateFunkoDto.category = undefined

      const result = await controller.update(funkoDto.id, updateFunkoDto)

      expect(result.name).toBe(funkoDto.name)
      expect(result.id).toBe(funkoDto.id)
      expect(result.image).toBe(funkoDto.image)
      expect(result.quantity).toBe(funkoDto.quantity)
      expect(result.price).toBe(funkoDto.price)
    })
  })

  describe('remove', () => {
    it('should remove funko', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue()

      await controller.remove(1)

      expect(service.remove).toHaveBeenCalledTimes(1)
    })

    it('should not remove funko, not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException())

      const result = controller.remove(1)

      await expect(result).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateImage', () => {
    const funkoDto = new ResponseFunkoDto()
    const updateFunkoDto = new UpdateFunkoDto()
    const category = new Category()

    beforeEach(() => {
      category.id = '7f1e1546-79e5-49d5-9b58-dc353ae82f97'
      category.name = 'DISNEY'
      category.active = true

      funkoDto.id = 1
      funkoDto.name = 'Pepe'
      funkoDto.image = 'http://localhost/pepe.jpg'
      funkoDto.quantity = 19
      funkoDto.price = 20
      funkoDto.createdAt = new Date()
      funkoDto.updatedAt = new Date()
      funkoDto.category = category.name

      updateFunkoDto.name = funkoDto.name
      updateFunkoDto.price = funkoDto.price
      updateFunkoDto.image = funkoDto.image
      updateFunkoDto.quantity = funkoDto.quantity
      updateFunkoDto.category = funkoDto.category
    })

    it('should update image', async () => {
      jest.spyOn(service, 'updateImage').mockResolvedValue(funkoDto)
      const mockFile = {} as Express.Multer.File
      const mockReq = {} as any

      const result = await controller.updateImage(
        funkoDto.id,
        mockFile,
        mockReq,
      )

      expect(result.name).toBe(funkoDto.name)
      expect(result.id).toBe(funkoDto.id)
      expect(result.image).toBe(funkoDto.image)
      expect(result.quantity).toBe(funkoDto.quantity)
      expect(result.price).toBe(funkoDto.price)
      expect(result.category).toBe(funkoDto.category)
    })
  })
})
