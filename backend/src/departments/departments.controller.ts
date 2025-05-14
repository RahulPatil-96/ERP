import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './department.interface';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Post()
  async create(@Body() department: Partial<Department>): Promise<Department> {
    return this.departmentsService.create(department);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() department: Partial<Department>,
  ): Promise<Department> {
    return this.departmentsService.update(id, department);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
