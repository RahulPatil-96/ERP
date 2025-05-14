import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.interface';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Post()
  async create(@Body() course: Partial<Course>): Promise<Course> {
    return this.coursesService.create(course);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() course: Partial<Course>,
  ): Promise<Course> {
    return this.coursesService.update(id, course);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.coursesService.remove(id);
  }
}
