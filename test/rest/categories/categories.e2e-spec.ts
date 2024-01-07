import {
  BadRequestException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common'
import { Category } from '../../../src/rest/categories/entities/category.entity'
import { CreateCategoryDto } from '../../../src/rest/categories/dto/create-category.dto'
import { UpdateCategoryDto } from '../../../src/rest/categories/dto/update-category.dto'
import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from '../../../src/rest/categories/categories.controller'
import { CategoriesService } from '../../../src/rest/categories/categories.service'
import * as request from 'supertest'

describe('CategoriesController (e2e)', () => {
  let app: INestApplication
  const myEndpoint = '/categories'

  const categoryEntity: Category = {
    id: '7958ef01-9fe0-4f19-a1d5-79c917290ddf',
    name: 'DISNEY',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    funkos: [],
  }

  const createCategoryDto: CreateCategoryDto = {
    name: 'MARVEL',
    active: true,
  }

  const updateCategoryDto: UpdateCategoryDto = {
    name: 'DC',
    active: false,
  }

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        { provide: CategoriesService, useValue: mockCategoryService },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /categories', () => {
    it('should return all categories', async () => {
      mockCategoryService.findAll.mockResolvedValue([categoryEntity])

      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)

      const expectedEntity = {
        ...categoryEntity,
        createdAt: categoryEntity.createdAt.toISOString(),
        updatedAt: categoryEntity.updatedAt.toISOString(),
      }

      expect(body).toEqual([expectedEntity])
      expect(mockCategoryService.findAll).toHaveBeenCalledTimes(1)
      mockCategoryService.findAll.mockClear()
    })

    it('should return empty array', async () => {
      mockCategoryService.findAll.mockResolvedValue([])

      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)

      expect(body).toEqual([])
      expect(mockCategoryService.findAll).toHaveBeenCalledTimes(1)
      mockCategoryService.findAll.mockClear()
    })
  })

  describe('GET /categories/:id', () => {
    it('should return category', async () => {
      mockCategoryService.findById.mockResolvedValue(categoryEntity)

      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}/${categoryEntity.id}`)
        .expect(200)

      const expectedEntity = {
        ...categoryEntity,
        createdAt: categoryEntity.createdAt.toISOString(),
        updatedAt: categoryEntity.updatedAt.toISOString(),
      }

      expect(body).toEqual(expectedEntity)
      expect(mockCategoryService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throw error, category not found', async () => {
      mockCategoryService.findById.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .get(`${myEndpoint}/${categoryEntity.id}`)
        .expect(404)
    })
  })

  describe('POST /categories', () => {
    it('should create category', async () => {
      mockCategoryService.create.mockResolvedValue(categoryEntity)

      const expectedEntity = {
        ...categoryEntity,
        createdAt: categoryEntity.createdAt.toISOString(),
        updatedAt: categoryEntity.updatedAt.toISOString(),
      }

      const { body } = await request(app.getHttpServer())
        .post(myEndpoint)
        .send(createCategoryDto)
        .expect(201)

      expect(body).toEqual(expectedEntity)
      expect(mockCategoryService.create).toHaveBeenCalledTimes(1)
      mockCategoryService.create.mockClear()
    })

    it('should not create category, already exists', async () => {
      mockCategoryService.create.mockRejectedValue(new BadRequestException())

      await request(app.getHttpServer())
        .post(myEndpoint)
        .send(createCategoryDto)
        .expect(400)

      expect(mockCategoryService.create).toHaveBeenCalledTimes(1)
      mockCategoryService.create.mockClear()
    })
  })

  describe('PUT /categories/:id', () => {
    it('should update category', async () => {
      mockCategoryService.update.mockResolvedValue(categoryEntity)

      const expectedEntity = {
        ...categoryEntity,
        createdAt: categoryEntity.createdAt.toISOString(),
        updatedAt: categoryEntity.updatedAt.toISOString(),
      }

      const { body } = await request(app.getHttpServer())
        .put(`${myEndpoint}/${categoryEntity.id}`)
        .send(createCategoryDto)
        .expect(200)

      expect(body).toEqual(expectedEntity)
      expect(mockCategoryService.update).toHaveBeenCalledTimes(1)
      mockCategoryService.update.mockClear()
    })

    it('should not update, category not found', async () => {
      mockCategoryService.update.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .put(`${myEndpoint}/${categoryEntity.id}`)
        .send(createCategoryDto)
        .expect(404)

      expect(mockCategoryService.update).toHaveBeenCalledTimes(1)
      mockCategoryService.update.mockClear()
    })

    it('should not update, category with same name already exists', async () => {
      mockCategoryService.update.mockRejectedValue(new BadRequestException())

      await request(app.getHttpServer())
        .put(`${myEndpoint}/${categoryEntity.id}`)
        .send(createCategoryDto)
        .expect(400)

      expect(mockCategoryService.update).toHaveBeenCalledTimes(1)
      mockCategoryService.update.mockClear()
    })

    it('should not update, category name and active != undefined', async () => {
      mockCategoryService.update.mockRejectedValue(new BadRequestException())

      const badDto: UpdateCategoryDto = {
        name: 'DC',
        active: undefined,
      }

      await request(app.getHttpServer())
        .put(`${myEndpoint}/${categoryEntity.id}`)
        .send(badDto)
        .expect(400)

      expect(mockCategoryService.update).toHaveBeenCalledTimes(1)
      mockCategoryService.update.mockClear()
    })
  })

  describe('DELETE /categories/:id', () => {
    it('should remove category', async () => {
      mockCategoryService.remove.mockResolvedValue(categoryEntity)

      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${categoryEntity.id}`)
        .expect(204)

      expect(mockCategoryService.remove).toHaveBeenCalledTimes(1)
      mockCategoryService.remove.mockClear()
    })

    it('should not remove, category not found', async () => {
      mockCategoryService.remove.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${categoryEntity.id}`)
        .expect(404)

      expect(mockCategoryService.remove).toHaveBeenCalledTimes(1)
      mockCategoryService.remove.mockClear()
    })

    it('should not remove, category has funkos', async () => {
      mockCategoryService.remove.mockRejectedValue(new BadRequestException())

      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${categoryEntity.id}`)
        .expect(400)

      expect(mockCategoryService.remove).toHaveBeenCalledTimes(1)
      mockCategoryService.remove.mockClear()
    })
  })
})
