import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the game being favorited',
  })
  game_title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Gamertag of the profile that is favoriting',
    example: 'darcanjo_',
  })
  gamer_tag: string;
}
