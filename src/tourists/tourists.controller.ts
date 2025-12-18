import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TouristsService } from './tourists.service';
import { JwtAuthGuard } from '../common/guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from 'generated/prisma/client';
import { UpdateTouristDto } from './dto/update-tourist.dto';

@Controller('tourists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EMPLOYEE)
export class TouristsController {
  constructor(private touristsService: TouristsService) {}

  @Get()
  findAll() {
    return this.touristsService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.touristsService.findByUserId(userId);
  }

  @Put(':userId')
  update(@Param('userId') userId: string, @Body() dto: UpdateTouristDto) {
    return this.touristsService.update(userId, dto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.touristsService.remove(userId);
  }
}
