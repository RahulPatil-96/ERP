import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.interface';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(): Promise<Assignment[]> {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Assignment> {
    return this.assignmentsService.findOne(id);
  }

  @Post()
  async create(@Body() assignment: Partial<Assignment>): Promise<Assignment> {
    return this.assignmentsService.create(assignment);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() assignment: Partial<Assignment>,
  ): Promise<Assignment> {
    return this.assignmentsService.update(id, assignment);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.assignmentsService.remove(id);
  }
}
