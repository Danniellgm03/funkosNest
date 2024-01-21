import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Order } from './schemas/Order'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from '../funkos/entities/funko.entity'
import { OrdersMapper } from './mappers/orders.mapper'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Order)
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
    TypeOrmModule.forFeature([Funko]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersMapper],
  exports: [OrdersService],
})
export class OrdersModule {}
