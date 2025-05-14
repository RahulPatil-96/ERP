import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const roles = ['student', 'faculty', 'admin', 'hod'] as const;

export const RoleSwitcher: React.FC = () => {
  const { user, switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as typeof roles[number];
    if (user && newRole !== user.currentRole) {
      try {
        await switchRole(newRole);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to switch role:', error);
      }
    }
  };

  return (
    <div className="my-4">
      <label htmlFor="role-select" className="block mb-1 font-semibold">
        Switch Role
      </label>
      <select
        id="role-select"
        value={user?.currentRole || 'student'}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
