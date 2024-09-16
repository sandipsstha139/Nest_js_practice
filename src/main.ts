import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // for logger
  const logger = new Logger('main');

  app.use(helmet());
  app.enableCors();
  app.use(csurf());

  // for dto
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // for static files and template engine
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // swagger implementation
  const config = new DocumentBuilder()
    .setTitle('Nest Api')
    .setDescription('Nest Api description')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // for global filter
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(4000);
  logger.log(`Application is running on 4000`);
}
bootstrap();
