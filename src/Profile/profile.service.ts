import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.utils';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const data = { ...createProfileDto };
    return this.prisma.profile
      .create({ data })
      .catch(handleError);
  }

  findAll(): Promise<Profile[]> {
    return this.prisma.profile.findMany();
  }

  async verifyIdAndReturnProfile(id: string): Promise<Profile> {
    const record = await this.prisma.profile.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Id ${id} register was not found.`);
    }
    return record;
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
      .update({ where: { id }, data })
      .catch(handleError);
  }

  async remove(id: string) {
    await this.verifyIdAndReturnProfile(id);
    await this.prisma.profile.delete({ where: { id } });
  }
}
