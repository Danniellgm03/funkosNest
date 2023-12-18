import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Put,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id)
  }

  @Post()
  @HttpCode(201)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id)
  }
}
