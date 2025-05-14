import React, { useState } from 'react';
import { Building2, Search, Plus, Edit, Trash2 } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  faculty: number;
  subjects: number;
  hod: string;
  students: number;
  users: { id: string; name: string }[]; // Added users array for impersonation
}

interface College {
  id: number;
  name: string;
  code: string;
  location: string;
  departments: Department[];
  students: number;
  faculty: number;
  status: string;
  contactPerson: string; // New field
  contactDetails: string; // New field
  modules: string[]; // New field
  price: number; // New field
  paymentStatus: string; // New field
}

import { useAuthStore } from '../../store/authStore';

const ManageColleges: React.FC = () => {
  useAuthStore((state) => state.user); // subscribe to user state to trigger re-render on impersonation

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Name');
  const [colleges, setColleges] = useState<College[]>([
    {
      id: 1,
      name: 'Engineering College of Technology',
      code: 'ECT001',
      location: 'New York, USA',
      departments: [
        { 
          id: 1, 
          name: 'Computer Science', 
          faculty: 40, 
          subjects: 10, 
          hod: 'Dr. Smith', 
          students: 500,
          users: [
            { id: 'u1', name: 'Alice' },
            { id: 'u2', name: 'Bob' },
            { id: 'u3', name: 'Charlie' },
          ],
        },
        { 
          id: 2, 
          name: 'Electrical Engineering', 
          faculty: 30, 
          subjects: 8, 
          hod: 'Dr. Johnson', 
          students: 450,
          users: [
            { id: 'u4', name: 'David' },
            { id: 'u5', name: 'Eve' },
          ],
        },
      ],
      students: 2500,
      faculty: 150,
      status: 'active',
      contactPerson: 'John Doe',
      contactDetails: 'john.doe@example.com',
      modules: ['Engineering', 'Technology'],
      price: 15000,
      paymentStatus: 'Paid',
    },
    {
      id: 2,
      name: 'Institute of Medical Sciences',
      code: 'IMS002',
      location: 'Boston, USA',
      departments: [
        { 
          id: 1, 
          name: 'Surgery', 
          faculty: 25, 
          subjects: 5, 
          hod: 'Dr. Lee', 
          students: 200,
          users: [
            { id: 'u6', name: 'Frank' },
            { id: 'u7', name: 'Grace' },
          ],
        },
        { 
          id: 2, 
          name: 'Pediatrics', 
          faculty: 20, 
          subjects: 6, 
          hod: 'Dr. Brown', 
          students: 180,
          users: [
            { id: 'u8', name: 'Heidi' },
            { id: 'u9', name: 'Ivan' },
          ],
        },
      ],
      students: 1800,
      faculty: 120,
      status: 'active',
      contactPerson: 'Jane Smith',
      contactDetails: 'jane.smith@example.com',
      modules: ['Medicine', 'Surgery'],
      price: 20000,
      paymentStatus: 'Pending',
    },
    {
      id: 3,
      name: 'Arts and Humanities College',
      code: 'AHC003',
      location: 'Los Angeles, USA',
      departments: [
        { 
          id: 1, 
          name: 'History', 
          faculty: 15, 
          subjects: 4, 
          hod: 'Dr. Green', 
          students: 100,
          users: [
            { id: 'u10', name: 'Judy' },
            { id: 'u11', name: 'Karl' },
          ],
        },
        { 
          id: 2, 
          name: 'Philosophy', 
          faculty: 10, 
          subjects: 3, 
          hod: 'Dr. White', 
          students: 80,
          users: [
            { id: 'u12', name: 'Liam' },
          ],
        },
      ],
      students: 500,
      faculty: 25,
      status: 'inactive',
      contactPerson: 'Alice Johnson',
      contactDetails: 'alice.johnson@example.com',
      modules: ['Arts', 'Humanities'],
      price: 12000,
      paymentStatus: 'Unpaid',
    },
  ]);

  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [newCollege, setNewCollege] = useState<College>({
    id: 0,
    name: '',
    code: '',
    location: '',
    departments: [],
    students: 0,
    faculty: 0,
    status: 'active',
    contactPerson: '',
    contactDetails: '',
    modules: [],
    price: 0,
    paymentStatus: '',
  });

  const [newDepartment, setNewDepartment] = useState<Department>({
    id: 0,
    name: '',
    faculty: 0,
    subjects: 0,
    hod: '',
    students: 0,
    users: [],
  });
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [currentDepartmentCollegeId, setCurrentDepartmentCollegeId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setShowDeleteConfirm(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setColleges(colleges.filter((college) => college.id !== deleteId));
    }
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleAddCollege = () => {
    if (!newCollege.name || !newCollege.code || !newCollege.location) {
      alert('Please fill in all fields');
      return;
    }
    setColleges([...colleges, { ...newCollege, id: colleges.length + 1 }]);
    resetNewCollege();
  };

  const handleEditCollege = (collegeId: number) => {
    const college = colleges.find((college) => college.id === collegeId);
    if (college) {
      setEditingCollege(college);
      setNewCollege(college);
      setShowModal(true);
    }
  };

  const resetNewCollege = () => {
    setNewCollege({
      id: 0,
      name: '',
      code: '',
      location: '',
      departments: [],
      students: 0,
      faculty: 0,
      status: 'active',
      contactPerson: '',
      contactDetails: '',
      modules: [],
      price: 0,
      paymentStatus: '',
    });
    setShowModal(false);
    setEditingCollege(null);
  };

  const handleAddDepartment = (collegeId: number) => {
    if (!newDepartment.name || !newDepartment.faculty || !newDepartment.subjects || !newDepartment.hod || !newDepartment.students) {
      alert('Please fill in all fields for the department');
      return;
    }
    const collegeIndex = colleges.findIndex(col => col.id === collegeId);
    if (collegeIndex !== -1) {
      const updatedColleges = [...colleges];
      updatedColleges[collegeIndex].departments.push({ ...newDepartment, id: updatedColleges[collegeIndex].departments.length + 1, users: newDepartment.users || [] });
      setColleges(updatedColleges);
    }
    resetNewDepartment();
    setCurrentDepartmentCollegeId(null);
  };

  const handleDeleteDepartment = (collegeId: number, departmentId: number) => {
    const collegeIndex = colleges.findIndex(col => col.id === collegeId);
    if (collegeIndex !== -1) {
      const updatedColleges = [...colleges];
      updatedColleges[collegeIndex].departments = updatedColleges[collegeIndex].departments.filter(dep => dep.id !== departmentId);
      setColleges(updatedColleges);
    }
  };

  const handleEditDepartment = (collegeId: number, departmentId: number) => {
    const collegeIndex = colleges.findIndex(col => col.id === collegeId);
    if (collegeIndex !== -1) {
      const department = colleges[collegeIndex].departments.find(dep => dep.id === departmentId);
      if (department) {
        setNewDepartment({ ...department, users: department.users || [] });
        setEditingDepartment(department);
        setShowDepartmentModal(true);
        setCurrentDepartmentCollegeId(collegeId);
      }
    }
  };

  const resetNewDepartment = () => {
    setNewDepartment({
      id: 0,
      name: '',
      faculty: 0,
      subjects: 0,
      hod: '',
      students: 0,
      users: [],
    });
    setShowDepartmentModal(false);
    setEditingDepartment(null);
    setCurrentDepartmentCollegeId(null);
  };

  const filteredColleges = colleges
    .filter((college) => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || college.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'Name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'Students') {
        return a.students - b.students;
      } else if (sortBy === 'Departments') {
        return a.departments.length - b.departments.length;
      }
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Building2 className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Colleges</h1>
        </div>
        <div className="flex items-center">
          <button
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New College
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search colleges..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option>Name</option>
              <option>Students</option>
              <option>Departments</option>
            </select>
          </div>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <div className="flex space-x-6 py-4 min-w-max">
          {filteredColleges.map((college) => (
            <div key={college.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden w-[370px]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{college.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      college.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}
                  >
                    {college.status.charAt(0).toUpperCase() + college.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{college.code}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{college.location}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Contact Person: {college.contactPerson}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Contact Details: {college.contactDetails}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Modules: {college.modules.join(', ')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Price: ${college.price}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Payment Status: {college.paymentStatus}</p>

                {/* Departments */}
                <div className="space-y-4">
                  {college.departments.map((department) => (
                    <div
                      key={department.id}
                      className="flex justify-between items-start bg-gray-100 dark:bg-gray-700 p-4 rounded-xl"
                    >
                      {/* Left Side: Department Info */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 dark:text-white">
                          {department.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          HOD: {department.hod}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Faculty: {department.faculty}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Subjects: {department.subjects}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Students: {department.students}
                        </p>
                      </div>

                      {/* Right Side: Actions */}
                      <div className="flex flex-col items-end space-y-2">
                        {/* Edit and Delete Buttons Row */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditDepartment(college.id, department.id)}
                            className="flex items-center justify-center p-2 text-blue-600 bg-transparent rounded hover:bg-blue-100 transition duration-200"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(college.id, department.id)}
                            className="flex items-center justify-center p-2 text-red-600 bg-transparent rounded hover:bg-red-100 transition duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Impersonate Input Just Below */}
                        <input
                          type="text"
                          placeholder="Impersonate User"
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-36"
                          list={`users-list-${college.id}-${department.id}`}
                          onChange={(e) => {
                            const inputUserId = e.target.value;
                            if (inputUserId) {
                              if (
                                useAuthStore &&
                                useAuthStore.getState &&
                                useAuthStore.getState().impersonateUser
                              ) {
                                useAuthStore.getState().impersonateUser(inputUserId);
                              } else {
                                console.warn("impersonateUser function not found in useAuthStore");
                              }
                            }
                          }}
                        />
                        <datalist id={`users-list-${college.id}-${department.id}`}>
                          {department.users?.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between bg-gray-50 dark:bg-gray-900 p-4">
                <button
                  onClick={() => handleEditCollege(college.id)}
                  className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md shadow hover:bg-blue-700 transition-colors duration-200 ease-in-out transform hover:scale-105"
                >
                  Edit College
                </button>
                <button
                  onClick={() => handleDelete(college.id)}
                  className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-md shadow hover:bg-red-700 transition-colors duration-200 ease-in-out transform hover:scale-105"
                >
                  Delete College
                </button>
                <button
                  onClick={() => {
                    setShowDepartmentModal(true);
                    setNewDepartment({
                      id: 0,
                      name: '',
                      faculty: 0,
                      subjects: 0,
                      hod: '',
                      students: 0,
                      users: [],
                    });
                    setCurrentDepartmentCollegeId(college.id);
                  }}
                  className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md shadow hover:bg-green-700 transition-colors duration-200 ease-in-out transform hover:scale-105"
                >
                  Add Department
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding/Editing College */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">{editingCollege ? 'Edit College' : 'Add New College'}</h2>
            <input
              type="text"
              placeholder="College Name"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newCollege.name}
              onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="College Code"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newCollege.code}
              onChange={(e) => setNewCollege({ ...newCollege, code: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newCollege.location}
              onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact Person"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newCollege.contactPerson}
              onChange={(e) => setNewCollege({ ...newCollege, contactPerson: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact Details"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newCollege.contactDetails}
              onChange={(e) => setNewCollege({ ...newCollege, contactDetails: e.target.value })}
            />
            <input
              type="text"
              placeholder="Modules (comma separated)"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newCollege.modules.join(', ')}
              onChange={(e) => setNewCollege({ ...newCollege, modules: e.target.value.split(',').map(module => module.trim()) })}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newCollege.price}
              onChange={(e) => setNewCollege({ ...newCollege, price: Number(e.target.value) })}
            />
            <select
              value={newCollege.paymentStatus}
              onChange={(e) => setNewCollege({ ...newCollege, paymentStatus: e.target.value })}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            >
              <option value="">Select Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <select
              value={newCollege.status}
              onChange={(e) => setNewCollege({ ...newCollege, status: e.target.value })}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={editingCollege ? () => {
                  setColleges(colleges.map(col => col.id === editingCollege.id ? newCollege : col));
                  resetNewCollege();
                } : handleAddCollege}
              >
                {editingCollege ? 'Update' : 'Add'}
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={resetNewCollege}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Department */}
      {showDepartmentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">{editingDepartment ? 'Edit Department' : 'Add New Department'}</h2>
            <input
              type="text"
              placeholder="Department Name"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Faculty"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newDepartment.faculty}
              onChange={(e) => setNewDepartment({ ...newDepartment, faculty: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Subjects"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newDepartment.subjects}
              onChange={(e) => setNewDepartment({ ...newDepartment, subjects: Number(e.target.value) })}
            />
            <input
              type="text"
              placeholder="HOD"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newDepartment.hod}
              onChange={(e) => setNewDepartment({ ...newDepartment, hod: e.target.value })}
            />
            <input
              type="number"
              placeholder="Students"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={newDepartment.students}
              onChange={(e) => setNewDepartment({ ...newDepartment, students: Number(e.target.value) })}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={editingDepartment ? () => {
                  if (currentDepartmentCollegeId !== null) {
                    const collegeIndex = colleges.findIndex(col => col.id === currentDepartmentCollegeId);
                    if (collegeIndex !== -1) {
                      const updatedColleges = [...colleges];
                      updatedColleges[collegeIndex].departments = updatedColleges[collegeIndex].departments.map(dep => 
                        dep.id === editingDepartment.id ? { ...newDepartment, users: dep.users || [] } : dep
                      );
                      setColleges(updatedColleges);
                    }
                  }
                  resetNewDepartment();
                } : () => {
                  if (currentDepartmentCollegeId !== null) {
                    handleAddDepartment(currentDepartmentCollegeId);
                  }
                }}
              >
                {editingDepartment ? 'Update' : 'Add'}
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={resetNewDepartment}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this item?</h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageColleges;
