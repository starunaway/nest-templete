import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, roleIds, password } = createUserDto;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existUser) throw new ApiException('用户已存在', ApiErrorCode.USER_EXIST);
    try {
      //查询数组roleIds对应所有role的实例
      const roles = await this.roleRepository.find({
        where: {
          id: In(roleIds),
        },
      });

      const newUser = await this.userRepository.create({
        username,
        password,
        roles,
      });
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  test(p: any) {
    return 'test';
  }

  async findPermissionNames(userInfo: User) {
    const user = await this.userRepository.findOne({
      where: { username: userInfo.username },
      relations: ['roles', 'roles.permissions'],
    });

    if (user) {
      const permissions = user.roles.flatMap((role) => role.permissions);
      const permissionNames = permissions.map((item) => item.name);

      return [...new Set(permissionNames)];
    } else {
      return [];
    }
  }
}
