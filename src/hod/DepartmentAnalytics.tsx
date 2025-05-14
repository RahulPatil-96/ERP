import { BarChartIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

export function DepartmentAnalytics() {
  // Placeholder data - in a real app this would come from an API
  const enrollmentData = [
    { year: '2020', students: 250 },
    { year: '2021', students: 280 },
    { year: '2022', students: 300 },
    { year: '2023', students: 320 },
  ];

  const courseRatings = [
    { course: 'CS101', rating: 4.5 },
    { course: 'MK401', rating: 4.2 },
    { course: 'EE201', rating: 4.7 },
    { course: 'PH301', rating: 4.1 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Department Analytics"
        subtitle="Performance metrics and insights for your department"
        icon={BarChartIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Enrollment Trend</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* Placeholder for chart - would be replaced with actual chart component */}
            <div className="flex items-end h-48 space-x-2">
              {enrollmentData.map((data) => (
                <div key={data.year} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${(data.students / 400) * 100}%` }}
                  />
                  <span className="text-xs mt-2">{data.year}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Ratings</h3>
          <div className="space-y-3">
            {courseRatings.map((course) => (
              <div key={course.course} className="flex items-center">
                <div className="w-32">{course.course}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${(course.rating / 5) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right text-sm font-medium">
                  {course.rating.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Average Course Rating</h4>
            <p className="text-2xl font-bold text-blue-600">4.3</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">Student Retention</h4>
            <p className="text-2xl font-bold text-green-600">92%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800">Faculty Satisfaction</h4>
            <p className="text-2xl font-bold text-purple-600">88%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
