import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities';
import { Repository } from 'typeorm';
import { sha256 } from 'src/utils/encrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.userRepository.findOneBy({
      id: createUserDto.id,
    });

    if (existUser)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const user = this.userRepository.create({
      ...createUserDto,
      password: sha256(createUserDto.password),
    });
    await this.userRepository.save(user);

    return user;
  }

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<UpdateUserDto, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.userRepository.update(id, updateUserDto);

    return updateUserDto;
  }

  public async remove(id: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.userRepository.delete(id);

    return id;
  }
}
