import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar';
import { Sun, Moon, Bell, LogOut, Search } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const isDarkMode = useAuthStore((state) => state.isDarkMode);
  const toggleTheme = useAuthStore((state) => state.toggleTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  // State for Change Role modal
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Functions to open and close the Change Role modal
  const openChangeRoleModal = () => {
    setSelectedRole(user?.currentRole || null);
    setIsChangeRoleModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeChangeRoleModal = () => {
    setIsChangeRoleModalOpen(false);
  };

  // Function to handle role change
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  // Function to save the selected role (this should update the user state accordingly)
  const saveRoleChange = async () => {
    if (selectedRole && selectedRole !== user?.currentRole) {
      try {
        // Use switchRole method from auth store to update the user's role
        await useAuthStore.getState().switchRole(selectedRole as 'student' | 'faculty' | 'admin' | 'hod');
      } catch (error) {
        console.error('Failed to switch role:', error);
      }
    }
    closeChangeRoleModal();
  };

  return (
    <>
      <div className={`flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-900`}>
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
        <div className={`flex-1 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
          <header className="h-16 bg-white/70 backdrop-blur-lg border-b border-gray-200/50 flex items-center justify-between px-8 sticky top-0 z-[50] dark:bg-dark-800/70 dark:border-dark-600">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white/50 dark:bg-dark-700 dark:border-dark-600 dark:text-gray-200 dark:placeholder-gray-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMenuOpen(false);
                  }}
                  className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div
                  className={`absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-800 shadow-lg rounded-md ${isNotificationsOpen ? 'block' : 'hidden'}`}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-dark-600">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-dark-600 max-h-64 overflow-y-auto">
                    {/* Sample Notifications */}
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">New Message</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">You have a new message from John</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">System Update</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">New version available v2.0.1</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">5 hours ago</div>
                    </div>
                  </div>
                  <div className="p-2 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <button className="w-full">View all notifications</button>
                  </div>
                </div>
              </div>

              {/* User Role Display */}
              <div
                className={`p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 flex items-center ${isMenuOpen ? 'justify-start' : 'justify-center'} space-x-2`}
              >
                {user?.currentRole && (
                  <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide select-none">
                    {user.currentRole}
                  </span>
                )}
              </div>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    setIsNotificationsOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg text-white">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                </button>
                <div className={`absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-800 shadow-lg rounded-md ${isMenuOpen ? 'block' : 'hidden'}`}>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={openChangeRoleModal}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                  >
                    Change Role
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="p-8 max-w-screen-xl mx-auto">{children}</main>
        </div>
      </div>

      {/* Change Role Modal */}
      {isChangeRoleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-96 max-w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Change Role</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {user?.roles?.map((role) => (
                <label key={role} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => handleRoleChange(role)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="text-gray-900 dark:text-gray-100">{role}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeChangeRoleModal}
                className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveRoleChange}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
