import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Name of the user',
    example: 'Daniel',
  })
  user_name: string;

  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'name@example.com',
  })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message:
      'Your password is too weak. Use one with 8 characters at least, lower case, upper case, number and a special character',
  })
  @ApiProperty({
    description: `at least 1 lowercase alphabetical\nat least 1 uppercase alphabetical\nat least 1 numeric\none special character`,
    example: 'Abcdef@1',
  })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'True if the user is an admin; False if not',
    example: true,
  })
  is_admin: boolean;

  //ex: 12345678910
  @IsString()
  @Matches(/(\d{3})(\d{3})(\d{3})(\d{2})/)
  @IsNotEmpty()
  @ApiProperty({
    description:
      "User's CPF as a string of numbers. (Brazilian equivalent of the SSN)",
    example: '12345678900',
  })
  cpf: string;
}
