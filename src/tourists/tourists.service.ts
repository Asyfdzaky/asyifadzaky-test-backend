import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { UpdateTouristDto } from './dto/update-tourist.dto';

@Injectable()
export class TouristsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tourist.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    const tourist = await this.prisma.tourist.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tourist) throw new NotFoundException('Tourist not found');
    return tourist;
  }

  async update(userId: string, dto: UpdateTouristDto) {
    const tourist = await this.prisma.tourist.findUnique({
      where: { userId },
    });

    if (!tourist) throw new NotFoundException('Tourist not found');

    return this.prisma.tourist.update({
      where: { userId },
      data: dto,
    });
  }

  async remove(userId: string) {
    const tourist = await this.prisma.tourist.findUnique({
      where: { userId },
    });

    if (!tourist) throw new NotFoundException('Tourist not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.tourist.delete({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
      return { message: 'Tourist removed successfully' };
    });
  }
}
