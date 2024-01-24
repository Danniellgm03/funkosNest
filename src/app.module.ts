import { Module } from '@nestjs/common'
import { FunkosModule } from './rest/funkos/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './rest/categories/categories.module'
import { StorageModule } from './rest/storage/storage.module'
import { ConfigModule } from '@nestjs/config'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersModule } from './rest/orders/orders.module'
import { AuthModule } from './rest/auth/auth.module'
import { UsersModule } from './rest/users/users.module'
import { CorsConfigModule } from './config/cors/cors.module'

@Module({
  imports: [
    ConfigModule.forRoot(
      process.env.NODE_ENV == 'dev'
        ? { envFilePath: '.env' }
        : { envFilePath: '.env.prod' },
    ),
    CorsConfigModule,
    FunkosModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.DATABASE_USER || 'admin',
      password: process.env.DATABASE_PASSWORD || 'adminPassword123',
      database: process.env.POSTGRES_DATABASE || 'FUNKOSHOP',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DATABASE_USER}:${
        process.env.DATABASE_PASSWORD
      }@${process.env.MONGO_HOST}:${process.env.MONGO_PORT || 27017}/${
        process.env.MONGO_DATABASE
      }`,
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
