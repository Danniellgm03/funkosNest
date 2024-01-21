import { IsNotEmpty, IsNumber } from 'class-validator'
import { ClientDto } from './ClientDto'
import { OrderLineDto } from './OrderLineDto'

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  idUser: number

  @IsNotEmpty()
  client: ClientDto

  @IsNotEmpty()
  orderLines: OrderLineDto[]
}
