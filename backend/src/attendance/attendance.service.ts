import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AttendanceRecord } from './attendance.interface';

@Injectable()
export class AttendanceService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async saveAttendance(records: AttendanceRecord[]): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Insert attendance records in bulk
    const { error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'entityId,date,courseId,timeSlot,sessionType' });

    if (error) {
      console.error('Error saving attendance:', error);
      throw new Error('Failed to save attendance');
    }
  }

  async getAttendanceRecords(
    date: string,
    courseId: string,
    timeSlot: number,
    sessionType: string,
  ): Promise<AttendanceRecord[]> {
    const supabase = this.supabaseService.getClient();

    // Defensive check for invalid parameters
    if (!date || !courseId || !timeSlot || !sessionType) {
      throw new Error('Missing required query parameters');
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*, students(name, studentId)') // join with students table to get student name and id
      .eq('date', date)
      .eq('courseId', courseId)
      .eq('timeSlot', timeSlot)
      .eq('sessionType', sessionType);

    if (error) {
      console.error('Error fetching attendance records:', error);
      throw new Error('Failed to fetch attendance records');
    }

    // Map data to include student name and studentId from joined table
    const mappedData = data.map((record: any) => ({
      ...record,
      name: record.students?.name || 'Unknown',
      studentId: record.students?.studentId || '',
    }));

    return mappedData as AttendanceRecord[];
  }
}
