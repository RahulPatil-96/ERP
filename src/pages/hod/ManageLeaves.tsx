import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import Select from 'react-select';

interface LeaveApplication {
  id: number;
  faculty: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comments?: string;
}

interface LeaveType {
  type: string;
  balance: number;
}

export function LeaveManagement() {
  const [leaveApplications] = useState<LeaveApplication[]>([
    { id: 1, faculty: 'Alice Johnson', leaveType: 'CL', startDate: '2023-10-10', endDate: '2023-10-12', status: 'Pending' },
    { id: 2, faculty: 'Bob Smith', leaveType: 'EL', startDate: '2023-10-15', endDate: '2023-10-20', status: 'Pending' },
  ]);

  const [leaveTypes] = useState<LeaveType[]>([
    { type: 'Casual Leave (CL)', balance: 10 },
    { type: 'Earned Leave (EL)', balance: 15 },
    { type: 'Duty Leave (DL)', balance: 5 },
  ]);

  const [selectedSubstitute, setSelectedSubstitute] = useState<string | null>(null);
  const [substitutes] = useState<string[]>(['Charlie Brown', 'David Wilson', 'Eve Adams']);

  const handleApprove = (id: number) => {
    // Logic to approve leave application
    console.log(`Leave application ${id} approved.`);
  };

  const handleReject = (id: number, comments: string) => {
    // Logic to reject leave application
    console.log(`Leave application ${id} rejected with comments: ${comments}`);
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Leave Management"
        subtitle="Manage leave applications and faculty availability"
        icon={CalendarIcon}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Applications</h3>
        <div className="space-y-4">
          {leaveApplications.map((application) => (
            <Card key={application.id} className="flex justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900">{application.faculty}</h4>
                <p className="text-sm text-gray-600">
                  Leave Type: {application.leaveType} • From: {application.startDate} • To: {application.endDate} • Status: {application.status}
                </p>
                {application.comments && <p className="text-sm text-gray-500">Comments: {application.comments}</p>}
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-green-500 hover:text-green-600" onClick={() => handleApprove(application.id)}>Approve</button>
                <button className="text-red-500 hover:text-red-600" onClick={() => handleReject(application.id, 'No comments')}>Reject</button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Types</h3>
        <div className="space-y-4">
          {leaveTypes.map((leaveType) => (
            <Card key={leaveType.type} className="flex justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900">{leaveType.type}</h4>
                <p className="text-sm text-gray-600">Balance: {leaveType.balance}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Substitute Mapping</h3>
        <Select
          options={substitutes.map(sub => ({ value: sub, label: sub }))}
          value={selectedSubstitute ? { value: selectedSubstitute, label: selectedSubstitute } : null}
          onChange={(option) => setSelectedSubstitute(option?.value || null)}
          className="mb-4"
          placeholder="Select a substitute faculty"
        />
        <button className="mt-4 text-blue-500 hover:text-blue-600">Assign Substitute</button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Analytics</h3>
        <p className="text-sm text-gray-600">Monthly leave trends and faculty availability matrix will be displayed here.</p>
        {/* Placeholder for analytics charts or tables */}
        <div className="mt-4">
          <p className="text-gray-500">Analytics data will be shown here.</p>
        </div>
      </div>
    </div>
  );
}