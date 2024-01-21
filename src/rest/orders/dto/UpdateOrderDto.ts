import { CreateOrderDto } from './CreateOrderDto'
import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ClientDto } from './ClientDto'
import { OrderLineDto } from './OrderLineDto'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNumber()
  @IsNotEmpty()
  idUser: number

  @IsNotEmpty()
  client: ClientDto

  @IsNotEmpty()
  orderLines: OrderLineDto[]
}
