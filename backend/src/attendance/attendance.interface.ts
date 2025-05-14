export interface AttendanceRecord {
  id?: number;
  entityId: number; // studentId or facultyId
  entityType: 'student' | 'faculty';
  date: string; // ISO date string
  status: 'present' | 'absent' | 'late';
  courseId: string;
  timeSlot: number;
  sessionType: 'Lecture' | 'Practical';
  lastUpdated?: string; // ISO date string
}
