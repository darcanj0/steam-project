import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './Game/game.module';
import { GenreModule } from './Genre/genre.module';

@Module({
  imports: [GameModule, UserModule, PrismaModule, GenreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
