import { Body, Injectable, NotFoundException } from '@nestjs/common';
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
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersRepository.save({
      ...createUserDto,
      password: passwordHash,
    });
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
    if (!(await this.usersRepository.existsBy({ id }))) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    delete user.password;
    return user;
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
