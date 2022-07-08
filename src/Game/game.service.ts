import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.utils';
import { CreateGameDto } from './dto/create-game.dto';
import { SetGameGenresDto } from './dto/set-game-genres.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  private gameSelect: Prisma.gameFindManyArgs = {
    include: { genres: true },
  };

  async findAll(): Promise<Game[]> {
    const result: Game[] = await this.prisma.game.findMany(this.gameSelect);
    const games = result.map((game) => {
      return { ...game, genres: game.genres.map((genre) => genre.genre_title) };
    });
    return games;
  }

  async verifyIdAndReturnGame(id: string): Promise<Game> {
    const record = await this.prisma.game.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Id ${id} register was not found.`);
    }
    return record;
  }

  findOne(id: string): Promise<Game> {
    return this.verifyIdAndReturnGame(id);
  }

  create(dto: CreateGameDto): Promise<Game> {
    const data: Game = { ...dto };
    return this.prisma.game.create({ data }).catch(handleError);
  }

  async update(id: string, dto: UpdateGameDto) {
    const data: Partial<Game> = { ...dto };
    await this.verifyIdAndReturnGame(id);
    return this.prisma.game
      .update({ where: { id }, data })
      .catch(handleError);
  }

  setGenres(id: string, dto: SetGameGenresDto) {
    const data = {
      genres: {
        set: dto.genres.map((genre_id) => {
          return { id: genre_id };
        }),
      },
    };
    return this.prisma.game.update({
      where: { id },
      data,
    }).catch(handleError);
  }

  async remove(id: string) {
    await this.verifyIdAndReturnGame(id);
    await this.prisma.game.delete({ where: { id } });
  }
}
