import { useState } from 'react';
import { FileTextIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
interface MarksEntry {
  id: number;
  studentName: string;
  subject: string;
  marks: number;
  status: 'Pending' | 'Approved' | 'Returned';
  uploadedBy: string;
  uploadedAt: string;
}

export function InternalAssessment() {
  const [marksEntries] = useState<MarksEntry[]>([
    { id: 1, studentName: 'Alice Johnson', subject: 'CS101', marks: 85, status: 'Pending', uploadedBy: 'Dr. Smith', uploadedAt: '2023-10-01' },
    { id: 2, studentName: 'Bob Smith', subject: 'CS101', marks: 70, status: 'Pending', uploadedBy: 'Dr. Smith', uploadedAt: '2023-10-01' },
    { id: 3, studentName: 'Charlie Brown', subject: 'MK401', marks: 90, status: 'Approved', uploadedBy: 'Dr. Johnson', uploadedAt: '2023-09-30' },
  ]);

  const handleApprove = (id: number) => {
    // Logic to approve marks entry
    console.log(`Marks entry ${id} approved.`);
  };

  const handleReturn = (id: number) => {
    // Logic to return marks entry for correction
    console.log(`Marks entry ${id} returned for correction.`);
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Internal Assessment / Marks Entry"
        subtitle="Manage internal assessment marks and reports"
        icon={FileTextIcon}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">IA Marks Approval</h3>
        <div className="space-y-4">
          {marksEntries.map((entry) => (
            <Card key={entry.id} className="flex justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900">{entry.studentName}</h4>
                <p className="text-sm text-gray-600">
                  Subject: {entry.subject} • Marks: {entry.marks} • Status: {entry.status}
                </p>
                <p className="text-xs text-gray-500">Uploaded by: {entry.uploadedBy} on {entry.uploadedAt}</p>
              </div>
              <div className="flex items-center space-x-4">
                {entry.status === 'Pending' && (
                  <>
                    <button className="text-green-500 hover:text-green-600" onClick={() => handleApprove(entry.id)}>Approve</button>
                    <button className="text-red-500 hover:text-red-600" onClick={() => handleReturn(entry.id)}>Return</button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Reports</h3>
        <p className="text-sm text-gray-600">Student performance analysis and weak student identification will be displayed here.</p>
        {/* Placeholder for assessment reports */}
        <div className="mt-4">
          <p className="text-gray-500">Reports data will be shown here.</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <p className="text-sm text-gray-600">Subject-wise and class-wise performance heatmaps will be displayed here.</p>
        {/* Placeholder for grade distribution heatmaps */}
        <div className="mt-4">
          <p className="text-gray-500">Heatmap data will be shown here.</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
        <p className="text-sm text-gray-600">Details of who uploaded or modified marks and when will be displayed here.</p>
        {/* Placeholder for audit trail data */}
        <div className="mt-4">
          <p className="text-gray-500">Audit trail data will be shown here.</p>
        </div>
      </div>
    </div>
  );
}