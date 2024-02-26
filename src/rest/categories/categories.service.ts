import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'
import { CategoryMapper } from './mappers/category-mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Funko } from '../funkos/entities/funko.entity'
import { NotificationsGateway } from '../../websockets/notifications/notifications.gateway'
import {
  Notification,
  NotificationType,
} from '../../websockets/notifications/models/notification.model'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor(
    private readonly CategoryMapper: CategoryMapper,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    private readonly notificationGateway: NotificationsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.exists(createCategoryDto.name)

    if (categoryExists) {
      this.logger.log(
        `La categoria con el nombre ${createCategoryDto.name} no se puede crear porque ya existe`,
      )
      throw new BadRequestException(
        `La categoria con el nombre ${createCategoryDto.name} ya existe`,
      )
    }

    const category = this.CategoryMapper.toEntity(createCategoryDto)
    category.id = uuidv4()
    await this.categoryRepository.save(category)
    this.logger.log(`La categoría ${category.name} ha sido creada`)
    this.onChange(NotificationType.CREATE, category)
    await this.invalidateCacheKey('all_categories')
    return category
  }

  async findAll() {
    this.logger.log(`Buscando todas las categorias`)

    const cache = await this.cacheManager.get('all_categories')

    if (cache) {
      this.logger.log(`Obteniendo categorias desde cache`)
      return cache
    }

    const categories = await this.categoryRepository.find()
    await this.cacheManager.set('all_categories', categories, 30000)
    return categories
  }

  async findById(id: string) {
    const cache: Category = await this.cacheManager.get(`category_${id}`)

    if (cache) {
      this.logger.log(`Obteniendo categoria con id ${id} desde cache`)
      return cache
    }

    const category = await this.categoryRepository.findOneBy({ id })
    this.logger.log(`Buscando categoria con el id: ${id}`)
    if (!category) {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`)
    }

    await this.cacheManager.set(`category_${id}`, category, 30000)
    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findById(id)

    if (category.name != updateCategoryDto.name) {
      const categoryExists = await this.exists(updateCategoryDto.name)

      if (categoryExists) {
        this.logger.log(
          `La categoria con el nombre ${updateCategoryDto.name} no se puede actualizar porque ya existe una con ese nombre`,
        )
        throw new BadRequestException(
          `La categoria con el nombre ${updateCategoryDto.name} ya existe`,
        )
      }
    }

    if (
      updateCategoryDto.name != undefined &&
      updateCategoryDto.active != undefined
    ) {
      this.logger.log(`Actualizando categoria con id ${id}`)
      category.name = updateCategoryDto.name
      category.active = updateCategoryDto.active
      await this.categoryRepository.save(category)
    } else {
      throw new BadRequestException(
        'Para actualizar una categoria es necesario los siguientes datos (name, active)',
      )
    }

    this.onChange(NotificationType.UPDATE, category)
    await this.invalidateCacheKey('all_categories')
    await this.invalidateCacheKey(`category_${id}`)
    return category
  }

  async remove(id: string) {
    const category = await this.findById(id)
    const funkosExists = await this.funkoRepository.count({
      where: {
        category: { id: id },
      },
    })

    if (funkosExists > 0) {
      throw new BadRequestException('La categoria tiene funkos asociados')
    }

    await this.categoryRepository.delete(category.id)
    this.onChange(NotificationType.DELETE, category)
    await this.invalidateCacheKey('all_categories')
  }

  async exists(name: string) {
    return await this.categoryRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: name,
      })
      .getExists()
  }

  private onChange(type: NotificationType, data: Category) {
    const notification = new Notification<Category>(
      'CATEGORIES',
      type,
      data,
      new Date(),
    )
    this.notificationGateway.sendMessage(notification)
  }

  async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }
}
