import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripStatus, Role } from 'generated/prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTripDto) {
    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new BadRequestException('Invalid trip date range');
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: { id: dto.touristId },
    });
    if (!tourist) throw new NotFoundException('Tourist not found');

    return this.prisma.trip.create({
      data: {
        touristId: dto.touristId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        destination: dto.destination,
        status: TripStatus.PLANNED,
      },
    });
  }

  async findAllForUser(user: any) {
    if (user.role === Role.TOURIST) {
      const tourist = await this.prisma.tourist.findUnique({
        where: { userId: user.sub },
      });
      if (!tourist) return [];

      return this.findAll(tourist.id);
    }

    return this.findAll();
  }

  private async findAll(touristId?: string) {
    const where: any = {};
    if (touristId) where.touristId = touristId;

    return this.prisma.trip.findMany({
      where,
      include: {
        tourist: {
          select: {
            id: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(id: string, user: any) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        tourist: { select: { id: true, userId: true } },
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');

    if (user.role === Role.TOURIST && trip.tourist.userId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }

    return trip;
  }

  async update(id: string, dto: UpdateTripDto) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');

    if (dto.status === TripStatus.CANCELED) {
      throw new BadRequestException('Use cancel endpoint');
    }

    if (dto.startDate && dto.endDate) {
      if (new Date(dto.startDate) >= new Date(dto.endDate)) {
        throw new BadRequestException('Invalid trip date range');
      }
    }

    return this.prisma.trip.update({
      where: { id },
      data: {
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        destination: dto.destination,
        status: dto.status,
      },
    });
  }

  async cancel(id: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');

    return this.prisma.trip.update({
      where: { id },
      data: {
        status: TripStatus.CANCELED,
        canceledAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');

    const deletedTrip = await this.prisma.trip.delete({ where: { id } });

    return {
      message: 'Trip successfully deleted',
      data: deletedTrip,
    };
  }
}
