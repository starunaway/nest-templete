import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = '/api';

  // 要放到 swagger 前面, 否则 swagger 获取不到 app 的配置信息
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const options = new DocumentBuilder()
    .setTitle('后台管理系统') // 标题
    .setDescription('后台管理系统接口文档') // 描述
    .setVersion('1.0') // 版本
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  //配置swgger地址
  SwaggerModule.setup('/api/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
