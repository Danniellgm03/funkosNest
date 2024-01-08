import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class CreateCategoryDto {
  @IsString({ message: 'El nombre de la categoria debe ser un string' })
  @IsNotEmpty({ message: 'El nombre de la categoria es requerido' })
  @Length(0, 100, {
    message: 'El nombre debe tener entre 0 y 100 caracteres',
  })
  name: string
  @IsBoolean({ message: 'El estado de la categoria debe ser un booleano' })
  @IsOptional()
  active: boolean = false
}
