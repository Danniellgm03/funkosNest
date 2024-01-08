import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { Category } from './entities/category.entity'
import { raw } from 'express'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { DeleteResult } from 'typeorm'

describe('CategoriesController', () => {
  let controller: CategoriesController
  let service: CategoriesService

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoryService },
      ],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    service = module.get<CategoriesService>(CategoriesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
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
      jest.spyOn(service, 'findAll').mockResolvedValue(categories)

      const result = await controller.findAll()

      expect(result[0]).toEqual(category)
      expect(result[0].name).toBe(result[0].name)
      expect(result[0].id).toBe(result[0].id)
      expect(result[0].active).toBe(result[0].active)
    })

    it('should return empty', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([])

      const result = await controller.findAll()

      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    const category = new Category()
    beforeEach(() => {
      category.id = '96f0da7e-2d33-4e54-b502-625fecb38257'
      category.name = 'DISNEY'
      category.active = true
      category.createdAt = new Date()
      category.updatedAt = new Date()
    })

    it('should return category', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(category)

      const result = await controller.findOne(category.id)

      expect(result.id).toBe(category.id)
      expect(result.name).toBe(category.name)
      expect(result.active).toBe(category.active)
    })

    it('should return not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException())

      await expect(controller.findOne(category.id)).rejects.toThrow(
        NotFoundException,
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
      jest.spyOn(service, 'create').mockResolvedValue(category)

      const result = await controller.create(categoryCreateDto)

      expect(result.active).toBe(category.active)
      expect(result.name).toBe(category.name)
    })

    it('should not create category ,already exists', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException())

      await expect(controller.create(categoryCreateDto)).rejects.toThrow(
        BadRequestException,
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
      updateCategoryDto.active = true
    })

    it('should update category', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(category)

      const result = await controller.update(category.id, updateCategoryDto)

      expect(result.id).toBe(category.id)
      expect(result.active).toBe(updateCategoryDto.active)
      expect(result.name).toBe(updateCategoryDto.name)
    })

    it('should not update, category not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())

      const result = controller.update(category.id, updateCategoryDto)

      await expect(result).rejects.toThrow(NotFoundException)
    })

    it('should not update, category with same name existe', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())

      const result = controller.update(category.id, updateCategoryDto)

      await expect(result).rejects.toThrow(BadRequestException)
    })

    it('should not update, category name and active != undefined', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())

      const result = controller.update(category.id, updateCategoryDto)

      await expect(result).rejects.toThrow(BadRequestException)
    })
  })

  describe('remove', () => {
    it('should remove category', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue()

      await controller.remove('96f0da7e-2d33-4e54-b502-625fecb38257')

      expect(service.remove).toHaveBeenCalledTimes(1)
    })

    it('should not remove, category not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException())

      const result = controller.remove('96f0da7e-2d33-4e54-b502-625fecb38257')

      await expect(result).rejects.toThrow(NotFoundException)
    })

    it('should not remove, category has funkos', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new BadRequestException())

      const result = controller.remove('96f0da7e-2d33-4e54-b502-625fecb38257')

      await expect(result).rejects.toThrow(BadRequestException)
    })
  })
})
