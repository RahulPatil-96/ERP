export interface AttendanceRecord {
    id?: number;
    entityId: number;
    entityType: 'student' | 'faculty';
    date: string;
    status: 'present' | 'absent' | 'late';
    courseId: string;
    timeSlot: number;
    sessionType: 'Lecture' | 'Practical';
    lastUpdated?: string;
}
