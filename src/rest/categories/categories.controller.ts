import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  ParseUUIDPipe,
  UsePipes,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { NoWithspacesPipe } from '../../pipes/no-withspaces.pipe'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'

@Controller('categories')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @CacheKey('all_categories')
  @CacheTTL(30)
  @Roles('USER')
  async findAll() {
    return await this.categoriesService.findAll()
  }

  @Get(':id')
  @Roles('USER')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.findById(id)
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new NoWithspacesPipe({ fields: ['name'] }))
  @Roles('ADMIN')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto)
  }

  @Put(':id')
  @UsePipes(new NoWithspacesPipe({ fields: ['name'] }))
  @Roles('ADMIN')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoriesService.remove(id)
  }
}
