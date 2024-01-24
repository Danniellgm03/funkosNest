import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { getSSLOptions } from './config/ssl/ssl.config'
import { setupSwagger } from './config/swagger/swagger.config'

async function bootstrap() {
  const httpsOptions = getSSLOptions()

  const app = await NestFactory.create(AppModule, { httpsOptions })
  app.setGlobalPrefix(`api/${process.env.API_VERSION || 'v1'}`)

  if (process.env.NODE_ENV === 'dev') {
    setupSwagger(app)
  }

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
