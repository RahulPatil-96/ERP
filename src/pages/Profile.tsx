import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  User,
  BookOpen,
  GraduationCap,
  Briefcase,
  Clock,
  Award,
  Shield,
  Users,
  Building,
  Laptop,
} from 'lucide-react';
import { Skeleton } from '../components/common/Skeleton';

type Role = 'student' | 'faculty' | 'admin' | 'hod';

interface ProfileData {
  tabs: string[];
  overview: {
    icon: any;
    label: string;
    value: string;
  }[];
  metrics?: {
    label: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
  }[];
  specificContent: Record<string, any>;
}

// SVG-based university logo
const universityLogo = "data:image/svg+xml,%3Csvg width='200' height='60' viewBox='0 0 200 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='60' fill='%230F4C81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3EUniversity%20Logo%3C/text%3E%3C/svg%3E";

const profileData: Record<Role, ProfileData> = {
  student: {
    tabs: ['Overview', 'Virtual i-Card', 'Academics', 'Attendance', 'Finances', 'Settings'],
    overview: [
      { icon: User, label: 'Student ID', value: 'S-2354-2023' },
      { icon: BookOpen, label: 'Major', value: 'Computer Science' },
      { icon: GraduationCap, label: 'Class Year', value: '2025' },
      { icon: Clock, label: 'Credits Completed', value: '45/120' },
    ],
    metrics: [
      { label: 'GPA Trend', value: '+0.3', change: '3.8', changeType: 'positive' },
      { label: 'Attendance', value: '92%', change: '+5%', changeType: 'positive' },
      { label: 'Library Usage', value: '64%', change: '-3%', changeType: 'negative' },
    ],
    specificContent: {
      Academics: {
        courses: ['Data Structures', 'Machine Learning', 'Discrete Mathematics'],
        gpa: 3.8,
        academicStatus: 'In Good Standing',
        advisor: 'Dr. Sarah Johnson',
      },
      Attendance: {
        totalClasses: 120,
        attendedClasses: 110,
        recentAbsences: ['2023-11-05: Calculus', '2023-11-12: Physics'],
      },
      Finances: {
        balance: 2450.0,
        recentPayments: 500.0,
        paymentPlan: 'Monthly Installments',
      },
      'Virtual i-Card': {
        id: 'S-2354-2023',
        name: 'John Doe',
        major: 'Computer Science',
        classYear: '2025',
        advisor: 'Dr. Sarah Johnson',
        campus: 'Main Campus',
        validUntil: '2025-06-30',
        image: 'https://via.placeholder.com/150x150?text=Student+Photo',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?data=S-2354-2023&size=150x150',
        universityLogo: universityLogo,
        contact: {
          email: 'john.doe@university.edu',
          address: '123 University Ave, City, State, ZIP',
        },
      },
    },
  },
  faculty: {
    tabs: ['Overview', 'Virtual i-Card', 'Teaching', 'Research', 'Office Hours', 'Settings'],
    overview: [
      { icon: Briefcase, label: 'Department', value: 'Computer Science' },
      { icon: Award, label: 'Courses Taught', value: '4' },
      { icon: Users, label: 'Students Advised', value: '23' },
      { icon: Clock, label: 'Years Service', value: '8' },
    ],
    metrics: [
      { label: 'Student Ratings', value: '4.7/5', change: '+0.2', changeType: 'positive' },
      { label: 'Research Funding', value: '$245K', change: '+15%', changeType: 'positive' },
      { label: 'Pending Grading', value: '23', change: '-5', changeType: 'negative' },
    ],
    specificContent: {
      Teaching: {
        currentCourses: ['Advanced Algorithms', 'Machine Learning Fundamentals'],
        officeLocation: 'CS Building 302',
        officeHours: 'Mon/Wed 2-4 PM',
      },
      Research: {
        activeProjects: 3,
        publicationsThisYear: 2,
        researchBudget: '$150,000',
      },
      'Office Hours': {
        upcomingSlots: ['Nov 15: 2-4 PM', 'Nov 17: 10-12 PM'],
        scheduledAppointments: 5,
      },
      'Virtual i-Card': {
        id: 'F-1234-2023',
        name: 'Dr. Jane Smith',
        department: 'Computer Science',
        position: 'Associate Professor',
        office: 'CSB 302',
        image: 'https://via.placeholder.com/150x150?text=Faculty+Photo',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?data=F-1234-2023&size=150x150',
        universityLogo: universityLogo,
        contact: {
          email: 'jane.smith@university.edu',
          address: '456 University Rd, City, State, ZIP',
        },
      },
    },
  },
  admin: {
    tabs: ['Overview', 'Virtual i-Card', 'Institution', 'System', 'Reports', 'Settings'],
    overview: [
      { icon: Building, label: 'Departments', value: '12' },
      { icon: Users, label: 'Active Users', value: '2,345' },
      { icon: Laptop, label: 'System Health', value: '98.7%' },
      { icon: Shield, label: 'Security Level', value: 'High' },
    ],
    metrics: [
      { label: 'Uptime', value: '99.98%', change: '+0.02%', changeType: 'positive' },
      { label: 'Storage', value: '78%', change: '+3%', changeType: 'negative' },
      { label: 'Active Sessions', value: '423', change: '-12', changeType: 'negative' },
    ],
    specificContent: {
      Institution: {
        totalStudents: 5432,
        facultyCount: 234,
        annualBudget: '$45.2M',
      },
      System: {
        serverLoad: '42%',
        lastBackup: '2023-11-12 02:00',
        securityIncidents: 0,
      },
      Reports: {
        generatedThisMonth: 45,
        scheduledReports: 3,
      },
      'Virtual i-Card': {
        id: 'A-5678-2023',
        name: 'Admin User',
        role: 'System Administrator',
        department: 'IT Services',
        image: 'https://via.placeholder.com/150x150?text=Admin+Photo',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?data=A-5678-2023&size=150x150',
        universityLogo: universityLogo,
        contact: {
          email: 'admin@university.edu',
          address: '789 University Blvd, City, State, ZIP',
        },
      },
    },
  },
  hod: {
    tabs: ['Overview', 'Virtual i-Card', 'Department', 'Faculty', 'Courses', 'Settings'],
    overview: [
      { icon: Building, label: 'Department', value: 'Computer Science' },
      { icon: Users, label: 'Faculty Members', value: '24' },
      { icon: GraduationCap, label: 'Students', value: '1,245' },
      { icon: BookOpen, label: 'Courses', value: '42' },
    ],
    metrics: [
      { label: 'Attendance', value: '89%', change: '+2%', changeType: 'positive' },
      { label: 'Pass Rate', value: '92%', change: '+1%', changeType: 'positive' },
      { label: 'Pending Approvals', value: '5', change: '-2', changeType: 'negative' },
    ],
    specificContent: {
      Department: {
        head: 'Dr. Alice Johnson',
        established: '1995',
        location: 'Science Building, Floor 3',
        contact: 'cs-department@university.edu',
      },
      Faculty: {
        total: 24,
        professors: 8,
        associateProfessors: 10,
        assistantProfessors: 6,
      },
      Courses: {
        undergraduate: 32,
        postgraduate: 10,
        upcomingCourses: ['AI Fundamentals', 'Cloud Computing'],
      },
      'Virtual i-Card': {
        id: 'H-9012-2023',
        name: 'Dr. Alice Johnson',
        department: 'Computer Science',
        position: 'Head of Department',
        office: 'SB 301',
        image: 'https://via.placeholder.com/150x150?text=HOD+Photo',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?data=H-9012-2023&size=150x150',
        universityLogo: universityLogo,
        contact: {
          email: 'alice.johnson@university.edu',
          address: 'Science Building 301, University Campus',
        },
      },
    },
  }
};

export function ProfilePage() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
const currentData = profileData[(user?.currentRole as Role) || 'student'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 bg-gray-200" />
      ));
    }

    switch (selectedTab) {
      case 'Overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentData.overview.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {currentData.metrics?.map((metric, index) => (
              <motion.div
                key={`metric-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.change}</p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'Virtual i-Card':
        const iCardContent = currentData.specificContent['Virtual i-Card'];
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm"
          >
            <div className="max-w-md mx-auto bg-white dark:bg-dark-800 rounded-lg overflow-hidden shadow-lg">
              <div className="bg-indigo-600 p-4">
                <div className="flex justify-between items-center mb-4">
                  <img 
                    src={iCardContent.universityLogo} 
                    alt="University Logo" 
                    className="h-12 w-12 rounded"
                  />
                  <span className="text-white font-bold text-lg">University ID Card</span>
                </div>
                <div className="flex items-center space-x-4">
                  <img 
                    src={iCardContent.image} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{iCardContent.name}</h2>
                    <p className="text-sm">{iCardContent.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {iCardContent.major && <DetailItem label="Major" value={iCardContent.major} />}
                  {iCardContent.department && <DetailItem label="Department" value={iCardContent.department} />}
                  {iCardContent.classYear && <DetailItem label="Class Year" value={iCardContent.classYear} />}
                  {iCardContent.position && <DetailItem label="Position" value={iCardContent.position} />}
                  {iCardContent.advisor && <DetailItem label="Advisor" value={iCardContent.advisor} />}
                  {iCardContent.campus && <DetailItem label="Campus" value={iCardContent.campus} />}
                  <DetailItem label="Email" value={iCardContent.contact.email} />
                  <DetailItem label="Address" value={iCardContent.contact.address} />
                </div>
                
                <div className="flex flex-col items-center justify-center border-l pl-4">
                  <img 
                    src={iCardContent.qrCode} 
                    alt="QR Code" 
                    className="w-32 h-32 mb-2"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    Valid Until: {iCardContent.validUntil || '2025-06-30'}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-dark-700 p-2 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Contact: {iCardContent.contact.email} • {iCardContent.contact.address}
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        const content = currentData.specificContent[selectedTab];
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {Object.entries(content).map(([key, value], index) => (
              <div key={index} className="p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{key}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Array.isArray(value) ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {value.map((item, i) => (
                        <li key={i} className="text-base text-gray-700 dark:text-gray-300">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    value as React.ReactNode
                  )}
                </p>
              </div>
            ))}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h1>
<p className="text-gray-600 dark:text-gray-400 capitalize">{user?.currentRole}</p>
            </div>
          </div>
        </div>
      </motion.header>

      <nav className="sticky top-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-4 py-4 overflow-x-auto">
            {currentData.tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                  selectedTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    <span className="text-sm text-gray-900 dark:text-white">{value}</span>
  </div>
);
