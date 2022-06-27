import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  @ApiOperation({
    summary: 'List all games',
  })
  findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'List a game by id',
  })
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new game',
  })
  create(@Body() dto: CreateGameDto): Promise<Game> {
    return this.gameService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a game by id',
  })
  update(@Param('id') id: string, @Body() dto: UpdateGameDto): Promise<Game> {
    return this.gameService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a game by id',
  })
  remove(@Param('id') id: string) {
    this.gameService.remove(id);
  }
}
