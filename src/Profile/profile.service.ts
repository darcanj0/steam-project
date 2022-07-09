import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.utils';
import { CreateProfileDto } from './dto/create-profile.dto';
import { FavoriteGameDto } from './dto/favorite-game.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  private profileSelect = {
    id: true,
    gamer_tag: true,
    image_url: true,
    user_owner_id: true,
    favorite_games: { select: { id: true, title: true } },
    created_at: true,
    updated_at: true,
  };

  create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const data = { ...createProfileDto };
    return this.prisma.profile.create({ data }).catch(handleError);
  }

  findAll(): Promise<Profile[]> {
    return this.prisma.profile.findMany({ select: this.profileSelect });
  }

  async verifyIdAndReturnProfile(id: string): Promise<Profile> {
    const record = await this.prisma.profile.findUnique({
      where: { id },
      select: this.profileSelect,
    });
    if (!record) {
      throw new NotFoundException(`Id ${id} register was not found.`);
    }
    return record;
  }

  async favorite(id: string, dto: FavoriteGameDto): Promise<Profile> {
    await this.verifyIdAndReturnProfile(id);
    const data: Prisma.profileUpdateInput = {
      favorite_games: { connect: [{ id: dto.id }] },
    };
    return this.prisma.profile
      .update({
        where: { id },
        select: this.profileSelect,
        data,
      })
      .catch(handleError);
  }

  async unfavorite(id: string, dto: FavoriteGameDto): Promise<Profile> {
    await this.verifyIdAndReturnProfile(id);
    const data: Prisma.profileUpdateInput = {
      favorite_games: { disconnect: [{ id: dto.id }] },
    };
    return this.prisma.profile
      .update({
        where: { id },
        select: this.profileSelect,
        data,
      })
      .catch(handleError);
  }

  findOne(id: string): Promise<Profile> {
    return this.verifyIdAndReturnProfile(id);
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    await this.verifyIdAndReturnProfile(id);
    const data = { ...updateProfileDto };
    return this.prisma.profile
      .update({ where: { id }, data, select: this.profileSelect })
      .catch(handleError);
  }

  async remove(id: string) {
    await this.verifyIdAndReturnProfile(id);
    await this.prisma.profile.delete({ where: { id } });
  }
}
