import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString({ message: 'El nombre de la categoria debe ser un string' })
  @IsNotEmpty({ message: 'El nombre de la categoria es requerido' })
  name: string
  @IsBoolean({ message: 'El estado de la categoria debe ser un booleano' })
  @IsOptional()
  active: boolean = false
}
