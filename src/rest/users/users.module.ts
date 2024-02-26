import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserRole } from './entities/user-role.entity'
import { OrdersModule } from '../orders/orders.module'
import { UsersMapper } from './mappers/users.mapper'
import { BcryptService } from './bcrypt.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserRole]),
    OrdersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper, BcryptService],
  exports: [UsersService, UsersMapper],
})
export class UsersModule {}
