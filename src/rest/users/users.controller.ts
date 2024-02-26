import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import { IdValidatePipe } from '../orders/pipes/id-validate.pipe'
import { CreateOrderDto } from '../orders/dto/CreateOrderDto'
import { UpdateOrderDto } from '../orders/dto/UpdateOrderDto'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id)
  }

  @Get('me/profile')
  @Roles('USER')
  async getProfile(@Req() request: any) {
    return request.user
  }

  @Delete('me/profile')
  @HttpCode(204)
  @Roles('USER')
  async deleteProfile(@Req() request: any) {
    return await this.usersService.remove(request.user.id)
  }

  @Put('me/profile')
  @Roles('USER')
  async updateProfile(
    @Req() request: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(request.user.id, updateUserDto, false)
  }

  // ME/PEDIDOS
  @Get('me/orders')
  async getPedidos(@Req() request: any) {
    return await this.usersService.getPedidos(request.user.id)
  }

  @Get('me/orders/:id')
  async getPedido(
    @Req() request: any,
    @Param('id', IdValidatePipe) id: string,
  ) {
    return await this.usersService.getPedido(request.user.id, id)
  }

  @Post('me/orders')
  @HttpCode(201)
  @Roles('USER')
  async createPedido(
    @Body() createPedidoDto: CreateOrderDto,
    @Req() request: any,
  ) {
    return await this.usersService.createPedido(
      createPedidoDto,
      request.user.id,
    )
  }

  @Put('me/orders/:id')
  @Roles('USER')
  async updatePedido(
    @Param('id', IdValidatePipe) id: string,
    @Body() updatePedidoDto: UpdateOrderDto,
    @Req() request: any,
  ) {
    return await this.usersService.updatePedido(
      id,
      updatePedidoDto,
      request.user.id,
    )
  }

  @Delete('me/orders/:id')
  @HttpCode(204)
  @Roles('USER')
  async removePedido(
    @Param('id', IdValidatePipe) id: string,
    @Req() request: any,
  ) {
    await this.usersService.removePedido(id, request.user.id)
  }
}
