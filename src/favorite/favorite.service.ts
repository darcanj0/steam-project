import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Game } from 'src/Game/entities/game.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from 'src/Profile/entities/profile.entity';
import { handleError } from 'src/utils/handle-error.utils';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entity/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyGamerTagAndReturnProfile(gamer_tag: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { gamer_tag },
    });
    if (!profile) {
      throw new NotFoundException(`Gamertag ${gamer_tag} register not found`);
    }
    return profile;
  }

  async verifyTitleAndReturnGame(game_title: string): Promise<Game> {
    const game = await this.prisma.game.findUnique({
      where: { title: game_title },
    });
    if (!game) {
      throw new NotFoundException(`Title ${game_title} register not found`);
    }
    return game;
  }

  async createFavorite(dto: CreateFavoriteDto): Promise<Favorite> {
    const { gamer_tag, game_title } = dto;
    await this.verifyGamerTagAndReturnProfile(gamer_tag);
    await this.verifyTitleAndReturnGame(game_title);
    const data: Prisma.favoriteCreateInput = {
      game: { connect: { title: game_title } },
      profile: { connect: { gamer_tag } },
    };
    return this.prisma.favorite.create({ data }).catch(handleError);
  }

  async verifyIdAndReturnFavorite(id: string): Promise<Favorite> {
    const record = await this.prisma.favorite.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundException(`Id ${id} register was not found`);
    }
    return record;
  }

  async removeFavorite(id: string) {
    await this.verifyIdAndReturnFavorite(id);
    return this.prisma.favorite.delete({ where: { id } });
  }

  async findProfileFavorites(gamer_tag: string): Promise<Favorite[]> {
    await this.verifyGamerTagAndReturnProfile(gamer_tag);
    return this.prisma.favorite.findMany({ where: { gamer_tag } });
  }

  async findProfilesWhoFavorited(game_title: string): Promise<Favorite[]> {
    await this.verifyTitleAndReturnGame(game_title);
    return this.prisma.favorite.findMany({ where: { game_title } });
  }
}
