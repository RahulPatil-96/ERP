import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, PlusCircle, Edit, ClipboardList } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

type ScheduleType = {
  [year: string]: {
    [day: string]: {
      time: string;
      subject: string;
      class: string;
      room: string;
      students: number;
      type: 'Lecture' | 'Practical'
    }[];
  };
};

const SCHEDULE: ScheduleType = {
  'FY': {
    'Monday': [
      { time: '9:00 AM', subject: 'Introduction to Programming', class: 'CS-101', room: 'Room 101', students: 45, type: 'Lecture' },
      { time: '2:00 PM', subject: 'Discrete Mathematics', class: 'MATH-101', room: 'Room 102', students: 50, type: 'Lecture' }
    ],
    'Tuesday': [
      { time: '11:00 AM', subject: 'Physics', class: 'PHYS-101', room: 'Room 103', students: 40, type: 'Lecture' }
    ],
    'Wednesday': [
      { time: '10:00 AM', subject: 'Digital Logic Design', class: 'EE-101', room: 'Lab 201', students: 40, type: 'Practical' }
    ],
    'Thursday': [
      { time: '1:00 PM', subject: 'Mathematics for Engineers', class: 'MATH-102', room: 'Room 104', students: 45, type: 'Lecture' }
    ],
    'Friday': [
      { time: '9:00 AM', subject: 'Computer Architecture', class: 'CS-102', room: 'Room 105', students: 30, type: 'Lecture' }
    ],
  },
  'SY': {
    'Monday': [
      { time: '10:00 AM', subject: 'Data Structures', class: 'CS-201', room: 'Room 202', students: 35, type: 'Lecture' },
    ],
    'Tuesday': [
      { time: '11:00 AM', subject: 'Algorithms', class: 'CS-202', room: 'Room 203', students: 40, type: 'Lecture' }
    ],
    'Wednesday': [
      { time: '2:00 PM', subject: 'Digital Signal Processing', class: 'EE-201', room: 'Lab 204', students: 25, type: 'Practical' }
    ],
    'Thursday': [
      { time: '9:00 AM', subject: 'Computer Networks', class: 'CS-204', room: 'Room 205', students: 38, type: 'Lecture' }
    ],
    'Friday': [
      { time: '10:00 AM', subject: 'Operating Systems', class: 'CS-205', room: 'Room 206', students: 42, type: 'Lecture' }
    ],
  },
  'TY': {
    'Monday': [
      { time: '3:00 PM', subject: 'Machine Learning', class: 'CS-301', room: 'Lab 301', students: 30, type: 'Practical' }
    ],
    'Tuesday': [
      { time: '9:00 AM', subject: 'Data Science', class: 'CS-302', room: 'Room 301', students: 25, type: 'Lecture' }
    ],
    'Wednesday': [
      { time: '2:00 PM', subject: 'Computer Vision', class: 'CS-303', room: 'Lab 302', students: 35, type: 'Practical' }
    ],
    'Thursday': [
      { time: '1:00 PM', subject: 'Web Development', class: 'CS-304', room: 'Room 302', students: 28, type: 'Lecture' }
    ],
    'Friday': [
      { time: '10:00 AM', subject: 'Artificial Intelligence', class: 'CS-305', room: 'Room 303', students: 22, type: 'Lecture' }
    ],
  },
  'Final Year': {
    'Monday': [
      { time: '10:00 AM', subject: 'Capstone Project', class: 'CS-401', room: 'Project Lab', students: 20, type: 'Practical' }
    ],
    'Tuesday': [
      { time: '1:00 PM', subject: 'Advanced Algorithms', class: 'CS-402', room: 'Room 401', students: 15, type: 'Lecture' }
    ],
    'Wednesday': [
      { time: '2:00 PM', subject: 'Capstone Project', class: 'CS-403', room: 'Project Lab', students: 25, type: 'Practical' },
      { time: '4:00 PM', subject: 'Software Engineering', class: 'CS-404', room: 'Room 402', students: 18, type: 'Lecture' }
    ],
    'Thursday': [
      { time: '9:00 AM', subject: 'Web Development', class: 'CS-405', room: 'Room 403', students: 22, type: 'Lecture' }
    ],
    'Friday': [
      { time: '3:00 PM', subject: 'Database Management Systems', class: 'CS-406', room: 'Room 404', students: 25, type: 'Lecture' }
    ],
  }
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

function EditScheduleModal({
  isOpen,
  onRequestClose,
  session,
  onSave,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  session: any; // You can define a more specific type if needed
  onSave: (updatedSession: any) => void;
}) {
  const [formData, setFormData] = useState(session || {
    time: '',
    subject: '',
    class: '',
    room: '',
    students: 0,
    type: 'Lecture', // Default type
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    onRequestClose();
  };

  // If session is null, don't render the form
  if (!session) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2 className="modal-title">Edit Schedule</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <label>Time</label>
        <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="Enter time" />

        <label>Subject</label>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter subject" />

        <label>Class</label>
        <input type="text" name="class" value={formData.class} onChange={handleChange} placeholder="Enter class" />

        <label>Room</label>
        <input type="text" name="room" value={formData.room} onChange={handleChange} placeholder="Enter room" />

        <label>Students</label>
        <input type="number" name="students" value={formData.students} onChange={handleChange} placeholder="Number of students" />

        <label>Type</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Lecture">Lecture</option>
          <option value="Practical">Practical</option>
        </select>

        <div className="modal-actions">
          <button type="submit" className="btn-save">Save</button>
          <button type="button" onClick={onRequestClose} className="btn-cancel">Cancel</button>
        </div>
      </form>

      <style>
        {`
          .modal {
            padding: 20px;
            border-radius: 10px;
            background-color: white;
            max-width: 500px;
            margin: auto;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000; /* Ensure it appears above other content */
          }

          .overlay {
            background-color: rgba(0, 0, 0, 0.7);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999; /* Ensure it covers the entire screen */
          }

          .modal-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }

          .modal-form {
            display: flex;
            flex-direction: column;
          }

          .modal-form label {
            margin-top: 10px;
            font-weight: bold;
          }

          .modal-form input, .modal-form select {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 15px;
          }

          .modal-actions {
            display: flex;
            justify-content: space-between;
          }

          .btn-save {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .btn-cancel {
            background-color: #f44336;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        `}
      </style>
    </Modal>
  );
}

export function FacultySchedule() {
  const [selectedYear, setSelectedYear] = useState('FY');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const years = ['FY', 'SY', 'TY', 'Final Year'];

  const todaysSchedule = years.flatMap((year) => {
    const yearSessions = SCHEDULE[year][currentDay] || [];
    return yearSessions.map((session) => ({ ...session, year }));
  });

  const handleEditClick = (session: any) => {
    if (session) {
      setSelectedSession(session);
      setIsModalOpen(true);
    }
  };

  const handleSave = (updatedSession: any) => {
    const updatedSchedule = { ...SCHEDULE };
    const daySessions = updatedSchedule[selectedSession.year][currentDay];
    const sessionIndex = daySessions.findIndex(
      (s: any) => s.time === selectedSession.time && s.class === selectedSession.class
    );
    if (sessionIndex !== -1) {
      daySessions[sessionIndex] = updatedSession;
    }
    // Update the SCHEDULE with the new data
    Object.assign(SCHEDULE, updatedSchedule);
  };

  const generateRandomSchedule = () => {
    const subjects = ['Math', 'Science', 'History', 'Art', 'Physical Education'];
    const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105'];
    const newSchedule: ScheduleType = {};

    years.forEach((year) => {
      newSchedule[year] = {};
      DAYS.forEach((day) => {
        newSchedule[year][day] = [];
        TIME_SLOTS.forEach((time) => {
          if (Math.random() > 0.5) {
            newSchedule[year][day].push({
              time,
              subject: subjects[Math.floor(Math.random() * subjects.length)],
              class: `${year}-${Math.floor(Math.random() * 100)}`,
              room: rooms[Math.floor(Math.random() * rooms.length)],
              students: Math.floor(Math.random() * 50) + 20,
              type: Math.random() > 0.5 ? 'Lecture' : 'Practical', // Randomly assign type
            });
          }
        });
      });
    });

    Object.assign(SCHEDULE, newSchedule);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teaching Schedule"
        subtitle="View and manage your teaching timetable"
        icon={Calendar}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentDay}'s Classes</h2>
          <div className="space-y-4">
            {todaysSchedule.length > 0 ? (
              todaysSchedule.map((session, index) => (
                <Link
                  key={index}
                  to={`/schedule/${session.class}`}
                  className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  onClick={() => handleEditClick(session)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{session.time}</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      {session.year} - {session.class} - {session.type} {/* Display type */}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{session.subject}</h3>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {session.room}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {session.students} students
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No classes scheduled for today</div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors" onClick={generateRandomSchedule}>
              <PlusCircle className="w-5 h-5 mr-2 text-gray-600" />
              Generate Random Schedule
            </button>
            <button className="w-full flex items-center p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Edit className="w-5 h-5 mr-2 text-gray-600" />
              Request Schedule Change
            </button>
            <button className="w-full flex items-center p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <ClipboardList className="w-5 h-5 mr-2 text-gray-600" />
              View Student Attendance
            </button>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {[{ title: 'Department Meeting', date: new Date().toISOString().split('T')[0], time: '2:00 PM', location: 'Conference Room A' }].map((event, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time} - {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Year Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedYear === year
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Weekly Schedule Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{selectedYear} Weekly Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{time}</td>
                  {DAYS.map((day) => {
                    const session = SCHEDULE[selectedYear][day]?.find(s => s.time === time);
                    return (
                      <td key={day} className="px-6 py-4 whitespace-nowrap">
                        {session ? (
                          <div
                            className="p-2 bg-indigo-50 rounded-lg cursor-pointer"
                            onClick={() => handleEditClick(session)}
                          >
                            <div className="text-sm font-medium text-indigo-900">
                              {session.subject} - {session.type} {/* Display type */}
                            </div>
                            <div className="text-xs text-indigo-700">
                              {session.room}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">No class</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        session={selectedSession}
        onSave={handleSave}
      />
    </div>
  );
}