import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entity/favorite.entity';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
@ApiTags('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({
    summary: 'Favorite a game',
  })
  createFavorite(@Body() dto: CreateFavoriteDto): Promise<Favorite> {
    return this.favoriteService.createFavorite(dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Unfavorite a game',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFavorite(@Param('id') id: string) {
    return this.favoriteService.removeFavorite(id);
  }

  @Get(':gamertag')
  @ApiOperation({
    summary: 'Lists all favorited games of a profile',
  })
  findProfileFavorites(@Param('gamertag') gamer_tag: string): Promise<Favorite[]> {
    return this.favoriteService.findProfileFavorites(gamer_tag);
  }

  @Get(':gametitle')
  @ApiOperation({
    summary: 'Lists all profiles that favorited a given game',
  })
  findProfilesWhoFavorited(@Param('gametitle') game_title: string): Promise<Favorite[]> {
    return this.favoriteService.findProfilesWhoFavorited(game_title);
  }
}
