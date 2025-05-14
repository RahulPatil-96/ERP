import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Users,
  Bell,
  TrendingUp,
  Brain,
  Target,
  Award,
  Zap,
  Activity,
  AlertCircle,
  CheckCircle,
  Clipboard,
  Server,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/common/Skeleton';

// Type definitions
interface StatCard {
  icon: any;
  label: string;
  value: string;
  trend: string;
  color: string;
  chartData?: number[];
  onClick?: () => void;
}

interface ActivityItem {
  id: number;
  title: string;
  timestamp: string;
  type: 'assignment' | 'notification' | 'meeting' | 'achievement' | 'alert';
  status?: 'read' | 'unread';
}

interface EventItem {
  id: number;
  title: string;
  time: string;
  location?: string;
  type: 'class' | 'deadline' | 'meeting' | 'event';
}

type Role = 'student' | 'faculty' | 'admin' | 'hod';

interface DashboardData {
  cards: StatCard[];
  activities: ActivityItem[];
  events: EventItem[];
  metrics?: Metric[];
}

interface Metric {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

const statsData: Record<Role, DashboardData> = {
  hod: {
    cards: [
      { icon: Users, label: 'Total Faculty', value: '10', trend: '+1', color: 'from-purple-800 to-purple-600', chartData: [9, 9, 10, 10, 10] },
      { icon: Users, label: 'Total Students', value: '320', trend: '+5', color: 'from-orange-800 to-orange-600', chartData: [315, 316, 318, 320, 320] },
      { icon: Calendar, label: 'Classes Today', value: '5', trend: '+1', color: 'from-pink-600 to-fuchsia-400', chartData: [4, 4, 5, 5, 5] },
      { icon: Bell, label: 'Notifications', value: '2', trend: '-1', color: 'from-indigo-800 to-blue-600', chartData: [2, 2, 2, 1, 1] },
      { icon: BookOpen, label: 'Active Courses', value: '15', trend: '+2', color: 'from-amber-600 to-yellow-500', chartData: [13, 14, 14, 15, 15] },
      { icon: Award, label: 'Department Rating', value: '4.8/5', trend: '+0.1', color: 'from-emerald-600 to-lime-500', chartData: [4.7, 4.7, 4.8, 4.8, 4.8] },
    ],
    activities: [
      { id: 1, title: 'New faculty member added', timestamp: '1 hour ago', type: 'notification' },
      { id: 2, title: 'Department meeting scheduled', timestamp: '2 hours ago', type: 'meeting' },
      { id: 3, title: 'New student enrollment', timestamp: '3 hours ago', type: 'notification' },
    ],
    events: [
      { id: 1, title: 'Department Review Meeting', time: 'Tomorrow at 10:00 AM', location: 'Conference Room', type: 'meeting' },
      { id: 2, title: 'Faculty Training Session', time: 'Next week at 2:00 PM', type: 'event' },
    ],
    metrics: [
      { label: 'Department Performance', value: '85%', change: '+5%', changeType: 'positive' },
      { label: 'Pending Approvals', value: '3', change: '-1', changeType: 'negative' },
    ]
  },
  student: {
    cards: [
      { icon: Calendar, label: 'Classes Today', value: '4', trend: '+1', color: 'from-purple-800 to-purple-600', chartData: [4, 5, 3, 4, 4] },
      { icon: Clipboard, label: 'Pending Assignments', value: '3', trend: '-2', color: 'from-orange-800 to-orange-600', chartData: [5, 4, 3, 2, 3] },
      { icon: Clock, label: 'Study Hours', value: '24h', trend: '+2h', color: 'from-pink-600 to-fuchsia-400', chartData: [22, 20, 24, 23, 24] },
      { icon: TrendingUp, label: 'Attendance', value: '92%', trend: '+5%', color: 'from-indigo-800 to-blue-600', chartData: [87, 89, 90, 92, 92] },
      { icon: Brain, label: 'AI Study Sessions', value: '12', trend: '+3', color: 'from-amber-600 to-yellow-500', chartData: [9, 10, 11, 12, 12] },
      { icon: Target, label: 'Goals Completed', value: '8/10', trend: '+2', color: 'from-emerald-600 to-lime-500', chartData: [6, 7, 7, 8, 8] },
    ],
    activities: [
      { id: 1, title: 'New assignment in Mathematics', timestamp: '2 hours ago', type: 'assignment', status: 'unread' },
      { id: 2, title: 'Completed 10-day study streak', timestamp: '4 hours ago', type: 'achievement' },
      { id: 3, title: 'Grade updated for History essay', timestamp: '1 day ago', type: 'notification' },
    ],
    events: [
      { id: 1, title: 'Mathematics Class', time: 'Tomorrow at 10:00 AM', location: 'Room 302', type: 'class' },
      { id: 2, title: 'Study Group Meeting', time: 'Tomorrow at 3:00 PM', location: 'Library', type: 'meeting' },
      { id: 3, title: 'Deadline: Physics Report', time: '2 days at 11:59 PM', type: 'deadline' },
    ],
    metrics: [
      { label: 'Course Progress', value: '68%', change: '+5%', changeType: 'positive' },
      { label: 'Peer Ranking', value: 'Top 20%', change: '+2%', changeType: 'positive' },
      { label: 'Resource Usage', value: '84%', change: '-3%', changeType: 'negative' },
    ]
  },
  faculty: {
    cards: [
      { icon: Users, label: 'Total Students', value: '120', trend: '+5', color: 'from-purple-800 to-purple-600', chartData: [115, 117, 118, 120, 120] },
      { icon: Calendar, label: 'Classes Today', value: '5', trend: '+1', color: 'from-orange-800 to-orange-600', chartData: [4, 4, 5, 5, 5] },
      { icon: FileText, label: 'Assignments to Grade', value: '15', trend: '-3', color: 'from-pink-600 to-fuchsia-400', chartData: [18, 17, 16, 15, 15] },
      { icon: Bell, label: 'Notifications', value: '3', trend: '+2', color: 'from-indigo-800 to-blue-600', chartData: [1, 2, 2, 3, 3] },
      { icon: Award, label: 'Average Class Score', value: '85%', trend: '+2%', color: 'from-amber-600 to-yellow-500', chartData: [83, 84, 84, 85, 85] },
      { icon: Activity, label: 'Class Engagement', value: '94%', trend: '+4%', color: 'from-emerald-600 to-lime-500', chartData: [90, 91, 92, 94, 94] },
    ],
    activities: [
      { id: 1, title: 'New student submission: John Doe', timestamp: '1 hour ago', type: 'assignment', status: 'unread' },
      { id: 2, title: 'Department meeting reminder', timestamp: '3 hours ago', type: 'meeting' },
      { id: 3, title: 'Curriculum update available', timestamp: '6 hours ago', type: 'alert' },
    ],
    events: [
      { id: 1, title: 'Department Meeting', time: 'Tomorrow at 11:00 AM', location: 'Conference Room A', type: 'meeting' },
      { id: 2, title: 'Guest Lecture Preparation', time: 'Tomorrow at 2:00 PM', type: 'event' },
      { id: 3, title: 'Exam Paper Review', time: '2 days at 9:00 AM', type: 'deadline' },
    ],
    metrics: [
      { label: 'Student Performance', value: 'A-', change: '+0.2', changeType: 'positive' },
      { label: 'Research Progress', value: '78%', change: '+8%', changeType: 'positive' },
      { label: 'Pending Approvals', value: '4', change: '-1', changeType: 'negative' },
    ]
  },
  admin: {
    cards: [
      { icon: Users, label: 'Total Users', value: '1,234', trend: '+12', color: 'from-purple-800 to-purple-600', chartData: [1200, 1215, 1228, 1234, 1234] },
      { icon: BookOpen, label: 'Active Courses', value: '45', trend: '+2', color: 'from-orange-800 to-orange-600', chartData: [43, 44, 44, 45, 45] },
      { icon: Calendar, label: 'Events This Month', value: '8', trend: '+1', color: 'from-pink-600 to-fuchsia-400', chartData: [7, 7, 8, 8, 8] },
      { icon: Server, label: 'System Usage', value: '95%', trend: '+3 %', color: 'from-indigo-800 to-blue-600', chartData: [92, 93, 94, 95, 95] },
      { icon: Zap, label: 'Server Load', value: '42%', trend: '-5%', color: 'from-amber-600 to-yellow-500', chartData: [47, 45, 43, 42, 42] },
      { icon: Activity, label: 'Daily Active Users', value: '892', trend: '+45', color: 'from-emerald-600 to-lime-500', chartData: [847, 860, 875, 892, 892] },
    ],
    activities: [
      { id: 1, title: 'New user registration: 5 today', timestamp: '1 hour ago', type: 'notification' },
      { id: 2, title: 'System maintenance scheduled', timestamp: '2 hours ago', type: 'alert' },
      { id: 3, title: 'Database backup completed', timestamp: '4 hours ago', type: 'notification' },
    ],
    events: [
      { id: 1, title: 'Board Meeting', time: 'Tomorrow at 9:00 AM', location: 'Executive Boardroom', type: 'meeting' },
      { id: 2, title: 'System Update Window', time: 'Tomorrow at 11:00 PM', type: 'event' },
      { id: 3, title: 'Quarterly Review Presentation', time: '3 days at 2:00 PM', type: 'event' },
    ],
    metrics: [
      { label: 'Uptime', value: '99.98%', change: '+0.02%', changeType: 'positive' },
      { label: 'API Latency', value: '142ms', change: '-18ms', changeType: 'negative' },
      { label: 'Storage Usage', value: '78%', change: '+3%', changeType: 'negative' },
    ]
  },
};

const StatCard = ({ icon: Icon, label, value, trend, color, chartData, onClick }: StatCard) => {
  const trendColor = trend.startsWith('+') ? 'text-green-400' : 'text-red-400';
  const chartColor = trend.startsWith('+') ? '#16a34a' : '#dc2626';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-25 transition-opacity duration-300 ${color}`} />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            <span className={`text-sm ${trendColor}`}>{trend}</span>
          </div>
          <div className="h-24 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData?.map((v) => ({ value: v }))}>
                <XAxis dataKey="value" hide />
                <YAxis hide />
                <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={false} />
                <Tooltip contentStyle={{ display: 'none' }} cursor={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} shadow-lg ml-4`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const ActivityItem = ({ title, timestamp, type, status }: ActivityItem) => {
  const iconMap = {
    assignment: <FileText className="w-5 h-5 text-indigo-600" />,
    notification: <Bell className="w-5 h-5 text-indigo-600" />,
    meeting: <Calendar className="w-5 h-5 text-indigo-600" />,
    achievement: <CheckCircle className="w-5 h-5 text-green-600" />,
    alert: <AlertCircle className="w-5 h-5 text-red-600" />,
  };

  return (
    <div className={`flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group ${status === 'unread' ? 'font-bold' : ''}`}>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform">
        {iconMap[type]}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
};

const EventItem = ({ title, time, location }: EventItem) => (
  <div className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform">
      <Calendar className="w-5 h-5 text-indigo-600" />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{time} {location && `- ${location}`}</p>
    </div>
  </div>
);

export function Dashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [currentStats, setCurrentStats] = useState<DashboardData>(statsData['student']);

  useEffect(() => {
    setCurrentStats(statsData[(user?.currentRole as Role) || 'student']);
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">Here's what's happening today.</p>
        </div>
        {/* <div className="flex items-center">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="ml-2 text-sm text-gray-600">3</span>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))
        ) : (
          currentStats.cards.map((stat, index) => (
            <StatCard key={index} {...stat} onClick={() => console.log(`${stat.label} clicked`)} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-indigo-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))
            ) : (
              currentStats.activities.map(activity => (
                <ActivityItem key={activity.id} {...activity} />
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))
            ) : (
              currentStats.events.map(event => (
                <EventItem key={event.id} {...event} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Metrics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentStats.metrics?.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              <p className={`text-xl font-semibold ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.value} <span className="text-sm">{metric.change}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}