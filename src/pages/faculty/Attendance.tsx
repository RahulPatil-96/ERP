import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Search, Filter, Check, X, Clock, Loader2, Download, Save } from 'lucide-react';
import { format, subDays, addDays, startOfDay, isToday } from 'date-fns';
import { throttle } from 'lodash';
import { PageHeader } from '../../components/common/PageHeader';
import { supabase } from '../../lib/supabase';

interface Student {
  id: number;
  name: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  lastUpdated?: Date;
}

interface Faculty {
  id: number;
  name: string;
  facultyId: string;
  status: 'present' | 'absent' | 'late';
  lastUpdated?: Date;
}

interface Course {
  id: string;
  name: string;
  schedule: Date[];
}

const timeSlots = [
  { id: 1, label: '9:00 AM - 10:00 AM' },
  { id: 2, label: '10:00 AM - 11:00 AM' },
  { id: 3, label: '11:00 AM - 12:00 PM' },
  { id: 4, label: '1:00 PM - 2:00 PM' },
  { id: 5, label: '2:00 PM - 3:00 PM' },
  { id: 6, label: '3:00 PM - 4:00 PM' }
];

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedCourse, setSelectedCourse] = useState<string>('CS101');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('All');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0].id);
  const [sessionType, setSessionType] = useState<'Lecture' | 'Practical'>('Lecture');

  // Removed unused state and variables to fix TS warnings
  // const [attendanceStatus, setAttendanceStatus] = useState('All');
  // const filteredEntities = useMemo(() => { ... });

  // New state for tab selection
  const [activeTab, setActiveTab] = useState<'mark' | 'view'>('mark');
  const [previousAttendance, setPreviousAttendance] = useState<Student[]>([]);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
  const [errorPrevious, setErrorPrevious] = useState<string | null>(null);

  // Fetch previous attendance when activeTab is 'view' and dependencies change
  useEffect(() => {
    if (activeTab === 'view') {
      const fetchPreviousAttendance = async () => {
        setIsLoadingPrevious(true);
        setErrorPrevious(null);
        try {
          const response = await fetch(`/api/attendance?date=${selectedDate.toISOString().split('T')[0]}&course=${selectedCourse}&timeSlot=${selectedTimeSlot}&sessionType=${sessionType}`);
          if (!response.ok) {
            throw new Error(`Error fetching previous attendance: ${response.statusText}`);
          }
          const data = await response.json();
          // Map data to Student[] shape with status and lastUpdated
          const mappedData = data.map((record: any) => ({
            id: record.entityId,
            name: record.name || 'Unknown',
            studentId: record.studentId || '',
            status: record.status,
            lastUpdated: record.lastUpdated ? new Date(record.lastUpdated) : undefined,
          }));
          setPreviousAttendance(mappedData);
        } catch (error: any) {
          setErrorPrevious(error.message || 'Failed to load previous attendance');
        } finally {
          setIsLoadingPrevious(false);
        }
      };
      fetchPreviousAttendance();
    }
  }, [activeTab, selectedDate, selectedCourse, selectedTimeSlot, sessionType]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error(`Error fetching students: ${response.statusText}`);
        }
        const data = await response.json();
        // Assign default status 'absent' to each student to avoid undefined status
        const studentsWithStatus = data.map((student: any) => ({
          ...student,
          status: 'absent' as 'present' | 'absent' | 'late',
        }));
        setStudents(studentsWithStatus);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const mockCourses: Course[] = [
      { id: 'CS101', name: 'Introduction to Computer Science', schedule: [new Date()] },
      { id: 'EE201', name: 'Digital Electronics', schedule: [new Date()] },
      { id: 'MATH101', name: 'Calculus I', schedule: [new Date()] },
      { id: 'PHYS101', name: 'Physics I', schedule: [new Date()] },
      { id: 'CHEM101', name: 'Chemistry I', schedule: [new Date()] },
      { id: 'BIO101', name: 'Introduction to Biology', schedule: [new Date()] },
      { id: 'CS202', name: 'Data Structures and Algorithms', schedule: [new Date()] },
      { id: 'CS303', name: 'Database Systems', schedule: [new Date()] },
      { id: 'ENG101', name: 'English Composition', schedule: [new Date()] },
      { id: 'HIST101', name: 'World History', schedule: [new Date()] },
      { id: 'PSY101', name: 'Introduction to Psychology', schedule: [new Date()] },
      { id: 'ECON101', name: 'Macroeconomics', schedule: [new Date()] },
      { id: 'ART101', name: 'Introduction to Art', schedule: [new Date()] },
      { id: 'MATH102', name: 'Calculus II', schedule: [new Date()] },
      { id: 'PHYS102', name: 'Physics II', schedule: [new Date()] },
      { id: 'CS404', name: 'Operating Systems', schedule: [new Date()] },
      { id: 'CS405', name: 'Computer Networks', schedule: [new Date()] },
      { id: 'MATH201', name: 'Linear Algebra', schedule: [new Date()] },
      { id: 'CS410', name: 'Software Engineering', schedule: [new Date()] },
      { id: 'CS420', name: 'Artificial Intelligence', schedule: [new Date()] },
    ];
    
    setCourses(mockCourses);

    fetchStudents();
    
    setIsLoading(false);
  }, []);

  const filteredEntities = useMemo(() => {
    return students.filter(entity => {
      const statusMatches = attendanceStatus === 'All' || entity.status === attendanceStatus.toLowerCase();
      const searchMatches = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entity as any).studentId?.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatches && searchMatches;
    });
  }, [students, attendanceStatus, searchTerm]);

  const handleSearch = useCallback(throttle((term: string) => {
    setSearchTerm(term);
  }, 300), []);

  const changeAttendanceStatus = (id: number, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(student => 
      student.id === id 
        ? { ...student, status, lastUpdated: new Date() }
        : student
    ));
  };

  const saveAttendance = async () => {
    setIsSaving(true);
    try {
      const attendanceRecords = students.map(entity => ({
        entityId: entity.id,
        entityType: 'student',
        date: selectedDate.toISOString().split('T')[0], // yyyy-mm-dd
        status: entity.status,
        courseId: selectedCourse,
        timeSlot: selectedTimeSlot,
        sessionType,
        lastUpdated: entity.lastUpdated ? entity.lastUpdated.toISOString() : new Date().toISOString(),
      }));

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(attendanceRecords),
        credentials: 'include', // include cookies for auth if any
      });

      if (!response.ok) {
        throw new Error('Failed to save attendance');
      }

      showNotification('Attendance saved successfully');
    } catch (error) {
      console.error('Error saving attendance:', error);
      showNotification('Error saving attendance');
    } finally {
      setIsSaving(false);
    }
  };

  const exportReport = () => {
    showNotification('Report exported successfully');
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Attendance Management"
        subtitle="Manage student attendance for your courses"
        icon={Calendar}
      />

      {/* New Tab UI */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === 'mark' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('mark')}
        >
          Mark Attendance
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === 'view' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('view')}
        >
          View Previous Attendance
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <DateNavigator
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            isToday={isToday(selectedDate)}
          />
          
          {/* Responsive Grid Layout for Course Selector, Time Slot Selector, and Session Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <CourseSelector
              courses={courses}
              selectedCourse={selectedCourse}
              onCourseChange={setSelectedCourse}
            />
            <TimeSlotSelector
              timeSlots={timeSlots}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotChange={setSelectedTimeSlot}
            />
            <SessionTypeSelector
              sessionType={sessionType}
              onSessionTypeChange={setSessionType}
            />
          </div>
        </div>

        {activeTab === 'mark' ? (
          isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading attendance data...</p>
            </div>
          ) : (
            <>
              <AttendanceTable
                entities={students}
                onChangeStatus={changeAttendanceStatus}
                isFaculty={false}
              />
              
              <SummaryActions
                total={students.length}
                present={students.filter(e => e.status === 'present').length}
                absent={students.filter(e => e.status === 'absent').length}
                late={students.filter(e => e.status === 'late').length}
                onSave={saveAttendance}
                onExport={exportReport}
                isSaving={isSaving}
              />
            </>
          )
        ) : (
          <div>
            {isLoadingPrevious ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
                <p className="mt-4 text-gray-600">Loading previous attendance...</p>
              </div>
            ) : errorPrevious ? (
              <div className="text-center py-12 text-red-600">
                <p>{errorPrevious}</p>
              </div>
            ) : (
              <AttendanceTable
                entities={previousAttendance}
                onChangeStatus={() => {}}
                isFaculty={false}
              />
            )}
          </div>
        )}
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md flex items-center">
          <Check className="w-5 h-5 mr-2" />
          {notification}
        </div>
      )}
    </div>
  );
};

// Session Type Selector Component
const SessionTypeSelector: React.FC<{ sessionType: 'Lecture' | 'Practical'; onSessionTypeChange: (type: 'Lecture' | 'Practical') => void; }> = ({ sessionType, onSessionTypeChange }) => (
  <div className="flex flex-col mb-4">
    <label className="text-gray-700">Select Session Type:</label>
    <select
      value={sessionType}
      onChange={e => onSessionTypeChange(e.target.value as 'Lecture' | 'Practical')}
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    >
      <option value="Lecture">Lecture</option>
      <option value="Practical">Practical</option>
    </select>
  </div>
);

// Time Slot Selector Component
const TimeSlotSelector: React.FC<{ timeSlots: { id: number; label: string }[]; selectedTimeSlot: number; onTimeSlotChange: (id: number) => void; }> = ({ timeSlots, selectedTimeSlot, onTimeSlotChange }) => (
  <div className="flex flex-col mb-4">
    <label className="text-gray-700">Select Time Slot:</label>
    <select
      value={selectedTimeSlot}
      onChange={e => onTimeSlotChange(Number(e.target.value))}
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    >
      {timeSlots.map(slot => (
        <option key={slot.id} value={slot.id}>
          {slot.label}
        </option>
      ))}
    </select>
  </div>
);

// Sub-components
interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isToday: boolean;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange, isToday }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onDateChange(subDays(selectedDate, 1))}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg">
        <Calendar className="w-5 h-5 text-purple-600" />
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={e => onDateChange(new Date(e.target.value))}
          className="bg-transparent text-gray-800 font-medium focus:outline-none"
        />
        {isToday && (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-2">
            Today
          </span>
        )}
      </div>

      <button
        onClick={() => onDateChange(addDays(selectedDate, 1))}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  </div>
);

interface CourseSelectorProps {
  courses: Course[];
  selectedCourse: string;
  onCourseChange: (courseId: string) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ courses, selectedCourse, onCourseChange }) => (
  <div className="flex flex-col mb-4">
    <label className="text-gray-700">Select Course:</label>
    <select
      value={selectedCourse}
      onChange={e => onCourseChange(e.target.value)}
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    >
      {courses.map(course => (
        <option key={course.id} value={course.id}>
          {course.id}: {course.name}
        </option>
      ))}
    </select>
  </div>
);

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  attendanceStatus: string;
  onStatusChange: (status: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, onSearchChange, attendanceStatus, onStatusChange }) => (
  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
    <div className="relative flex-grow">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        placeholder="Search students..."
      />
    </div>

    <div className="relative w-full md:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Filter className="h-5 w-5 text-gray-400" />
      </div>
      <select
        value={attendanceStatus}
        onChange={e => onStatusChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
      >
        <option value="All">All</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Late">Late</option>
      </select>
    </div>
  </div>
);

interface AttendanceTableProps {
  entities: (Student | Faculty)[];
  onChangeStatus: (id: number, status: 'present' | 'absent' | 'late') => void;
  isFaculty: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ entities, onChangeStatus, isFaculty }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entities.map(entity => (
            <tr key={entity.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium text-sm">
                      {entity.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{entity.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{isFaculty ? (entity as Faculty).facultyId : (entity as Student).studentId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <StatusBadge status={entity.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center space-x-3">
                  <ActionButton onClick={() => onChangeStatus(entity.id, 'present')} icon={<Check />} label="Mark Present" />
                  <ActionButton onClick={() => onChangeStatus(entity.id, 'absent')} icon={<X />} label="Mark Absent" />
                  <ActionButton onClick={() => onChangeStatus(entity.id, 'late')} icon={<Clock />} label="Mark Late" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: 'present' | 'absent' | 'late';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClasses = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800',
  };

  // Defensive check for undefined or invalid status
  if (!status || !statusClasses[status]) {
    return (
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
        Unknown
      </span>
    );
  }

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
    aria-label={label}
  >
    {icon}
  </button>
);

interface SummaryActionsProps {
  total: number;
  present: number;
  absent: number;
  late: number;
  onSave: () => void;
  onExport: () => void;
  isSaving: boolean;
}

const SummaryActions: React.FC<SummaryActionsProps> = ({ total, present, absent, late, onSave, onExport, isSaving }) => (
  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-700">
        <span className="font-medium">Total:</span> {total} |
        <span className="ml-2 font-medium text-green-600">Present:</span> {present} |
        <span className="ml-2 font-medium text-red-600">Absent:</span> {absent} |
        <span className="ml-2 font-medium text-yellow-600">Late:</span> {late}
      </div>

      <div className="mt-4 md:mt-0 flex space-x-3">
        <button
          onClick={onSave}
          className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} transition`}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Save Attendance
        </button>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </button>
      </div>
    </div>
  </div>
);

export default Attendance;