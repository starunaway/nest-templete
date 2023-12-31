import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    CacheModule,
  ],

  exports: [UserService],
})
export class UserModule {}
