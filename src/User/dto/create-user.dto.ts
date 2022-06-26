import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;

  @IsString()
  @Matches('/^d{3}.d{3}.d{3}-d{2}$/')
  @IsNotEmpty()
  cpf: string;
}
