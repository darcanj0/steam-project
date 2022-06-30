import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Game[]> {
    return this.prisma.game.findMany();
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
    return this.prisma.game.create({ data }).catch(this.handleUniqueConstraintError);
  }

  async update(id: string, dto: UpdateGameDto) {
    const data: Partial<Game> = { ...dto };
    await this.verifyIdAndReturnGame(id);
    return this.prisma.game
      .update({ where: { id }, data })
      .catch(this.handleUniqueConstraintError);
  }

  async remove(id: string) {
    await this.verifyIdAndReturnGame(id);
    await this.prisma.game.delete({ where: { id } });
  }

  handleUniqueConstraintError(error: Error): undefined {
    const errorLines = error.message?.split('\n');
    const lastErrorLine = errorLines[errorLines.length - 1]?.trim();
    throw new UnprocessableEntityException(
      lastErrorLine || 'An error occurred while executing the operation',
    );
  }
}
