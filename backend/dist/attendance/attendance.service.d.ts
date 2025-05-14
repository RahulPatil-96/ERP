import { SupabaseService } from '../supabase/supabase.service';
import { AttendanceRecord } from './attendance.interface';
export declare class AttendanceService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    saveAttendance(records: AttendanceRecord[]): Promise<void>;
    getAttendanceRecords(date: string, courseId: string, timeSlot: number, sessionType: string): Promise<AttendanceRecord[]>;
}
