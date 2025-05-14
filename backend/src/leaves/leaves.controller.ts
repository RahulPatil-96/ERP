import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { Leave } from './leave.interface';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get()
  async findAll(): Promise<Leave[]> {
    return this.leavesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Leave> {
    return this.leavesService.findOne(id);
  }

  @Post()
  async create(@Body() leave: Partial<Leave>): Promise<Leave> {
    return this.leavesService.create(leave);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() leave: Partial<Leave>,
  ): Promise<Leave> {
    return this.leavesService.update(id, leave);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.leavesService.remove(id);
  }
}
