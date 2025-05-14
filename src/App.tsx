import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { useAuthStore } from './store/authStore';

// HOD Pages
import { DepartmentOverview } from './pages/hod/DepartmentOverview';
import { FacultyManagement } from './pages/hod/ManageFaculty';
import { StudentManagement } from './pages/hod/ManageStudents';
import { CourseManagement } from './pages/hod/ManageCourses';
import { DepartmentAnalytics } from './pages/hod/DepartmentAnalytics';
import { DepartmentSettings } from './pages/hod/DepartmentSettings';
import ScheduleManagement from './pages/hod/Schedule';
import { LeaveManagement } from './pages/hod/ManageLeaves';
import { Accreditation } from './pages/hod/Accreditation';
import { EventsManagement } from './pages/hod/ManageEvents';
import { HodAnnouncements } from './pages/hod/HodAnnouncements';
import { InternalAssessment } from './pages/hod/InternalAssessment';
import { HodFeedback } from './pages/hod/HodFeedback';
import { DepartmentBudgetResources } from './pages/hod/Resources';
import { ProfilePage } from './pages/Profile';

// Student Pages
import { Schedule } from './pages/student/Schedule';
import StudentAttendance from './pages/student/StudentAttendance';
import { ResourceSharing } from './pages/student/ResourceSharing';
import { Assignments } from './pages/student/Assignments';
import Examination from './pages/student/Examination';
import { Library } from './pages/student/Library';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import { AITutor } from './pages/student/AITutor';
import { VirtualLabs } from './pages/student/VirtualLabs';
import { Goals } from './pages/student/Goals';
import { Progress } from './pages/student/Progress';
import { Discussion } from './pages/student/Discussion';
import { Fees } from './pages/student/Fees';
import { Feedback as StudentFeedback } from './pages/student/StudentFeedback';

// Faculty Pages
import { Students } from './pages/faculty/Students';
import Attendance from './pages/faculty/Attendance';
import { FacultySchedule } from './pages/faculty/FacultySchedule';
import { FacultyAssignments } from './pages/faculty/FacultyAssignments';
import { Announcements } from './pages/faculty/Announcements';
import { Grading } from './pages/faculty/Grading';
import { CourseContent } from './pages/faculty/CourseContent';
import { AIAssistant } from './pages/faculty/AIAssistant';
import { Analytics } from './pages/faculty/Analytics';
import { Communication } from './pages/faculty/Communication';

// Admin Pages
import Users from './pages/admin/Users';
import { Departments } from './pages/admin/Departments';
import { Courses } from './pages/admin/Courses';
import { Infrastructure } from './pages/admin/Infrastructure';
import Resources from './pages/admin/Resources';
import {AdminAnalytics} from './pages/admin/AdminAnalytics';
import Planning from './pages/admin/Planning';
import { Settings } from './pages/admin/Settings';
import ManageColleges from './pages/admin/ManageColleges';

function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading } = useAuthStore();

  // Show loading spinner while checking user authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect if user doesn't have permission for the route
  if (allowedRoles && !allowedRoles.includes(user.currentRole)) {
    return <Navigate to="/dashboard" />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        {/* Common Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/schedule"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Schedule />
            </PrivateRoute>
          }
        />
        <Route
        path="/studentattendance"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentAttendance />
          </PrivateRoute>
        }
        />
        <Route
          path="/resourcesharing"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <ResourceSharing />
            </PrivateRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Assignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/examination"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Examination />
            </PrivateRoute>
          }
        />
        <Route
          path="/library"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Library />
            </PrivateRoute>
          }
        />
        <Route
          path="/studentannouncements"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentAnnouncements />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-tutor"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <AITutor />
            </PrivateRoute>
          }
        />
        <Route
          path="/virtual-labs"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <VirtualLabs />
            </PrivateRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Goals />
            </PrivateRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Progress />
            </PrivateRoute>
          }
        />
        <Route
          path="/discussion"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Discussion />
            </PrivateRoute>
          }
        />
        <Route
          path="/fees"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Fees />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentFeedback />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <div className="p-8">
                <ProfilePage />
              </div>
            </PrivateRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/students"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Students />
            </PrivateRoute>
          }
        />
        <Route
          path="/facultyschedule"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <FacultySchedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/facultyassignments"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <FacultyAssignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Announcements />
            </PrivateRoute>
          }
        />
        <Route
          path="/grading"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Grading />
            </PrivateRoute>
          }
        />
        <Route
          path="/course-content"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <CourseContent />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <AIAssistant />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/communication"
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Communication />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Departments />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/infrastructure"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Infrastructure />
            </PrivateRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Resources />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminanalytics"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/planning"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Planning />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Settings />
            </PrivateRoute>
          }
        />

        <Route
          path="/managecolleges"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ManageColleges />
            </PrivateRoute>
          }
        />

        {/* HOD Routes */}
        <Route
          path="/hod/overview"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <DepartmentOverview />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/faculty"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <FacultyManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/courses"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <CourseManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/events"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <EventsManagement />
            </PrivateRoute>
          }
/>
        <Route
          path="/hod/analytics"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <DepartmentAnalytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/settings"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <DepartmentSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/students"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <StudentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/schedule"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <ScheduleManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/leave"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <LeaveManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/accreditation"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <Accreditation />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/announcements"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <HodAnnouncements />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/events"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <EventsManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/internalassessment"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <InternalAssessment />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/feedback"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <HodFeedback />
            </PrivateRoute>
          }
        />
        <Route
          path="/hod/resources"
          element={
            <PrivateRoute allowedRoles={['hod']}>
              <DepartmentBudgetResources />
            </PrivateRoute>
          }
        />

        {/* Redirect to login by default */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />
      </Routes>

    </Router>
  );
}

export default App;
