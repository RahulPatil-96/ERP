import { useState } from 'react';
import { ClipboardIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import Select from 'react-select';

interface AccreditationData {
  facultyCount: number;
  researchPapers: number;
  placements: number;
  studentAchievements: number;
}

export function Accreditation() {
  const [accreditationData] = useState<AccreditationData>({
    facultyCount: 10,
    researchPapers: 25,
    placements: 80,
    studentAchievements: 15,
  });

  const [documentUploads, setDocumentUploads] = useState<string[]>([]);
  const [newDocument, setNewDocument] = useState('');

  const [departmentProfile] = useState({
    courses: ['Computer Science', 'Electronics', 'Mechanical Engineering'],
    labs: ['Computer Lab', 'Electronics Lab', 'Mechanical Workshop'],
    achievements: ['Best Department Award 2022', '100% Placement Rate'],
    facultyProfile: [
      { name: 'Dr. Alice Johnson', designation: 'Professor', expertise: 'Computer Science' },
      { name: 'Dr. Bob Smith', designation: 'Associate Professor', expertise: 'Electronics' },
    ],
  });

  const handleUploadDocument = () => {
    if (newDocument) {
      setDocumentUploads([...documentUploads, newDocument]);
      setNewDocument('');
    }
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Accreditation / Reports"
        subtitle="Manage accreditation data and reports"
        icon={ClipboardIcon}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NAAC/NBA Reporting</h3>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Faculty Count: {accreditationData.facultyCount}</p>
          <p className="text-sm text-gray-600">Research Papers Published: {accreditationData.researchPapers}</p>
          <p className="text-sm text-gray-600">Placements: {accreditationData.placements}%</p>
          <p className="text-sm text-gray-600">Student Achievements: {accreditationData.studentAchievements}</p>
        </Card>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Uploads</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Document Name or URL"
            value={newDocument}
            onChange={(e) => setNewDocument(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
          <button
            onClick={handleUploadDocument}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Upload Document
          </button>
          <div className="space-y-2">
            {documentUploads.length > 0 ? (
              documentUploads.map((doc, index) => (
                <Card key={index} className="p-4">
                  <p className="text-sm text-gray-600">{doc}</p>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No documents uploaded yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Profile</h3>
        <Card className="p-4">
          <h4 className="font-medium text-gray-900">Courses Offered:</h4>
          <ul className="list-disc pl-5">
            {departmentProfile.courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
          <h4 className="font-medium text-gray-900 mt-4">Labs Available:</h4>
          <ul className="list-disc pl-5">
            {departmentProfile.labs.map((lab, index) => (
              <li key={index}>{lab}</li>
            ))}
          </ul>
          <h4 className="font-medium text-gray-900 mt-4">Achievements:</h4>
          <ul className="list-disc pl-5">
            {departmentProfile.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
          <h4 className="font-medium text-gray-900 mt-4">Faculty Profile:</h4>
          <ul className="list-disc pl-5">
            {departmentProfile.facultyProfile.map((faculty, index) => (
              <li key={index}>
                {faculty.name} - {faculty.designation} ({faculty.expertise})
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Templates</h3>
        <div className="space-y-4">
          <Select
            options={[
              { value: 'NAAC', label: 'NAAC Template' },
              { value: 'NBA', label: 'NBA Template' },
            ]}
            className="mb-4"
            placeholder="Select Template Type"
          />
          <button className="bg-blue-500 text-white rounded-lg p-2">
            Generate Template
          </button>
        </div>
      </div>
    </div>
  );
}