import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from 'generated/prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateTouristDto } from './dto/create-tourist.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('employee')
  @Roles(Role.ADMIN)
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.usersService.createEmployee(dto);
  }

  @Post('tourist')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  createTourist(@Body() dto: CreateTouristDto) {
    return this.usersService.createTourist(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Put(':id/credentials')
  @Roles(Role.ADMIN)
  updateCredentials(
    @Param('id') id: string,
    @Body() dto: UpdateCredentialsDto,
  ) {
    return this.usersService.updateUserCredentials(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
