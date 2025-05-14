import { useState } from 'react';
import { Settings as Lock, Bell, Save, Sun, Moon, FileText, RefreshCcw } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuthStore } from '../../store/authStore';

export function Settings() {
  const [serverName, setServerName] = useState<string>('');
  const [maxUsers, setMaxUsers] = useState<number>(100);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [backupLoading, setBackupLoading] = useState<boolean>(false);
  const [activityLogs, setActivityLogs] = useState<string[]>([]);

  // Use global theme state and toggleTheme from auth store
  const isDarkMode = useAuthStore((state) => state.isDarkMode);
  const toggleTheme = useAuthStore((state) => state.toggleTheme);

  // Handle form submission
  const handleSaveSettings = () => {
    console.log('Settings saved:', { serverName, maxUsers, emailNotifications, twoFactorAuth, theme: isDarkMode ? 'dark' : 'light', language });
    setActivityLogs((prevLogs) => [...prevLogs, 'Settings saved.']);
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setActivityLogs((prevLogs) => [...prevLogs, `Language changed to ${newLanguage}.`]);
  };

  // Simulate backup process
  const handleBackup = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      setActivityLogs((prevLogs) => [...prevLogs, 'Settings backup completed.']);
    }, 2000);
  };

  // Simulate restore process
  const handleRestore = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      setActivityLogs((prevLogs) => [...prevLogs, 'Settings restored from backup.']);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Settings"
        subtitle="Manage server settings, appearance, and more."
        icon={Lock}
      />
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-8">
        {/* Settings Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Server Settings */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Settings</h3>
            <div className="mb-4">
              <label htmlFor="serverName" className="text-sm text-gray-600">Server Name</label>
              <input
                id="serverName"
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                placeholder="Enter server name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="maxUsers" className="text-sm text-gray-600">Max Users</label>
              <input
                id="maxUsers"
                type="number"
                value={maxUsers}
                onChange={(e) => setMaxUsers(Number(e.target.value))}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
            <div className="flex items-center mb-4">
              <Lock className="w-5 h-5 text-indigo-500 mr-2" />
              <label className="text-sm text-gray-600">Two-Factor Authentication</label>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                className="ml-2"
              />
            </div>
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-indigo-500 mr-2" />
              <label className="text-sm text-gray-600">Email Notifications</label>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="ml-2"
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Theme Settings */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
            <div className="flex items-center mb-4">
              <button
                onClick={toggleTheme}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-indigo-600 transition duration-200"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 inline-block mr-2" />
                ) : (
                  <Moon className="w-5 h-5 inline-block mr-2" />
                )}
                Toggle Theme
              </button>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-600">Language</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>

          {/* Backup and Restore */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Restore</h3>
            <div className="flex flex-col">
              <button
                onClick={handleBackup}
                className="bg-green-500 text-white px-6 py-3 rounded-lg mb-4 hover:bg-green-600 transition duration-200 flex items-center"
              >
                {backupLoading ? (
                  <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5 mr-2" />
                )}
                {backupLoading ? 'Backing up...' : 'Backup Settings'}
              </button>
              <button
                onClick={handleRestore}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center"
              >
                <RefreshCcw className="w-5 h-5 mr-2" />
                Restore Settings
              </button>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveSettings}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-200 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </button>
        </div>

        {/* Activity Logs */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Logs</h3>
          <ul className="space-y-2">
            {activityLogs.map((log, index) => (
              <li key={index} className="text-sm text-gray-600">{log}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
