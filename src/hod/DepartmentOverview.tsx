import { useState } from 'react';
import { BuildingIcon, UsersIcon, BookOpenIcon, BarChartIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

interface DepartmentStats {
  facultyCount: number;
  courseCount: number;
  studentCount: number;
  upcomingEvents: number;
}

export function DepartmentOverview() {
  const [stats] = useState<DepartmentStats>({
    facultyCount: 24,
    courseCount: 15,
    studentCount: 320,
    upcomingEvents: 3
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Department Overview"
        subtitle="Key metrics and information about your department"
        icon={BuildingIcon}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center p-6 bg-blue-50">
          <UsersIcon className="w-8 h-8 mx-auto text-blue-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Faculty Members</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.facultyCount}</p>
        </Card>
        <Card className="text-center p-6 bg-green-50">
          <BookOpenIcon className="w-8 h-8 mx-auto text-green-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Courses Offered</h3>
          <p className="text-2xl font-bold text-green-600">{stats.courseCount}</p>
        </Card>
        <Card className="text-center p-6 bg-indigo-50">
          <UsersIcon className="w-8 h-8 mx-auto text-indigo-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Students Enrolled</h3>
          <p className="text-2xl font-bold text-indigo-600">{stats.studentCount}</p>
        </Card>
        <Card className="text-center p-6 bg-purple-50">
          <BarChartIcon className="w-8 h-8 mx-auto text-purple-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Upcoming Events</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.upcomingEvents}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-900">Department Meeting</h4>
              <p className="text-sm text-gray-600">Tomorrow at 10:00 AM in Conference Room A</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-900">Curriculum Review</h4>
              <p className="text-sm text-gray-600">Deadline for submissions is Friday</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-50 text-blue-600 p-4 rounded-lg hover:bg-blue-100 transition">
              <BookOpenIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">View Courses</span>
            </button>
            <button className="bg-green-50 text-green-600 p-4 rounded-lg hover:bg-green-100 transition">
              <UsersIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Manage Faculty</span>
            </button>
            <button className="bg-purple-50 text-purple-600 p-4 rounded-lg hover:bg-purple-100 transition">
              <BarChartIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">View Reports</span>
            </button>
            <button className="bg-indigo-50 text-indigo-600 p-4 rounded-lg hover:bg-indigo-100 transition">
              <BuildingIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Department Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
