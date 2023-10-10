import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { convertToTree } from 'src/utils/convertToTree';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    try {
      await this.menuRepository.save(createMenuDto);
    } catch (error) {
      throw new ApiException(error, ApiErrorCode.DATABASE_ERROR);
    }
    return '操作成功';
  }

  async findMenu(user: User) {
    const userList: User = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.menus', 'menu')
      .where({ username: user.username })
      .orderBy('menu.orderNum', 'ASC')
      .getOne();

    interface MenuMap {
      [key: string]: Menu;
    }

    const menus: MenuMap = userList?.roles.reduce((mergedMenus: MenuMap, role: any) => {
      role.menus.forEach((menu: Menu) => {
        mergedMenus[menu.id] = menu;
      });
      return mergedMenus;
    }, {});

    // 去重后的菜单数组
    const uniqueMenus: Menu[] = Object.values(menus);

    return convertToTree(uniqueMenus);
  }

  findAll() {
    // return `This action returns all menu`;
    return this.menuRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
