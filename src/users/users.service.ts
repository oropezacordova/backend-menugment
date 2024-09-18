import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const passwordHash = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.usersRepository.save({
        ...createUserDto,
        password: passwordHash,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (
        await this.usersRepository.existsBy({
          username: createUserDto.username,
        })
      ) {
        throw new ConflictException('Username already exists');
      } else if (
        await this.usersRepository.existsBy({
          email: createUserDto.email,
        })
      ) {
        throw new ConflictException('Email already exists');
      } else {
        throw error;
      }
    }
  }

  async findProfile(payload: Request) {
    const user = await this.findOne(payload['user_id']);
    delete user.password;
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find();
    for (const user of users) {
      delete user.password;
    }
    return users;
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: { recipes: { category: true, user: true } },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (!(await this.usersRepository.existsBy({ id }))) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      const passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      return this.usersRepository.update(id, {
        ...updateUserDto,
        password: passwordHash,
      });
    } else {
      return this.usersRepository.update(id, {
        ...updateUserDto,
        password: user.password,
      });
    }
  }

  remove(id: number) {
    this.findOne(id);
    return this.usersRepository.delete(id);
  }
}
