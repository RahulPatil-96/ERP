import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from './attendance.interface';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async saveAttendance(@Body() records: AttendanceRecord[]): Promise<{ message: string }> {
    await this.attendanceService.saveAttendance(records);
    return { message: 'Attendance saved successfully' };
  }

  @Get()
  async getAttendanceRecords(
    @Query('date') date: string,
    @Query('courseId') courseId: string,
    @Query('timeSlot') timeSlot: string,
    @Query('sessionType') sessionType: string,
  ): Promise<AttendanceRecord[]> {
    const timeSlotNumber = parseInt(timeSlot, 10);
    return this.attendanceService.getAttendanceRecords(date, courseId, timeSlotNumber, sessionType);
  }
}
