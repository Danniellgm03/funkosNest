import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { NoWithspacesPipe } from '../../pipes/no-withspaces.pipe'

@Controller('funkos')
export class FunkosController {
  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  async findAll() {
    return await this.funkosService.findAll()
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.funkosService.findById(id)
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new NoWithspacesPipe({ fields: ['name', 'image', 'category'] }))
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    return await this.funkosService.create(createFunkoDto)
  }

  @Put(':id')
  @UsePipes(new NoWithspacesPipe({ fields: ['name', 'image', 'category'] }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    return await this.funkosService.update(id, updateFunkoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.funkosService.remove(id)
  }
}
