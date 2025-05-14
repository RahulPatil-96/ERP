import { useState } from 'react';
import { User as UserIcon } from 'lucide-react'; // Replacing Organization with Building icon
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { PageHeader } from '../../components/common/PageHeader';

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

// Define interface for user data and organization info
interface User {
  id: number;
  name: string;
  email: string;
  status: string; // Active or Inactive
  organization: {
    name: string;
    type: string; // e.g., "Non-profit", "Government", "Private"
  };
  lastLogin: string;
}

export function AdminAnalytics() {
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      organization: { name: 'Tech Solutions Corp', type: 'Private' },
      lastLogin: '2025-02-28 10:00',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
      organization: { name: 'Global Education Foundation', type: 'Non-profit' },
      lastLogin: '2025-02-27 15:00',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'mike@example.com',
      status: 'Active',
      organization: { name: 'Health First Initiative', type: 'Government' },
      lastLogin: '2025-02-26 09:30',
    },
  ]);

  // Calculate metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === 'Active').length;
  const inactiveUsers = totalUsers - activeUsers;

  // Prepare data for Bar chart (User Status)
  const userStatusData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        label: 'User Status',
        data: [activeUsers, inactiveUsers],
        backgroundColor: ['#4CAF50', '#FF6347'],
        borderColor: ['#4CAF50', '#FF6347'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Pie chart (Organization Types)
  const organizationData = {
    labels: ['Private', 'Non-profit', 'Government'],
    datasets: [
      {
        label: 'Organization Types',
        data: [
          users.filter((user) => user.organization.type === 'Private').length,
          users.filter((user) => user.organization.type === 'Non-profit').length,
          users.filter((user) => user.organization.type === 'Government').length,
        ],
        backgroundColor: ['#FFEB3B', '#2196F3', '#FF5722'],
        borderColor: ['#FFEB3B', '#2196F3', '#FF5722'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for User Activity Chart (Bar Chart of Login Activity)
  const userActivityData = {
    labels: users.map((user) => user.name), // Use user names as labels
    datasets: [
      {
        label: 'Last Login (in days)',
        data: users.map((user) => {
          // Calculate the difference in days between the last login date and today
          const lastLoginDate = new Date(user.lastLogin);
          const currentDate = new Date();
          const diffTime = Math.abs(currentDate.getTime() - lastLoginDate.getTime());
          return Math.ceil(diffTime / (1000 * 3600 * 24)); // Convert time difference to days
        }),
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Analytics Dashboard"
        subtitle="View detailed analytics and insights about user activity"
        icon={UserIcon}
      />
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-4xl">{totalUsers}</p>
            <div className="mt-4 flex items-center">
              <UserIcon className="w-6 h-6 mr-2" />
              <span className="text-sm">Total number of users in the system</span>
            </div>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Active Users</h3>
            <p className="text-4xl">{activeUsers}</p>
            <div className="mt-4 flex items-center">
              <UserIcon className="w-6 h-6 mr-2" />
              <span className="text-sm">Users who are currently active</span>
            </div>
          </div>

          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Inactive Users</h3>
            <p className="text-4xl">{inactiveUsers}</p>
            <div className="mt-4 flex items-center">
              <UserIcon className="w-6 h-6 mr-2" />
              <span className="text-sm">Users who are not active</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900">Recent User Activity</h3>
          <div className="space-y-4 mt-4">
            {users.map((user) => (
              <div key={user.id} className="p-4 bg-white shadow-md rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">Last Login: {user.lastLogin}</p>
                  <p className="text-sm text-gray-600">Status: {user.status}</p>
                  <p className="text-sm text-gray-600">Organization: {user.organization.name}</p>
                </div>
                <div className="text-gray-600 text-sm">{user.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900">User Status Distribution</h3>
            <div className="mt-4">
              <Bar data={userStatusData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
            </div>
          </div>

          {/* Organization Type Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900">Organization Type Distribution</h3>
            <div className="mt-4">
              <Pie data={organizationData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
            </div>
          </div>
        </div>

        {/* User Activity Chart (below the other two) */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-900">User Activity Chart</h3>
          <div className="mt-4">
            <Bar data={userActivityData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
          </div>
        </div>
      </div>
    </div>
  );
}
