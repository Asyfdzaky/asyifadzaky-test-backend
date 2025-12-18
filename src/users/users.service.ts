import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateTouristDto } from './dto/create-tourist.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
          role: Role.EMPLOYEE,
        },
      });

      await tx.employee.create({
        data: {
          userId: user.id,
          position: dto.position,
        },
      });

      return {
        message: 'Employee account created successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    });
  }

  async createTourist(dto: CreateTouristDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.fullName,
          passwordHash,
          role: Role.TOURIST,
        },
      });

      await tx.tourist.create({
        data: {
          userId: user.id,
          phone: dto.phone,
          gender: dto.gender,
          age: dto.age,
          address: dto.address,
        },
      });

      return { message: 'Tourist account created successfully', data: dto };
    });
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async updateUserCredentials(userId: string, dto: UpdateCredentialsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const data: any = {};

    if (dto.email && dto.email !== user.email) {
      const exists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (exists) throw new BadRequestException('Email already in use');
      data.email = dto.email;
    }

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (Object.keys(data).length === 0) {
      return { message: 'No changes provided' };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return { message: 'User credentials updated successfully' };
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
        tourist: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (tx) => {
      if (user.employee) {
        await tx.employee.delete({ where: { userId } });
      }

      if (user.tourist) {
        await tx.tourist.delete({ where: { userId } });
      }

      await tx.user.delete({ where: { id: userId } });

      return { message: 'User deleted successfully' };
    });
  }
}
