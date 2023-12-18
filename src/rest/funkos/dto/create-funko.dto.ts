import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { Category } from '../enums/Categoria'

export class CreateFunkoDto {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
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
  @Max(999999, { message: 'El precio debe ser menor a 999999' })
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
  quantity: number

  @IsString({ message: 'La imagen debe ser un string' })
  @IsNotEmpty({ message: 'La imagen es requerida' })
  image: string

  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsEnum(Category)
  category: Category
}
