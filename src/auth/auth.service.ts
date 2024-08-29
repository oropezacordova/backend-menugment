import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: credentialsDto.email })
      .orWhere('user.username = :username', { username: credentialsDto.email })
      .getOne();
    if (!(await bcrypt.compare(credentialsDto.password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { user_id: user.id, username: user.username };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
