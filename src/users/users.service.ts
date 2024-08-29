import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(@Body() createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    if (!(await this.usersRepository.existsBy({ id }))) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersRepository.findOne({
      where: { id },
      relations: { recipes: true },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.findOne(id);
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    this.findOne(id);
    return this.usersRepository.delete(id);
  }
}
