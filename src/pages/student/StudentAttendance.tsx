import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { User, X, Download } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface AttendanceRecord {
  date: string;
  attendedClasses: boolean;
}

interface SubjectAttendance {
  name: string;
  totalClasses: number;
  facultyName: string;
  attendanceRecords: AttendanceRecord[];
}

const StudentAttendance = () => {
  const generateMockData = (subjectCount: number, days: number) => {
    const subjects: SubjectAttendance[] = [];
    const startDate = new Date(2025, 1, 15);

    for (let i = 0; i < subjectCount; i++) {
      const records: AttendanceRecord[] = [];
      for (let d = 0; d < days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        // Skip Sundays
        if (date.getDay() !== 0) {
          records.push({
            date: date.toISOString().split('T')[0],
            attendedClasses: Math.random() > 0.2,
          });
        }
      }

      subjects.push({
        name: `Subject ${i + 1}`,
        totalClasses: records.length,
        facultyName: `Prof. ${['A', 'B', 'C', 'D'][i % 4]} Smith`,
        attendanceRecords: records,
      });
    }
    return subjects;
  };

  const [attendanceData] = useState<SubjectAttendance[]>(() =>
    generateMockData(6, 60)
  );

  const [selectedSubject, setSelectedSubject] = useState<SubjectAttendance | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const overallAttendance = useMemo(() => {
    const totalClasses = attendanceData.reduce((sum, subj) => sum + subj.totalClasses, 0);
    const attendedClasses = attendanceData.reduce(
      (sum, subj) =>
        sum + subj.attendanceRecords.filter((r) => r.attendedClasses).length,
      0
    );
    return ((attendedClasses / totalClasses) * 100).toFixed(1);
  }, [attendanceData]);

  const calculateAttendancePercentage = (subject: SubjectAttendance) => {
    const attended = subject.attendanceRecords.filter((r) => r.attendedClasses)
      .length;
    return ((attended / subject.totalClasses) * 100).toFixed(1);
  };

  const generateAttendanceGraphData = (subject: SubjectAttendance) => {
    const monthlyData = Array(12)
      .fill(0)
      .map((_, month) => {
        const monthlyRecords = subject.attendanceRecords.filter((record) => {
          const date = new Date(record.date);
          return date.getMonth() === month;
        });
        return (
          (monthlyRecords.filter((r) => r.attendedClasses).length /
            monthlyRecords.length) *
            100 || 0
        );
      });

    return {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: 'Monthly Attendance (%)',
          data: monthlyData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const generateCalendarData = (subject: SubjectAttendance) => {
    const month = new Date(subject.attendanceRecords[0].date).getMonth();
    const year = new Date(subject.attendanceRecords[0].date).getFullYear();
    const firstDay = new Date(year, month, 1);
    const startOfWeek = new Date(firstDay);
    startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());

    const calendarData = [];
    for (let d = 0; d < 42; d++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + d);
      const record = subject.attendanceRecords.find(
        (r) => r.date === currentDate.toISOString().split('T')[0]
      );
      const isSunday = currentDate.getDay() === 0; // Check if Sunday

      calendarData.push({
        date: currentDate.toISOString().split('T')[0],
        status: isSunday
          ? 'holiday'
          : record
          ? record.attendedClasses
            ? 'present'
            : 'absent'
          : 'no class',
      });
    }
    return calendarData;
  };

  return (
    <div className="space-y-8">
      <PageHeader
          title="Attendance Portal"
          subtitle="View your attendance records and details for each subject"
          icon={User}
        />

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="p-6 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-semibold">Overall Attendance</h3>
          </div>
          <p className="text-gray-700 text-2xl font-bold">{overallAttendance}%</p>
        </div>

        <div className="p-6 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-semibold">View Mode</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      <main className="p-6">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendanceData.map((subject, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSubject(subject)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{subject.name}</h3>
                  <span className="text-sm text-gray-600">{subject.facultyName}</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-32 h-32">
                    <CircularProgressbar
                      value={parseFloat(calculateAttendancePercentage(subject))}
                      text={`${calculateAttendancePercentage(subject)}%`}
                      styles={{
                        path: {
                          stroke: parseFloat(calculateAttendancePercentage(subject)) >= 75 ? 
                            '#10B981' : '#EF4444',
                          strokeLinecap: 'butt',
                        },
                        trail: { stroke: '#E5E7EB' },
                        text: { 
                          fill: '#1F2937',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-green-700 font-bold">
                      {subject.attendanceRecords.filter((r) => r.attendedClasses).length}
                    </p>
                    <p className="text-sm text-green-600">Present</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <p className="text-red-700 font-bold">
                      {subject.attendanceRecords.length - subject.attendanceRecords.filter((r) => r.attendedClasses).length}
                    </p>
                    <p className="text-sm text-red-600">Absent</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Subject</th>
                  <th className="px-6 py-3 text-left">Faculty</th>
                  <th className="px-6 py-3 text-center">Attendance %</th>
                  <th className="px-6 py-3 text-center">Present</th>
                  <th className="px-6 py-3 text-center">Absent</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((subject, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <td className="px-6 py-4">{subject.name}</td>
                    <td className="px-6 py-4">{subject.facultyName}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          parseFloat(calculateAttendancePercentage(subject)) >= 75
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {calculateAttendancePercentage(subject)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-green-700">
                      {subject.attendanceRecords.filter((r) => r.attendedClasses).length}
                    </td>
                    <td className="px-6 py-4 text-center text-red-700">
                      {subject.attendanceRecords.length - subject.attendanceRecords.filter((r) => r.attendedClasses).length}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800" aria-label="Download Attendance">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <button
                className="sticky top-0 ml-auto block mb-2 text-gray-600 hover:text-gray-800"
                onClick={() => setSelectedSubject(null)}
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-semibold mb-4">{selectedSubject.name} - Details</h2>

              <div className="space-y-4">
                <div>
                  <p><strong>Faculty:</strong> {selectedSubject.facultyName}</p>
                  <p><strong>Total Classes:</strong> {selectedSubject.totalClasses}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Attendance Dates:</h3>
                    <ul className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                      {selectedSubject.attendanceRecords.map((record, index) => (
                        <li key={index} className="py-1">
                          {record.date} -{' '}
                          <span
                            className={`font-semibold ${
                              record.attendedClasses ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {record.attendedClasses ? 'Present' : 'Absent'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Monthly Attendance Graph</h3>
                    <div className="h-48">
                      <Bar
                        data={generateAttendanceGraphData(selectedSubject)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Calendar View</h3>
                  <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="font-medium text-center p-1 bg-gray-200 rounded">
                        {day}
                      </div>
                    ))}
                    {generateCalendarData(selectedSubject).map((record, index) => (
                      <div
                        key={index}
                        className={`p-1 text-center rounded ${
                          record.status === 'present'
                            ? 'bg-green-100'
                            : record.status === 'absent'
                            ? 'bg-red-100'
                            : record.status === 'holiday'
                            ? 'bg-gray-300'
                            : 'bg-gray-50'
                        }`}
                      >
                        {new Date(record.date).getDate()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentAttendance;
