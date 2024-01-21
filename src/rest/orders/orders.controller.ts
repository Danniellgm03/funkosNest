import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrderByValidatePipe } from './pipes/orderby-validate.pipe'
import { OrderValidatePipe } from './pipes/order-validate.pipe'
import { IdValidatePipe } from './pipes/id-validate.pipe'
import { CreateOrderDto } from './dto/CreateOrderDto'
import { UpdateOrderDto } from './dto/UpdateOrderDto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles('USER')
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number = 1,
    @Query('limit', new DefaultValuePipe(20)) limit: number = 20,
    @Query('orderBy', new DefaultValuePipe('idUsuario'), OrderByValidatePipe)
    orderBy: string = 'idUsuario',
    @Query('order', new DefaultValuePipe('asc'), OrderValidatePipe)
    order: string,
  ) {
    return await this.ordersService.findAll(page, limit, orderBy, order)
  }

  @Get(':id')
  @Roles('USER')
  async findOne(@Param('id', IdValidatePipe) id: string) {
    return await this.ordersService.findOne(id)
  }

  @Get('user/:id')
  @Roles('USER')
  async findByUser(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.findByIdUser(id)
  }

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto)
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', IdValidatePipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, updateOrderDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  async remove(@Param('id', IdValidatePipe) id: string) {
    await this.ordersService.remove(id)
  }
}
