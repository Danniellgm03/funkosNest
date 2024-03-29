import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { join } from 'path'

@Injectable()
export class StorageService {
  private readonly uploadDir = process.env.UPLOADS_DIR || './funkoshop_dir'
  private readonly isDev = process.env.NODE_ENV === 'dev'
  private readonly logger = new Logger(StorageService.name)

  async onModuleInit() {
    if (this.isDev) {
      if (fs.existsSync(this.uploadDir)) {
        this.logger.log(`Eliminando ficheros de ${this.uploadDir}`)
        fs.readdirSync(this.uploadDir).forEach((file) => {
          fs.unlinkSync(path.join(this.uploadDir, file))
        })
      } else {
        this.logger.log(
          `Creando directorio de subida de archivos en ${this.uploadDir}`,
        )
        fs.mkdirSync(this.uploadDir)
      }
    }
  }

  findFile(filename: string): string {
    this.logger.log(`Buscando el fichero ${filename}`)
    const file = join(
      process.cwd(),
      process.env.UPLOADS_DIR || './funkoshop_dir',
      filename,
    )
    if (fs.existsSync(file)) {
      this.logger.log(`Fichero encontrado ${file}`)
      return file
    } else {
      throw new NotFoundException(`El fichero ${filename} no existe.`)
    }
  }

  getFileNameWithouUrl(fileUrl: string): string {
    try {
      const url = new URL(fileUrl)
      const pathname = url.pathname
      const segments = pathname.split('/')
      const filename = segments[segments.length - 1]
      return filename
    } catch (error) {
      this.logger.error(error)
      return fileUrl
    }
  }

  removeFile(filename: string): void {
    this.logger.log(`Eliminando el fichero ${filename}`)
    const file = join(
      process.cwd(),
      process.env.UPLOADS_DIR || './funkoshop_dir',
      filename,
    )
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    } else {
      throw new NotFoundException(`El fichero ${filename} no existe.`)
    }
  }
}
