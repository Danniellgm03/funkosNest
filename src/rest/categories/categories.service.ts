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

@Injectable()
export class CategoriesService {
  private categories: Category[] = []
  private idCount = 1
  private readonly logger = new Logger(CategoriesService.name)

  constructor(private readonly CategoryMapper: CategoryMapper) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.CategoryMapper.toEntity(
      createCategoryDto,
      this.idCount++,
    )
    this.categories.push(category)
    this.logger.log(`La categoría ${category.name} ha sido creada`)
    return category
  }

  findAll() {
    this.logger.log(`Buscando todas las categorias`)
    return this.categories
  }

  findById(id: number) {
    const category = this.categories.find((c) => c.id == id)
    this.logger.log(`Buscando categoria con el id: ${id}`)
    if (!category) {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`)
    }
    return category
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = this.findById(id)

    if (
      updateCategoryDto.name != undefined ||
      updateCategoryDto.active != undefined
    ) {
      this.logger.log(`Actualizando categoria con id ${id}`)
      category.name = updateCategoryDto.name ?? category.name
      category.active = updateCategoryDto.active ?? category.active
    } else {
      throw new BadRequestException(
        'Para actualizar una categoria es necesario alguno de los siguientes datos (name, active)',
      )
    }

    return category
  }

  remove(id: number) {
    const categoryIndex = this.categories.findIndex((c) => c.id == id)
    if (categoryIndex > -1) {
      this.logger.log(`Borrando categoria con id ${id}`)
      this.categories.splice(categoryIndex, 1)
      return
    } else {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`)
    }
  }
}
