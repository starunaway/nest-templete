import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const permissions = await this.permissionRepository.find({
      where: {
        id: In(createRoleDto.permissionIds),
      },
    });

    const name = createRoleDto.name;
    const existRole = await this.roleRepository.findOne({
      where: { name },
    });

    if (existRole) {
      throw new ApiException('角色已存在', ApiErrorCode.ROLE_EXIST);
    }
    return this.roleRepository.save({ permissions, name });
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
