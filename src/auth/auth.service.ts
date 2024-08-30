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
    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }
    const passwordMatch = await bcrypt.compare(
      credentialsDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }
    const payload = { userId: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
