import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API REST Tienda Funkos Nestjs DAW 2023/2024')
    .setDescription(
      'API de ejemplo del curso Desarrollo de un API REST con Nestjs para 2º DAW. 2023/2024',
    )
    .setContact('Daniel Garrido Muros', '', 'daniell.gm03@gmail.com')
    .setExternalDoc(
      'Documentación de la API',
      'https://github.com/Danniellgm03/funkosNest.git',
    )
    .setVersion('1.0.0')
    .addTag('Funkos', 'Operaciones con funkos')
    .addTag('Storage', 'Operaciones con almacenamiento')
    .addTag('Auth', 'Operaciones de autenticación')
    .addBearerAuth() // Añadimos el token de autenticación
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document) // http://localhost:3000/api
}
