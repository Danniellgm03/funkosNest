import { Prop } from '@nestjs/mongoose'
import { Direction } from './Direction'

export class Client {
  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  name: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  email: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  phone: string

  @Prop({
    required: true,
  })
  direction: Direction
}
