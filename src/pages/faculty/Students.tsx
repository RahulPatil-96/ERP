import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Search, Mail, Edit2, Eye, Trash2, X } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  enrollmentDate?: string;
  departmentId?: number | null;
  status: 'Enrolled' | 'Graduated' | 'Dropped Out';
  image: string | null;
  courses: string[];
  grades: string[];
}

const statusStyles = {
  Enrolled: 'bg-green-100 text-green-800',
  Graduated: 'bg-blue-100 text-blue-800',
  'Dropped Out': 'bg-red-100 text-red-800'
};

const getInitials = (name: string) => {
  return name.split(' ').map(part => part[0]).join('').toUpperCase();
};

const StudentRow = ({ student, onView, onEdit, onDelete }: {
  student: Student;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="grid grid-cols-12 items-center p-4 hover:bg-gray-50 rounded-lg transition-colors gap-4">
    <div className="col-span-4 flex items-center space-x-4">
      <div className="flex-shrink-0">
        {student.image ? (
          <img className="w-12 h-12 rounded-full object-cover" src={student.image} alt={student.name} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
            {getInitials(student.name)}
          </div>
        )}
      </div>
      <div>
        <div className="font-medium text-gray-900">{student.name}</div>
        <div className="text-sm text-gray-500">{student.email}</div>
      </div>
    </div>
    <div className="col-span-2">
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[student.status]}`}>
        {student.status}
      </span>
    </div>
    <div className="col-span-6 flex justify-end space-x-2">
      <button onClick={onView} aria-label="View profile" title="View Profile" className="text-indigo-500 hover:text-indigo-600">
        <Eye className="w-5 h-5" />
      </button>
      <button onClick={onEdit} aria-label="Edit student" title="Edit Student" className="text-indigo-500 hover:text-indigo-600">
        <Edit2 className="w-5 h-5" />
      </button>
      <button onClick={onDelete} aria-label="Delete student" title="Delete Student" className="text-red-500 hover:text-red-600">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const DeleteConfirmationModal = ({ student, onDeleteConfirm, onCancel }: {
  student: Student | null;
  onDeleteConfirm: () => void;
  onCancel: () => void;
}) => (
  student ? (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
        <p className="mt-2 text-gray-600">Are you sure you want to delete {student.name}?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={onDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  ) : null
);

const NotificationModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
      <h2 className="text-lg font-semibold text-gray-900">Send Notification</h2>
      <textarea className="mt-2 w-full p-2 border border-gray-300 rounded-md" rows={4} placeholder="Type your message here..."></textarea>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancel</button>
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">Send</button>
      </div>
    </div>
  </div>
);

const EditModal = ({ student, onSave, onCancel }: {
  student: Student | null;
  onSave: (updatedStudent: Student) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(student?.name || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [status, setStatus] = useState(student?.status || 'Enrolled');
  const [courses, setCourses] = useState((student?.courses ?? []).join(', '));
  const [grades, setGrades] = useState((student?.grades ?? []).join(', '));

  const handleSave = () => {
    if (student) {
      onSave({ ...student, name, email, phone, status, courses: courses.split(',').map(c => c.trim()), grades: grades.split(',').map(g => g.trim()) });
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-lg font-semibold text-gray-900">Edit Student</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mt-2 w-full p-2 border border-gray-300 rounded-md" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-2 w-full p-2 border border-gray-300 rounded-md" />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="mt-2 w-full p-2 border border-gray-300 rounded-md" />
        <select value={status} onChange={(e) => setStatus(e.target.value as 'Enrolled' | 'Graduated' | 'Dropped Out')} className="mt-2 w-full p-2 border border-gray-300 rounded-md">
          <option value="Enrolled">Enrolled</option>
          <option value="Graduated">Graduated</option>
          <option value="Dropped Out">Dropped Out</option>
        </select>
        <textarea value={courses} onChange={(e) => setCourses(e.target.value)} placeholder="Courses (comma separated)" className="mt-2 w-full p-2 border border-gray-300 rounded-md"></textarea>
        <textarea value={grades} onChange={(e) => setGrades(e.target.value)} placeholder="Grades (comma separated)" className="mt-2 w-full p-2 border border-gray-300 rounded-md"></textarea>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={handleSave} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">Save</button>
        </div>
      </div>
    </div>
  );
};

export function Students() {
  const [students, setStudents] = React.useState<Student[]>([]);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = React.useState<Student | null>(null);
  const [showNotificationModal, setShowNotificationModal] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.statusText}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Error deleting student: ${response.statusText}`);
      }
      setStudents(students.filter((student) => student.id !== id));
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEditStudent = async (updatedStudent: Student) => {
    try {
      const response = await fetch(`/api/students/${updatedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      });
      if (!response.ok) {
        throw new Error(`Error updating student: ${response.statusText}`);
      }
      const data = await response.json();
      setStudents(students.map(student => student.id === data.id ? data : student));
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const newStudents: Partial<Student>[] = [];

    for (const item of jsonData) {
      const student: Partial<Student> = {
        name: item['Name'] || '',
        email: item['Email'] || '',
        phone: item['Phone'] || '',
        enrollmentDate: item['EnrollmentDate'] || '',
        departmentId: item['DepartmentId'] || null,
      };
      newStudents.push(student);
    }

    try {
      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudents),
      });
      if (!response.ok) {
        throw new Error(`Error uploading students: ${response.statusText}`);
      }
      const createdStudents = await response.json();
      setStudents(createdStudents);
    } catch (error) {
      console.error('Error uploading students:', error);
    }

    setUploading(false);
  };

  const filteredStudents = students.filter(
    (student: Student) =>
      (filterStatus === 'All' || student.status === filterStatus) &&
      (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseProfile = () => {
    setSelectedStudent(null);
  };

  return (
    <>
    <div className="space-y-8">
      <PageHeader
        title="Students"
        subtitle="Manage students, view profiles, and send notifications"
        icon={Search}
      />
      <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-xl p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full md:w-2/3 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-2 md:mt-0 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Students</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Graduated">Graduated</option>
            <option value="Dropped Out">Dropped Out</option>
          </select>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            disabled={uploading}
            className="ml-4 p-2 border border-gray-300 rounded-md cursor-pointer"
          />
          {/* Removed Open Student Data Form button as per user request */}
        </div>
      </div>
    </div>

    <div className="space-y-4">
      {filteredStudents.length === 0 ? (
        <div className="text-center text-gray-500">No students found.</div>
      ) : (
        filteredStudents.map((student: Student) => (
          <StudentRow
            key={student.id}
            student={student}
            onView={() => handleViewProfile(student)}
            onEdit={() => setEditingStudent(student)}
            onDelete={() => setStudentToDelete(student)}
          />
        ))
      )}
    </div>

    <div className="mt-6 text-right">
      <button onClick={() => setShowNotificationModal(true)} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200">
        <Mail className="w-5 h-5 inline-block mr-2" />
        Send Notification
      </button>
    </div>

    {/* Modals */}
    {selectedStudent && <StudentProfileModal student={selectedStudent!} onClose={handleCloseProfile} />}
    {editingStudent && (
      <EditModal
        student={editingStudent!}
        onSave={handleEditStudent}
        onCancel={() => setEditingStudent(null)}
      />
    )}
    {showNotificationModal && <NotificationModal onClose={() => setShowNotificationModal(false)} />}
    {studentToDelete && (
      <DeleteConfirmationModal
        student={studentToDelete!}
        onDeleteConfirm={() => handleDeleteStudent(studentToDelete!.id)}
        onCancel={() => setStudentToDelete(null)}
      />
    )}
    </>
  );
}

const StudentProfileModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Student Profile</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold overflow-hidden">
            {student.image ? (
              <img className="w-full h-full object-cover" src={student.image} alt={student.name} />
            ) : (
              getInitials(student.name)
            )}
          </div>
          <div>
            <div className="text-sm text-gray-600">{student.email}</div>
            <div className="text-sm text-gray-600">{student.phone}</div>
            <div className="text-sm text-gray-600">{student.enrollmentDate}</div>
            <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[student.status]}`}>
              {student.status}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">Courses:</h3>
          <ul className="list-disc pl-6">
            {(student.courses || []).map((course, index) => (
              <li key={index} className="text-gray-700">{course}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">Grades:</h3>
          <ul className="list-disc pl-6">
            {(student.grades || []).map((grade, index) => (
              <li key={index} className="text-gray-700">{grade}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);
