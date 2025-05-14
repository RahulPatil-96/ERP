import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { format, isToday, startOfWeek, addDays, differenceInCalendarDays } from 'date-fns';

// Types
interface ClassSession {
  time: string;
  subject: string;
  room: string;
  professor: string;
  type?: 'lecture' | 'lab' | 'seminar';
}

interface AcademicEvent {
  date: string;
  event: string;
  type?: 'holiday' | 'exam' | 'break';
}

// Constants
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

const SCHEDULE: Record<string, ClassSession[]> = {
  Monday: [
    { time: '9:00 AM', subject: 'Mathematics', room: 'Room 101', professor: 'Dr. Smith', type: 'lecture' },
    { time: '11:00 AM', subject: 'Physics', room: 'Lab 201', professor: 'Dr. Johnson', type: 'lab' },
    { time: '2:00 PM', subject: 'Computer Science', room: 'Lab 301', professor: 'Prof. Williams', type: 'seminar' },
  ],
  Tuesday: [
    { time: '10:00 AM', subject: 'Chemistry', room: 'Lab 202', professor: 'Dr. Brown', type: 'lab' },
    { time: '2:00 PM', subject: 'English', room: 'Room 102', professor: 'Prof. Davis', type: 'lecture' },
  ],
  Wednesday: [
    { time: '10:00 AM', subject: 'Biology', room: 'Lab 203', professor: 'Dr. Green', type: 'lab' },
    { time: '12:00 PM', subject: 'History', room: 'Room 105', professor: 'Prof. Adams', type: 'lecture' },
    { time: '3:00 PM', subject: 'Art', room: 'Studio 301', professor: 'Ms. Clark', type: 'seminar' },
  ],
};

const ACADEMIC_CALENDAR: AcademicEvent[] = [
  { date: '2025-04-15', event: 'Mid-Term Exam Week Begins', type: 'exam' },
  { date: '2025-05-01', event: 'Labor Day (Holiday)', type: 'holiday' },
  { date: '2025-06-05', event: 'End of Semester Exams', type: 'exam' },
  { date: '2025-06-10', event: 'Summer Break Begins', type: 'break' },
];

// Utility functions
const getCurrentDaySchedule = () => {
  const today = format(new Date(), 'EEEE');
  return SCHEDULE[today] || [];
};

const getEventType = (type?: string) => {
  switch (type) {
    case 'exam': return 'destructive';
    case 'holiday': return 'success';
    case 'break': return 'info';
    default: return 'neutral';
  }
};

export function Schedule() {
  const currentDate = new Date();
  const todaySchedule = getCurrentDaySchedule();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = DAYS.map((_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Academic Schedule"
        subtitle="Manage your class timetable and important academic dates"
        icon={CalendarIcon}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card className="p-6 shadow-sm">
          <div className="flex flex-col justify-between mb-6 space-y-4 sm:flex-row sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">{format(currentDate, 'EEEE, MMMM do')}</span>
            </div>
          </div>

          {todaySchedule.length > 0 ? (
            <div className="space-y-4">
              {todaySchedule.map((session, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 transition-all bg-white border rounded-lg hover:border-indigo-200 group hover:shadow-sm"
                >
                  <div className="flex-shrink-0 w-20">
                    <Badge variant={session.type === 'lab' ? 'warning' : 'neutral'} className="text-xs">
                      {session.type}
                    </Badge>
                    <div className="mt-1 text-sm font-medium text-gray-900">{session.time}</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-gray-900">{session.subject}</h3>
                    <p className="text-sm text-gray-600">{session.professor}</p>
                    <p className="text-sm text-gray-500">{session.room}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400" />
              <p className="mt-4 text-gray-600">No classes scheduled for today</p>
            </div>
          )}
        </Card>

        {/* Academic Calendar */}
        <Card className="p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Academic Calendar</h2>
          <div className="space-y-4">
            {ACADEMIC_CALENDAR.map((event, index) => {
              const eventDate = new Date(event.date);
              const isPast = differenceInCalendarDays(eventDate, currentDate) < 0;

              return (
                <div
                  key={index}
                  className={`p-4 border-l-4 rounded-lg ${isPast ? 'opacity-60' : ''} ${
                    event.type === 'exam' ? 'border-red-200' :
                    event.type === 'holiday' ? 'border-green-200' : 
                    'border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {format(eventDate, 'MMM do')}
                      </div>
                      <div className="text-sm text-gray-600">{event.event}</div>
                    </div>
                    <Badge variant={getEventType(event.type)} className="ml-2">
                      {event.type || 'event'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card className="p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Weekly Timetable</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-32 p-3 text-sm font-medium text-gray-500 bg-gray-50"></th>
                {DAYS.map((day, index) => {
                  const date = weekDates[index];
                  return (
                    <th
                      key={day}
                      className={`p-3 text-sm font-medium text-gray-900 bg-gray-50 ${isToday(date) ? 'bg-indigo-50' : ''}`}
                    >
                      {day}
                      <br />
                      <span className="text-xs font-normal text-gray-500">
                        {format(date, 'MMM do')}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="border-t border-gray-100">
                  <td className="w-32 p-3 text-sm text-center text-gray-500 bg-gray-50">{time}</td>
                  {DAYS.map((day) => {
                    const session = SCHEDULE[day]?.find((s) => s.time === time);
                    return (
                      <td key={`${day}-${time}`} className="p-2 border border-gray-100">
                        {session ? (
                          <div className="h-full p-2 text-sm transition-all bg-white rounded-md hover:bg-indigo-50">
                            <div className="font-medium text-gray-900">{session.subject}</div>
                            <div className="text-xs text-gray-500">{session.room}</div>
                            <div className="mt-1 text-xs text-indigo-600">{session.professor}</div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}