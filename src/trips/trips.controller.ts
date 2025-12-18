import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../common/guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from 'generated/prisma/client';

@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles(Role.EMPLOYEE)
  create(@Body() dto: CreateTripDto) {
    return this.tripsService.create(dto);
  }

  @Get()
  @Roles(Role.EMPLOYEE, Role.TOURIST)
  findAll(@Req() req) {
    return this.tripsService.findAllForUser(req.user);
  }

  @Get(':id')
  @Roles(Role.EMPLOYEE, Role.TOURIST)
  findOne(@Param('id') id: string, @Req() req) {
    return this.tripsService.findOneForUser(id, req.user);
  }

  @Put(':id')
  @Roles(Role.EMPLOYEE)
  update(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.tripsService.update(id, dto);
  }

  @Patch(':id/cancel')
  @Roles(Role.EMPLOYEE)
  cancel(@Param('id') id: string) {
    return this.tripsService.cancel(id);
  }

  @Delete(':id')
  @Roles(Role.EMPLOYEE)
  remove(@Param('id') id: string) {
    return this.tripsService.remove(id);
  }
}
