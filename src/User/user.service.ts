import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: string): Promise<User> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Id ${id} register was not found.`);
    }
    return record;
  }

  findOne(id: string): Promise<User> {
    return this.findById(id);
  }

  create(dto: CreateUserDto): Promise<User> {
    const data: User = { ...dto, password: bcrypt.hashSync(dto.password, 8) };
    return this.prisma.user.create({ data }).catch(this.handleError);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id);
    const data: Partial<User> = {
      ...dto,
      password: bcrypt.hashSync(dto.password, 8),
    };
    return this.prisma.user
      .update({
        where: { id },
        data,
      })
      .catch(this.handleError);
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.user.delete({
      where: { id },
    });
  }

  handleError(error: Error): undefined {
    const errorLines = error.message?.split('\n');
    const lastErrorLine = errorLines[errorLines.length - 1]?.trim();
    throw new UnprocessableEntityException(
      lastErrorLine || 'An error occurred while executing the operation',
    );
  }
}
