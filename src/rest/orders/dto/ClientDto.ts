import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { DirectionDto } from './DirectionDto'

export class ClientDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string

  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  phone: string

  @IsNotEmpty()
  direction: DirectionDto
}
