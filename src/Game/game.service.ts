import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Genre } from 'src/Genre/entities/genre.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.utils';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameGenresDto } from './dto/update-game-genres.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  mapGenreObjectArrayToStringArray(genreObjectArray: Genre[]): string[] {
    //used when reading a game
    return genreObjectArray.map((genre) => genre.genre_title);
  }

  async findAll(): Promise<Game[]> {
    const result: Game[] = await this.prisma.game.findMany({
      include: { genres: true },
    });
    const games: Game[] = result.map((game) => {
      return {
        ...game,
        genres: this.mapGenreObjectArrayToStringArray(game.genres),
      };
    });
    return games;
  }

  async verifyIdAndReturnGame(id: string): Promise<Game> {
    const record = await this.prisma.game.findUnique({
      where: { id },
      include: { genres: true },
    });
    if (!record) {
      throw new NotFoundException(`Id ${id} register was not found.`);
    }
    return record;
  }

  async findOne(id: string): Promise<Game> {
    const result: Game = await this.verifyIdAndReturnGame(id);
    const game = {
      ...result,
      genres: this.mapGenreObjectArrayToStringArray(result.genres),
    };
    return game;
  }

  create(dto: CreateGameDto): Promise<Game> {
    const data: Game = { ...dto };
    return this.prisma.game.create({ data }).catch(handleError);
  }

  async update(id: string, dto: UpdateGameDto) {
    const data: Partial<Game> = { ...dto };
    await this.verifyIdAndReturnGame(id);
    const result: Game = await this.prisma.game
      .update({ where: { id }, data, include: { genres: true } })
      .catch(handleError);
    const game: Game = {
      ...result,
      genres: this.mapGenreObjectArrayToStringArray(result.genres),
    };
    return game;
  }

  async updateGenres(id: string, dto: UpdateGameGenresDto): Promise<Game> {
    const data: Prisma.gameUpdateInput = {
      genres: {
        set: dto.genres.map((genre_id) => ({ id: genre_id })),
      },
    };
    const result: Game = await this.prisma.game
      .update({
        where: { id },
        data,
        include: { genres: true },
      })
      .catch(handleError);
    const game: Game = {
      ...result,
      genres: this.mapGenreObjectArrayToStringArray(result.genres),
    };
    return game;
  }

  async remove(id: string) {
    await this.verifyIdAndReturnGame(id);
    await this.prisma.game.delete({ where: { id } });
  }
}
