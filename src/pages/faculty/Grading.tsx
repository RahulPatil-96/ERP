import { useState, useEffect, useCallback } from 'react';
import { Trash2, Edit2, Search, Plus, X, Check } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

interface Student {
  id: number;
  name: string;
  course: string;
  grade: string;
}

type SortField = 'name' | 'course' | 'grade';
type SortOrder = 'asc' | 'desc';

const validGrades = [
  'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'
];

export function Grading() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'John Doe', course: 'CS 101', grade: 'A' },
      { id: 2, name: 'Jane Smith', course: 'CS 101', grade: 'B+' },
      { id: 3, name: 'Alice Brown', course: 'Math 101', grade: 'A-' },
      { id: 4, name: 'Bob White', course: 'Math 101', grade: 'C+' },
      { id: 5, name: 'Charlie Black', course: 'CS 101', grade: 'B' },
      { id: 6, name: 'David Green', course: 'CS 101', grade: 'A' },
      { id: 7, name: 'Eva Blue', course: 'Math 101', grade: 'B+' },
      { id: 8, name: 'Frank Gray', course: 'Math 101', grade: 'C' },
      { id: 9, name: 'Grace Yellow', course: 'Physics 101', grade: 'A' },
      { id: 10, name: 'Hannah Orange', course: 'Physics 101', grade: 'B+' },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [sortConfig, setSortConfig] = useState<{field: SortField; order: SortOrder}>({
    field: 'name',
    order: 'asc'
  });
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    course: '',
    grade: 'A'
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleEditGrade = (student: Student) => {
    setEditingStudent(student);
  };

  const handleSaveGrade = useCallback(() => {
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id ? {...editingStudent} : s
      ));
      setEditingStudent(null);
    }
  }, [editingStudent, students]);

  const handleDeleteGrade = useCallback((studentId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  }, [students]);

  const handleSort = useCallback((field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleAddStudent = useCallback(() => {
    if (newStudent.name && newStudent.course) {
      setStudents(prev => [
        ...prev,
        { ...newStudent, id: Math.max(...prev.map(s => s.id)) + 1 }
      ]);
      setNewStudent({ name: '', course: '', grade: 'A' });
      setIsAdding(false);
    }
  }, [newStudent]);

  const filteredStudents = students
    .filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortConfig.order === 'asc' ? 1 : -1;
      return a[sortConfig.field].localeCompare(b[sortConfig.field]) * modifier;
    });

  const SortableHeader = ({ field, children }: { 
    field: SortField;
    children: React.ReactNode;
  }) => (
    <th
      className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-1">
          {sortConfig.field === field && (
            sortConfig.order === 'asc' ? '↑' : '↓'
          )}
        </span>
      </div>
    </th>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Grading Dashboard"
        subtitle="Manage students and their grades"
        icon={Edit2}
      />
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-xl p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Student </button>
        </div>

        {isAdding && (
          <div className="mb-6 p-4 border border-gray-300 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Add New Student</h2>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="Name"
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={newStudent.course}
              onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
              placeholder="Course"
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            >
              {validGrades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleAddStudent}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Add
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="ml-2 text-red-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <SortableHeader field="name">Student Name</SortableHeader>
                <SortableHeader field="course">Course</SortableHeader>
                <SortableHeader field="grade">Grade</SortableHeader>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{student.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{student.course}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingStudent?.id === student.id ? (
                        <select
                          value={student.grade}
                          onChange={(e) => setEditingStudent({ ...student, grade: e.target.value })}
                          className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {validGrades.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      ) : (
                        student.grade
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingStudent?.id === student.id ? (
                        <>
                          <button
                            onClick={handleSaveGrade}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingStudent(null)}
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditGrade(student)}
                          className="text-indigo-500 hover:text-indigo-600"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteGrade(student.id)}
                        className="text-red-500 hover:text-red-600 ml-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}