import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentsService } from './students.service';
import { Student } from './student.interface';

declare global {
  namespace Express {
    interface Multer {
      // Add any necessary typings here if needed
    }
  }
}

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Post()
  async create(@Body() student: Partial<Student>): Promise<Student> {
    return this.studentsService.create(student);
  }

  @Post('bulk')
  async bulkCreate(@Body() students: Partial<Student>[]): Promise<Student[]> {
    return this.studentsService.bulkCreate(students);
  }

  @Post('upload-excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: any): Promise<Student[]> {
    return this.studentsService.processExcelFile(file);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() student: Partial<Student>,
  ): Promise<Student> {
    return this.studentsService.update(id, student);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.studentsService.remove(id);
  }
}
