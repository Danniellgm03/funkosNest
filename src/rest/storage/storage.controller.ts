import { Controller, Get, Param, Res } from '@nestjs/common'
import { StorageService } from './storage.service'
import { Response } from 'express'

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.storageService.findFile(filename)
    res.sendFile(filePath)
  }
}
