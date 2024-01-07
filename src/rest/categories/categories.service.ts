import {
  BadRequestException,
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

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor(
    private readonly CategoryMapper: CategoryMapper,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.CategoryMapper.toEntity(createCategoryDto)
    category.id = uuidv4()
    await this.categoryRepository.save(category)
    this.logger.log(`La categoría ${category.name} ha sido creada`)
    return category
  }

  async findAll() {
    this.logger.log(`Buscando todas las categorias`)
    return await this.categoryRepository.find()
  }

  async findById(id: string) {
    const category = await this.categoryRepository.findOneBy({ id })
    this.logger.log(`Buscando categoria con el id: ${id}`)
    if (!category) {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`)
    }
    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findById(id)

    if (
      updateCategoryDto.name != undefined ||
      updateCategoryDto.active != undefined
    ) {
      this.logger.log(`Actualizando categoria con id ${id}`)
      category.name = updateCategoryDto.name ?? category.name
      category.active = updateCategoryDto.active ?? category.active
      await this.categoryRepository.save(category)
    } else {
      throw new BadRequestException(
        'Para actualizar una categoria es necesario alguno de los siguientes datos (name, active)',
      )
    }

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
  }

  async exists(name: string) {
    return await this.categoryRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: name,
      })
      .getExists()
  }
}
