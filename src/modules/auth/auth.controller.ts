import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from './guards/access.guard';
import { Request, Response } from 'express';
import { LoginGuard } from './guards/login.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_OPTION } from 'src/utils/cookie';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async getUser(@Req() req: Request) {
    return await this.authService.getUser(req.user.id);
  }

  @Post('signin')
  @UseGuards(LoginGuard)
  async signin(@Req() req: Request, @Res() res: Response) {
    const refreshToken = await this.authService.generateRefreshToken(
      req.user.id,
    );

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTION());
    res.send(req.user);
  }

  @Post('signout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async signout(@Req() req: Request, @Res() res: Response) {
    await this.authService.signout(req.user.id);
    res.clearCookie(REFRESH_TOKEN_KEY);
    res.sendStatus(200);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request) {
    return await this.authService.generateAccessToken(req.user.id);
  }
}
