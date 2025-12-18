import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../common/guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from 'generated/prisma/client';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.employeesService.findByUserId(userId);
  }

  @Put(':userId')
  update(@Param('userId') userId: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(userId, dto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.employeesService.remove(userId);
  }
}
