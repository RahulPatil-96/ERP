import { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { BarChart } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const sampleData = [
  { id: 1, name: 'John Doe', course: 'CS 101', grade: 'A' },
  { id: 2, name: 'Jane Smith', course: 'CS 101', grade: 'B+' },
  { id: 3, name: 'Alice Brown', course: 'Math 101', grade: 'A-' },
  { id: 4, name: 'Bob White', course: 'Math 101', grade: 'C+' },
  { id: 5, name: 'Charlie Black', course: 'CS 101', grade: 'B' },
  { id: 6, name: 'David Green', course: 'CS 101', grade: 'A' },
  { id: 7, name: 'Eva Blue', course: 'Math 101', grade: 'B+' },
  { id: 8, name: 'Frank Gray', course: 'Math 101', grade: 'C' },
  { id: 9, name: 'Grace Yellow', course: 'Physics 101', grade: 'A' },
  { id: 10, name: 'Hannah Orange', course: 'Physics 101', grade: 'B+' },
];

export function Analytics() {
  const [students] = useState(sampleData);

  // Data preparation for charts
  const gradeCounts = {
    A: students.filter((student) => student.grade === 'A').length,
    'A-': students.filter((student) => student.grade === 'A-').length,
    B: students.filter((student) => student.grade === 'B').length,
    'B+': students.filter((student) => student.grade === 'B+').length,
    C: students.filter((student) => student.grade === 'C').length,
    'C+': students.filter((student) => student.grade === 'C+').length,
  };

  const courses = [...new Set(students.map((student) => student.course))];

  const courseCounts = courses.map((course) => ({
    course,
    count: students.filter((student) => student.course === course).length,
  }));

  // Analytics for course enrollment
  const courseEnrollmentData = {
    labels: courseCounts.map((course) => course.course),
    datasets: [
      {
        label: 'Number of Students Enrolled',
        data: courseCounts.map((course) => course.count),
        backgroundColor: ['#4F79A7', '#F57C42', '#2D89A1'],
      },
    ],
  };

  // Analytics for grade distribution
  const gradeDistributionData = {
    labels: ['A', 'A-', 'B', 'B+', 'C', 'C+'],
    datasets: [
      {
        label: 'Grade Distribution',
        data: Object.values(gradeCounts),
        backgroundColor: ['#4F79A7', '#7B9BB1', '#F57C42', '#9C9D56', '#D75D55', '#F0A8A7'],
      },
    ],
  };

  // Analytics for average grade (for simplicity, using the numeric value of grades)
  const gradeValues = {
    A: 4,
    'A-': 3.7,
    B: 3,
    'B+': 3.3,
    C: 2,
    'C+': 2.3,
  };

  const averageGradeData = {
    labels: ['CS 101', 'Math 101', 'Physics 101'],
    datasets: [
      {
        label: 'Average Grade by Course',
        data: [
          students.filter((student) => student.course === 'CS 101').reduce((acc, student) => acc + gradeValues[student.grade as keyof typeof gradeValues], 0) / students.filter((student) => student.course === 'CS 101').length,
          students.filter((student) => student.course === 'Math 101').reduce((acc, student) => acc + gradeValues[student.grade as keyof typeof gradeValues], 0) / students.filter((student) => student.course === 'Math 101').length,
          students.filter((student) => student.course === 'Physics 101').reduce((acc, student) => acc + gradeValues[student.grade as keyof typeof gradeValues], 0) / students.filter((student) => student.course === 'Physics 101').length,
        ],
        fill: false,
        borderColor: '#4F79A7',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Faculty Analytics Dashboard"
        subtitle="Analyze student performance and course statistics"
        icon={BarChart}
      />
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-xl p-8">
        {/* Analytics Section 1: Course Enrollment */}
        <div className="mb-10 h-96">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Enrollment</h2>
          <div className="w-full h-full">
            <Pie data={courseEnrollmentData} />
          </div>
        </div>

        {/* Analytics Section 2: Grade Distribution */}
        <div className="mb-10 h-96">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          <div className="w-full h-full">
            <Bar data={gradeDistributionData} />
          </div>
        </div>

        {/* Analytics Section 3: Average Grade by Course */}
        <div className="mb-10 h-96">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Grade by Course</h2>
          <div className="w-full h-full">
            <Line data={averageGradeData} />
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Total Number of Students</span>
              <span className="text-lg font-semibold text-gray-900">{students.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Average Grade</span>
              <span className="text-lg font-semibold text-gray-900">
                {(
                  students.reduce((acc, student) => acc + gradeValues[student.grade as keyof typeof gradeValues], 0) / students.length
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
