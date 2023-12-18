import { Module } from '@nestjs/common'
import { FunkosModule } from './rest/funkos/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './rest/categories/categories.module'

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
