import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { handleUniqueConstraintError } from 'src/utils/handle-error-constraint-unique.utils';

@Injectable()
export class UserService {
  private userSelect = {
    id: true,
    user_name: true,
    email: true,
    is_admin: true,
    password: false,
    cpf: true,
    created_at: true,
    updated_at: true,
  };
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ select: this.userSelect });
  }

  async verifyIdAndReturnUser(id: string): Promise<User> {
    const record = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
    if (!record) {
      throw new NotFoundException(`Id ${id} register was not found.`);
    }
    return record;
  }

  findOne(id: string): Promise<User> {
    return this.verifyIdAndReturnUser(id);
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (dto.password != dto.confirm_password) {
      throw new BadRequestException('Passwords sent are not equal.');
    }
    delete dto.confirm_password;
    const data: User = { ...dto, password: await bcrypt.hash(dto.password, 8) };
    return this.prisma.user
      .create({ data, select: this.userSelect })
      .catch(handleUniqueConstraintError);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.verifyIdAndReturnUser(id);

    if (dto.password) {
      if (dto.password != dto.confirm_password) {
        throw new BadRequestException('Passwords sent are not equal.');
      }
    }

    delete dto.confirm_password;

    if (dto.password) {
      dto = { ...dto, password: await bcrypt.hash(dto.password, 8) };
    }

    const data: Partial<User> = { ...dto };
    return this.prisma.user
      .update({
        where: { id },
        data,
        select: this.userSelect,
      })
      .catch(handleUniqueConstraintError);
  }

  async remove(id: string) {
    await this.verifyIdAndReturnUser(id);
    await this.prisma.user.delete({ where: { id } });
  }
}
