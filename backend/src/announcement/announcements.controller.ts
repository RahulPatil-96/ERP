import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './announcement.interface';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  async findAll(): Promise<Announcement[]> {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Announcement> {
    return this.announcementsService.findOne(id);
  }

  @Post()
  async create(@Body() announcement: Partial<Announcement>): Promise<Announcement> {
    return this.announcementsService.create(announcement);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() announcement: Partial<Announcement>,
  ): Promise<Announcement> {
    return this.announcementsService.update(id, announcement);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.announcementsService.remove(id);
  }
}
