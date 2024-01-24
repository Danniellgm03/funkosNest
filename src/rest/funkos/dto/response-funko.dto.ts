import { ApiProperty } from '@nestjs/swagger'

export class ResponseFunkoDto {
  @ApiProperty({
    description: 'Id del funko',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nombre del funko',
    example: 'Funko 1',
  })
  name: string

  @ApiProperty({
    description: 'Precio del funko',
    example: 100,
  })
  price: number

  @ApiProperty({
    description: 'Cantidad de funkos',
    example: 10,
  })
  quantity: number

  @ApiProperty({
    description: 'Imagen del funko',
    example: 'https://funko.com/image.png',
  })
  image: string

  @ApiProperty({
    description: 'Categoria del funko',
    example: 'Anime',
  })
  category: string

  @ApiProperty({
    description: 'Fecha de creación del funko',
    example: '2021-06-29T04:30:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Fecha de actualización del funko',
    example: '2021-06-29T04:30:00.000Z',
  })
  updatedAt: Date
}
