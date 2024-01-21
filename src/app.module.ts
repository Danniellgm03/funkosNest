import { Module } from '@nestjs/common'
import { FunkosModule } from './rest/funkos/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './rest/categories/categories.module'
import { StorageModule } from './rest/storage/storage.module'
import { ConfigModule } from '@nestjs/config'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersModule } from './rest/orders/orders.module';
import { AuthModule } from './rest/auth/auth.module';
import { UsersModule } from './rest/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FunkosModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'adminPassword123',
      database: 'FUNKOSHOP',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    MongooseModule.forRoot(
      'mongodb://admin:adminPassword123@localhost:27017/funkos',
    ),
    StorageModule,
    NotificationsModule,
    CacheModule.register(),
    OrdersModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
