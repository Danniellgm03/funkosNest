import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(`api/${process.env.API_VERSION || 'v1'}`)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.API_PORT || 3000)
}

bootstrap().then(() => {
  console.log(
    `🚀El servidor se ha iniciado correctamente en el puerto ${
      process.env.API_PORT || 3000
    } y en la versión ${process.env.API_VERSION || 'v1'}`,
  )
})
