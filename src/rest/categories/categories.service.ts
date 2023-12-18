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

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor(
    private readonly CategoryMapper: CategoryMapper,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.CategoryMapper.toEntity(createCategoryDto)
    await this.categoryRepository.save(category)
    this.logger.log(`La categoría ${category.name} ha sido creada`)
    return category
  }

  async findAll() {
    this.logger.log(`Buscando todas las categorias`)
    return await this.categoryRepository.find()
  }

  async findById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })
    this.logger.log(`Buscando categoria con el id: ${id}`)
    if (!category) {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`)
    }
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
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

  async remove(id: number) {
    const category = await this.findById(id)

    if (category) {
      await this.categoryRepository.delete(category.id)
    } else {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`)
    }
  }
}
