import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFunkoDto {
  @ApiProperty({
    description: 'Nombre del funko',
    example: 'Funko 1',
    minLength: 0,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(0, 100, {
    message: 'El nombre debe tener entre 0 y 100 caracteres',
  })
  name: string

  @ApiProperty({
    description: 'Precio del funko',
    example: 100,
    minimum: 0,
    maximum: 999.99,
  })
  @IsNotEmpty({
    message: 'El precio es requerido',
  })
  @IsNumber(
    {},
    {
      message: 'El precio debe ser un número',
    },
  )
  @Min(0, { message: 'El precio debe ser mayor a 0' })
  @Max(999.99, { message: 'El precio debe ser menor a 999.99' })
  @IsNumber()
  price: number

  @ApiProperty({
    description: 'Cantidad de funkos',
    example: 10,
    minimum: 0,
    maximum: 999999,
  })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    { message: 'La cantidad debe ser un número' },
  )
  @Min(0, { message: 'La cantidad debe ser mayor a 0' })
  @Max(999999, { message: 'La cantidad debe ser menor a 999999' })
  quantity: number

  @ApiProperty({
    description: 'Imagen del funko',
    example: 'https://www.google.com',
    minLength: 0,
    maxLength: 100,
  })
  @IsString({ message: 'La imagen debe ser un string' })
  @IsNotEmpty({ message: 'La imagen es requerida' })
  @Length(0, 100, {
    message: 'La imagen debe tener entre 0 y 100 caracteres',
  })
  image: string

  @ApiProperty({
    description: 'Categoria del funko',
    example: 'Categoria 1',
    minLength: 0,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsString({ message: 'La categoria tiene que ser un string' })
  @Length(0, 100, {
    message: 'La categoria debe tener entre 0 y 100 caracteres',
  })
  category: string
}
