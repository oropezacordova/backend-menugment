import { IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
