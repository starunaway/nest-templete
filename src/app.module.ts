import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

const isProd = process.env.NODE_ENV == 'production';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [isProd ? path.resolve('.env.prod') : path.resolve('.env')],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      autoLoadEntities: true, //自动加载实体
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT), // 端口号
      username: process.env.DB_USER, // 用户名
      password: process.env.DB_PASSWD, // 密码
      database: process.env.DB_DATABASE, //数据库名
      synchronize: true, //是否自动同步实体文件,生产环境建议关闭
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
