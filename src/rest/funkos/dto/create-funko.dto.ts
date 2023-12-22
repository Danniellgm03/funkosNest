import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator'

export class CreateFunkoDto {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(0, 100, {
    message: 'El nombre debe tener entre 0 y 100 caracteres',
  })
  name: string

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

  @IsString({ message: 'La imagen debe ser un string' })
  @IsNotEmpty({ message: 'La imagen es requerida' })
  @Length(0, 100, {
    message: 'La imagen debe tener entre 0 y 100 caracteres',
  })
  image: string

  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsString({ message: 'La categoria tiene que ser un string' })
  @Length(0, 100, {
    message: 'La categoria debe tener entre 0 y 100 caracteres',
  })
  category: string
}
