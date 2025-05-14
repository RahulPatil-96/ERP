import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  Settings,
  Users,
  FileText,
  Bell,
  DollarSign,
  Brain,
  Microscope,
  Target,
  BarChart2,
  MessageSquare,
  Award,
  BookMarked,
  Building2,
  Laptop2,
  Rocket,
  CheckCircle,
  List,
  Clipboard,
  FilePlus,
  ClipboardList,
  CalendarPlus,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

type MenuItem = {
  icon: React.ComponentType<any>;
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

export function Sidebar({ isExpanded, setIsExpanded }: { isExpanded: boolean; setIsExpanded: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { user } = useAuthStore();

  // State to track which submenu keys are expanded
  const [expandedSubmenus, setExpandedSubmenus] = useState<string[]>([]);

  // Menu items with optional nested children for submenu support
  const menuItems: Record<string, MenuItem[]> = {
    student: [
      { icon: Home, label: 'Dashboard', to: '/dashboard' },
      { icon: Calendar, label: 'Schedule', to: '/schedule' },
      { icon: List, label: 'Attendance', to: '/studentattendance' },
      { icon: FilePlus, label: 'Resource Sharing', to: '/resourcesharing' },
      { icon: FileText, label: 'Assignments', to: '/assignments' },
      { icon: Clipboard, label: 'Examination', to: '/examination' },
      { icon: Bell, label: 'Announcements', to: '/studentannouncements' },
      { icon: DollarSign, label: 'Fees', to: '/fees' },
      { icon: FileText, label: 'Feedback', to: '/feedback' },
      { icon: Target, label: 'Goals', to: '/goals' },
      { icon: BarChart2, label: 'Progress', to: '/progress' },
      { icon: MessageSquare, label: 'Discussion', to: '/discussion' },
      { icon: BookOpen, label: 'Library', to: '/library' },
      { icon: Brain, label: 'AI Tutor', to: '/ai-tutor' },
      { icon: Microscope, label: 'Virtual Labs', to: '/virtual-labs' },
    ],
    faculty: [
      { icon: Home, label: 'Dashboard', to: '/dashboard' },
      { icon: CheckCircle, label: 'Attendance', to: '/attendance' },
      { icon: Users, label: 'Students', to: '/students' },
      { icon: Calendar, label: 'Schedule', to: '/facultyschedule' },
      { icon: FileText, label: 'Assignments', to: '/facultyassignments' },
      { icon: Award, label: 'Grading', to: '/grading' },
      { icon: BookMarked, label: 'Course Content', to: '/course-content' },
      { icon: MessageSquare, label: 'Communication', to: '/communication' },
      { icon: BarChart2, label: 'Analytics', to: '/analytics' },
      { icon: Bell, label: 'Announcements', to: '/announcements' },
      { icon: Brain, label: 'AI Assistant', to: '/ai-assistant' },
    ],
    admin: [
      { icon: Home, label: 'Dashboard', to: '/dashboard' },
      { icon: Users, label: 'Users', to: '/users' },
      { icon: GraduationCap, label: 'Departments', to: '/departments' },
      { icon: Calendar, label: 'Manage College', to: '/managecolleges' },
      { icon: BookOpen, label: 'Courses', to: '/courses' },
      { icon: Building2, label: 'Infrastructure', to: '/infrastructure' },
      { icon: Laptop2, label: 'Resources', to: '/resources' },
      { icon: BarChart2, label: 'Analytics', to: '/adminanalytics' },
      { icon: Rocket, label: 'Strategic Planning', to: '/planning' },
      { icon: Settings, label: 'Settings', to: '/settings' },
    ],
    hod: [
      { icon: Home, label: 'Dashboard', to: '/dashboard' },
      { icon: ClipboardList, label: 'Overview', to: '/hod/overview' },
      { icon: Users, label: 'Faculty', to: '/hod/faculty' },
      { icon: Users, label: 'Students', to: '/hod/students' },
      { icon: BookOpen, label: 'Courses', to: '/hod/courses' },
      { icon: BarChart2, label: 'Analytics', to: '/hod/analytics' },
      { icon: Calendar, label: 'Schedule Management', to: '/hod/schedule' },
      { icon: Settings, label: 'Settings', to: '/hod/settings' },
      { icon: Calendar, label: 'Leave Management', to: '/hod/leave' },
      { icon: Award, label: 'Accreditation', to: '/hod/accreditation' },
      { icon: Bell, label: 'Announcements', to: '/hod/announcements' },
      { icon: CalendarPlus, label: 'Events Management', to: '/hod/events' },
      { icon: MessageSquare, label: 'Feedback', to: '/hod/feedback' },
      { icon: ClipboardCheck, label: 'Internal Assessment', to: '/hod/internalassessment' },
      { icon: Laptop2, label: 'Resources', to: '/hod/resources' },
    ],
  };

  const [currentMenuItems, setCurrentMenuItems] = useState<MenuItem[]>(menuItems['student']);

  useEffect(() => {
    setCurrentMenuItems(menuItems[(user?.currentRole as keyof typeof menuItems) || 'student']);
  }, [user]);

  // Toggle submenu expansion for a given label
  const toggleSubmenu = (label: string) => {
    if (expandedSubmenus.includes(label)) {
      setExpandedSubmenus(expandedSubmenus.filter((l) => l !== label));
    } else {
      setExpandedSubmenus([...expandedSubmenus, label]);
    }
  };

  // Effect to toggle all submenus based on sidebar collapse state
  useEffect(() => {
    if (!isExpanded) {
      // Sidebar collapsed: expand all submenus
      const allSubmenuLabels = currentMenuItems
        .filter((item) => item.children)
        .map((item) => item.label);
      setExpandedSubmenus(allSubmenuLabels);
    } else {
      // Sidebar expanded: collapse all submenus
      setExpandedSubmenus([]);
    }
  }, [isExpanded, currentMenuItems]);

  // Debug function to log navigation clicks
  const handleNavLinkClick = (label: string, to: string) => {
    console.log(`Sidebar link clicked: ${label} -> ${to}`);
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen flex flex-col bg-white dark:bg-dark-800 text-black dark:text-gray-200 transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-20'
        } z-[999]`}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-4 right-0 bg-indigo-600 rounded-full p-1 hover:bg-indigo-700 transition-colors z-[998] shadow-lg shadow-indigo-600/30"
          style={{
            transform: 'translateX(50%)', // Position button just outside sidebar right edge
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)', // Match sidebar transition
          }}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <div className="w-5 h-5 flex items-center justify-center text-white select-none cursor-pointer">
            {isExpanded ? '←' : '→'}
          </div>
        </button>

        {/* Logo Section */}
        <div className={`flex-shrink-0 flex items-center justify-center ${isExpanded ? 'p-4' : 'p-2'}`}>
          <GraduationCap className="w-8 h-8 text-indigo-400" />
          {isExpanded && <span className="ml-2 text-xl font-bold text-black">EduERP</span>}
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-grow overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <nav className="space-y-2">
            {currentMenuItems.map((item: MenuItem) => (
              <div key={item.label}>
                {item.children ? (
                  <div
                    className={`flex items-center py-3 text-sm rounded-xl transition-all duration-200 ${
                      isExpanded ? 'px-4' : 'px-2'
                    } ${!isExpanded && 'justify-center'} ${
                      expandedSubmenus.includes(item.label)
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                        : 'text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <NavLink
                      to={item.to}
                      end
                      className={`flex items-center flex-1 ${
                        isExpanded ? 'mr-3' : 'mr-0'
                      } text-black dark:text-gray-300`}
                      onClick={() => handleNavLinkClick(item.label, item.to)}
                    >
                      <item.icon className="w-5 h-5" />
                      {isExpanded && <span className="ml-3">{item.label}</span>}
                    </NavLink>
                    {isExpanded && (
                      <button
                        className="ml-auto cursor-pointer"
                        onClick={() => toggleSubmenu(item.label)}
                        aria-label={expandedSubmenus.includes(item.label) ? 'Collapse submenu' : 'Expand submenu'}
                      >
                        {expandedSubmenus.includes(item.label) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }: { isActive: boolean }) =>
                        `flex items-center py-3 text-sm rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 hover:text-black dark:hover:text-white'
                        } ${isExpanded ? 'px-4' : 'px-2'} ${!isExpanded && 'justify-center'}`
                      }
                      onClick={() => handleNavLinkClick(item.label, item.to)}
                    >
                    <item.icon className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} text-black dark:text-gray-300`} />
                    {isExpanded && <span>{item.label}</span>}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
