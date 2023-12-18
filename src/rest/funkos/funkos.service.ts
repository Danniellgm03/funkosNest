import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { Funko } from './entities/funko.entity'
import { FunkoMapper } from './mappers/funko-mapper'

@Injectable()
export class FunkosService {
  private funkos: Funko[] = []
  private idCount = 1
  private readonly logger = new Logger(FunkosService.name)

  constructor(private readonly funkoMapper: FunkoMapper) {}

  create(createFunkoDto: CreateFunkoDto): Funko {
    const funko = this.funkoMapper.CreatetoEntity(createFunkoDto)
    funko.id = this.idCount++
    this.logger.log(`Funko creado ${JSON.stringify(funko)}}`)
    return this.funkos.push(funko) ? this.funkoMapper.toEntity(funko) : null
  }

  findAll() {
    this.logger.log(`Listando todos los funkos`)
    return this.funkos.map((f) => {
      return this.funkoMapper.toDto(f)
    })
  }

  findById(id: number) {
    const funko = this.funkos.find((funko) => funko.id == id)
    this.logger.log(`Buscando funko con id ${id}`)

    if (!funko) {
      throw new NotFoundException(`El funko con id ${id} no existe`)
    }
    return this.funkoMapper.toEntity(funko)
  }

  update(id: number, updateFunkoDto: UpdateFunkoDto) {
    const index = this.funkos.findIndex((funko) => funko.id == id)
    this.logger.log(
      `Actualizando funko con id ${id} - ${JSON.stringify(updateFunkoDto)}`,
    )
    if (index !== -1) {
      const id = this.funkos[index].id
      this.funkos[index] = {
        ...this.funkos[index],
        ...updateFunkoDto,
        updatedAt: new Date(),
        id,
      }
      return this.funkoMapper.toEntity(this.funkos[index])
    } else {
      throw new NotFoundException(`El funko con id ${id} no existe`)
    }
  }

  remove(id: number) {
    const index = this.funkos.findIndex((funko) => funko.id == id)
    this.logger.log(`Eliminando funko con id ${id}`)
    if (index !== -1) {
      const funko = this.funkos[index]
      this.funkos.splice(index, 1)
      return this.funkoMapper.toEntity(funko)
    } else {
      throw new NotFoundException(`El funko con id ${id} no existe`)
    }
  }
}
