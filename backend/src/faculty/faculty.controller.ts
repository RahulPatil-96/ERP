import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { Faculty } from './faculty.interface';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  async findAll(): Promise<Faculty[]> {
    return this.facultyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Faculty> {
    return this.facultyService.findOne(id);
  }

  @Post()
  async create(@Body() faculty: Partial<Faculty>): Promise<Faculty> {
    return this.facultyService.create(faculty);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() faculty: Partial<Faculty>,
  ): Promise<Faculty> {
    return this.facultyService.update(id, faculty);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.facultyService.remove(id);
  }
}
