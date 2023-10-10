import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionService,

    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  imports: [UserModule, TypeOrmModule.forFeature([Permission])],
})
export class PermissionModule {}
