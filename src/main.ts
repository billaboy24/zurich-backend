import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Zurich Nest JS Assessment')
    .setDescription(
      'Zurich Malaysia is introducing a new motor insurance website where users are able to obtain the insurance premium instantly. As a backend developer, you must build a pricing query API, where the user passes in the product id and location, and the API returns the premium. The API requires administrative functionalities to maintain the products and prices as well.',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Development')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
