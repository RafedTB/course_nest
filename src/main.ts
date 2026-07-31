import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import{SwaggerModule,DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  app.enableCors({
    origin:`http://localhost:3001`
  });

  const swagger = new DocumentBuilder()
  .setTitle("NestJS API")
  .setDescription('This is a sample NestJS API')
  .addServer('http://localhost:3000')
  .setTermsOfService('http://localhost:3000/terms')
  .setLicense('MIT', 'http://localhost:3000/license')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, documentation);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
