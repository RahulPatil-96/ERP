import { useState } from 'react';
import { SettingsIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

export function DepartmentSettings() {
  const [departmentInfo, setDepartmentInfo] = useState({
    name: 'Computer Science',
    code: 'CS',
    head: 'Dr. Alice Johnson',
    contactEmail: 'cs@university.edu',
    gradingSystem: 'letter',
    academicYear: '2023-2024'
  });

  const handleInputChange = (field: string, value: string) => {
    setDepartmentInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Department Settings"
        subtitle="Configure your department's information and preferences"
        icon={SettingsIcon}
      />

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Department Name"
            value={departmentInfo.name}
            onChange={(value) => handleInputChange('name', value)}
            placeholder="Enter department name"
          />

          <Input
            label="Department Code"
            value={departmentInfo.code}
            onChange={(value) => handleInputChange('code', value)}
            placeholder="Enter department code"
          />

          <Input
            label="Department Head"
            value={departmentInfo.head}
            onChange={(value) => handleInputChange('head', value)}
            placeholder="Enter department head"
          />

          <Input
            label="Contact Email"
            value={departmentInfo.contactEmail}
            onChange={(value) => handleInputChange('contactEmail', value)}
            placeholder="Enter contact email"
            type="email"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Grading System"
              value={departmentInfo.gradingSystem}
              onChange={(value) => handleInputChange('gradingSystem', value)}
            >
              <option value="letter">Letter Grades (A-F)</option>
              <option value="percentage">Percentage Grades</option>
              <option value="gpa">GPA Scale (0-4)</option>
            </Select>

            <Input
              label="Academic Year"
              value={departmentInfo.academicYear}
              onChange={(value) => handleInputChange('academicYear', value)}
              placeholder="Enter academic year"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="default" onClick={() => console.log('Changes saved')}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
