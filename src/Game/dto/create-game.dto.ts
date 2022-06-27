import { ApiProperty } from '@nestjs/swagger';
import {
  isDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The game title',
    example: 'God of War',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Game cover image',
    example:
      'https://meups.com.br/wp-content/uploads/2021/04/CAPA-God-of-WAR.jpg',
  })
  cover_image_url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A brief description or synopsis of the game.',
    example:
      'After defeating Zeus, Kratos tries to live as a normal man in the north. With the death of his wife, a new journey awaits him and his son, Artreus.',
  })
  description: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'The year the game was or will be released.',
    example: 2018,
  })
  year: number;

  @IsNumber()
  @ApiProperty({
    description: 'The game score (preferably metacritic score)',
    example: 98,
  })
  score: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A game trailer url on youtube',
    example: 'https://www.youtube.com/watch?v=HqQMh_tij0c',
  })
  trailer_url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A gameplay url on youtbe',
    example: 'https://www.youtube.com/watch?v=Wf5tpMhziII',
  })
  gameplay_url: string;
}
