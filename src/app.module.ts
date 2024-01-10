import { Module } from '@nestjs/common'
import { FunkosModule } from './rest/funkos/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './rest/categories/categories.module'
import { StorageModule } from './rest/storage/storage.module'
import { ConfigModule } from '@nestjs/config'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'

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
    StorageModule,
    NotificationsModule,
    CacheModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
