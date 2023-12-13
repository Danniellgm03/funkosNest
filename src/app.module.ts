import { Module } from '@nestjs/common'
import { FunkosModule } from './rest/funkos/funkos.module'

@Module({
  imports: [FunkosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
