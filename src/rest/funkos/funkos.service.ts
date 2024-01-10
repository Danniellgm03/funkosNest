import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { Funko } from './entities/funko.entity'
import { FunkoMapper } from './mappers/funko-mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from '../categories/entities/category.entity'
import { Request } from 'express'
import { StorageService } from '../storage/storage.service'

@Injectable()
export class FunkosService {
  private readonly logger = new Logger(FunkosService.name)

  constructor(
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly storageService: StorageService,
    private readonly funkoMapper: FunkoMapper,
  ) {}

  async findAll() {
    this.logger.log(`Listando todos los funkos`)
    const funkos = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')
      .getMany()
    return funkos.map((f) => this.funkoMapper.toDto(f))
  }

  async findById(id: number) {
    const funko = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')
      .where('funko.id = :id', { id })
      .getOne()

    this.logger.log(`Buscando funko con id ${id}`)

    if (!funko) {
      throw new NotFoundException(`El funko con id ${id} no existe`)
    }
    return this.funkoMapper.toDto(funko)
  }

  async create(createFunkoDto: CreateFunkoDto) {
    const funko = this.funkoMapper.CreatetoEntity(createFunkoDto)

    if (createFunkoDto.category) {
      const cat: Category = await this.categoryRepository.findOneBy({
        name: createFunkoDto.category,
      })

      if (!cat || !cat.active) {
        throw new NotFoundException(
          `La categoria ${createFunkoDto.category} no existe o no esta activa`,
        )
      }
      funko.category = cat
    }
    return this.funkoMapper.toDto(await this.funkoRepository.save(funko))
  }

  async update(id: number, updateFunkoDto: UpdateFunkoDto) {
    const funko = this.funkoMapper.toEntity(await this.findById(id))
    if (updateFunkoDto.category) {
      const category = await this.categoryRepository.findOneBy({
        name: updateFunkoDto.category,
      })
      if (!category || !category.active) {
        throw new NotFoundException(
          `La categoria ${updateFunkoDto.category} no existe o no esta activa`,
        )
      }
      funko.category = category
    }

    this.logger.log(
      `Actualizando funko con id ${id} - ${JSON.stringify(updateFunkoDto)}`,
    )

    funko.name = updateFunkoDto.name
    funko.image = updateFunkoDto.image
    funko.price = updateFunkoDto.price
    funko.quantity = updateFunkoDto.quantity

    return this.funkoMapper.toDto(await this.funkoRepository.save(funko))
  }

  async remove(id: number) {
    const funko = this.funkoMapper.toEntity(await this.findById(id))
    this.logger.log(`Eliminando funko con id ${id}`)
    await this.funkoRepository.remove(funko)
  }

  async updateImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = true,
  ) {
    this.logger.log(`Actualizando imagen de funko con id: ${id}`)
    const funko = this.funkoMapper.toEntity(await this.findById(id))

    if (funko.image !== Funko.IMAGE_DEFAULT) {
      this.logger.log(`Borrando imagen ${funko.image}`)
      let imagePath = funko.image
      if (withUrl) {
        imagePath = this.storageService.getFileNameWithouUrl(funko.image)
      }

      try {
        this.storageService.removeFile(imagePath)
      } catch (e) {
        this.logger.error(e)
      }
    }

    if (!file) {
      throw new BadRequestException('Fichero no encontrado')
    }

    let filePath: string

    if (withUrl) {
      this.logger.log(`Generando url para ${file.filename}`)
      const apiVersion = process.env.API_VERSION
        ? `/${process.env.API_VERSION}`
        : ''
      filePath = `${req.protocol}://${req.get(
        'host',
      )}/api${apiVersion}/storage/${file.filename}`
    } else {
      filePath = file.filename
    }

    funko.image = filePath
    return this.funkoMapper.toDto(await this.funkoRepository.save(funko))
  }
}
