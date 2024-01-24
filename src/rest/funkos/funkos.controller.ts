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
  UploadedFile,
  Req,
  Patch,
  UseGuards,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { NoWithspacesPipe } from '../../pipes/no-withspaces.pipe'
import { Request } from 'express'
import { FunkoExistsGuard } from './guard/funko-exists.guard'
import { extname, parse } from 'path'
import { diskStorage } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express'
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ResponseFunkoDto } from './dto/response-funko.dto'

@Controller('funkos')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
//@UseInterceptors(CacheInterceptor)
@ApiTags('Funkos')
export class FunkosController {
  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  @Roles('USER')
  @ApiResponse({
    status: 200,
    description: 'Listado de Funkos',
    type: Paginated<ResponseFunkoDto>,
  })
  @ApiQuery({
    name: 'page',
    description: 'Número de página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número de elementos por página',
    required: false,
  })
  @ApiQuery({
    description: 'Filtro de busqueda: filter.campo = $eq:valor',
    name: 'filter',
    required: false,
    type: String,
  })
  //@CacheKey('all_funkos')
  //@CacheTTL(30)
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.funkosService.findAllQuery(query)
  }

  @Get(':id')
  @Roles('USER')
  @ApiResponse({
    status: 200,
    description: 'Funko',
    type: ResponseFunkoDto,
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Error en la petición',
  })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.funkosService.findById(id)
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new NoWithspacesPipe({ fields: ['name', 'image', 'category'] }))
  @Roles('ADMIN')
  @ApiResponse({
    status: 201,
    description: 'Funko creado',
    type: ResponseFunkoDto,
  })
  @ApiBadRequestResponse({
    description: 'Error en la petición',
  })
  @ApiNotFoundResponse({
    description: 'Categoria no encontrada',
  })
  @ApiBody({
    description: 'Datos del funko',
    type: CreateFunkoDto,
  })
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    return await this.funkosService.create(createFunkoDto)
  }

  @Put(':id')
  @UsePipes(new NoWithspacesPipe({ fields: ['name', 'image', 'category'] }))
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'Funko actualizado',
    type: ResponseFunkoDto,
  })
  @ApiBadRequestResponse({
    description: 'Error en la petición',
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiNotFoundResponse({
    description: 'Categoria no encontrada',
  })
  @ApiBody({
    description: 'Datos del funko',
    type: UpdateFunkoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del funko',
    type: Number,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    return await this.funkosService.update(id, updateFunkoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiResponse({
    status: 204,
    description: 'Funko eliminado',
  })
  @ApiBadRequestResponse({
    description: 'Error en la petición',
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del funko',
    type: Number,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.funkosService.remove(id)
  }

  @Patch('/imagen/:id')
  @UseGuards(FunkoExistsGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOADS_DIR || './funkoshop_dir',
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']
        const maxFileSize = 1024 * 1024
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Fichero no soportado. No es del tipo imagen válido',
            ),
            false,
          )
        } else if (file.size > maxFileSize) {
          cb(
            new BadRequestException(
              'El tamaño del archivo no puede ser mayor a 1 megabyte.',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'Imagen actualizada',
    type: ResponseFunkoDto,
  })
  @ApiBadRequestResponse({
    description: 'Error en la petición',
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del funko',
    type: Number,
  })
  @ApiBody({
    description: 'Imagen del funko',
  })
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.funkosService.updateImage(id, file, req, false)
  }
}
