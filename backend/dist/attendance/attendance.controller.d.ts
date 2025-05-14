import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from './attendance.interface';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    saveAttendance(records: AttendanceRecord[]): Promise<{
        message: string;
    }>;
    getAttendanceRecords(date: string, courseId: string, timeSlot: string, sessionType: string): Promise<AttendanceRecord[]>;
}
