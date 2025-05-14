import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Post()
  async create(@Body() event: Partial<Event>): Promise<Event> {
    return this.eventsService.create(event);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() event: Partial<Event>,
  ): Promise<Event> {
    return this.eventsService.update(id, event);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.eventsService.remove(id);
  }
}
