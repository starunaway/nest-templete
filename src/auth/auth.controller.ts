import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/public/public.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from './vo/auth.vo';

@ApiTags('登录验证模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '登录接口', // 接口描述信息
  })
  @Public()
  @Post('login')
  @ApiOkResponse({ description: '登录成功返回', type: LoginResponse })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Public()
  @Post('/test')
  @ApiBearerAuth()
  test() {
    return 1;
  }
}
