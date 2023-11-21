import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SingInDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities';
import { Repository } from 'typeorm';
import { sha256 } from 'src/utils/encrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getUser(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  public async generateAccessToken(id: string) {
    const user = await this.getUser(id);
    return await this.jwtService.signAsync(user, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  public async generateRefreshToken(id: string) {
    const payload = { id };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
    const user = await this.getUser(id);
    user.refreshToken = token;
    await this.userRepository.save(user);

    return token;
  }

  public async getUserWithVerificationRefreshToken(
    id: string,
    refreshToken: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'refreshToken'],
    });
    const token = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    return id === token.id && refreshToken === user.refreshToken ? user : null;
  }

  public async validateUser({ id, password }: SingInDto) {
    const user = await this.userRepository.findOneBy({
      id,
      password: sha256(password),
    });

    if (!user) return null;

    return user;
  }

  public async signout(id: string) {
    const user = await this.getUser(id);
    user.refreshToken = null;
    await this.userRepository.save(user);
    return true;
  }
}
