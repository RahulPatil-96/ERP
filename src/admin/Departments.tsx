import { useState } from 'react';
import { PlusCircle, Edit2, Trash, BuildingIcon} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

// Define interface for department data
interface Department {
  id: number;
  name: string;
  description: string;
  head: string;
}

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: 'Engineering',
      description: 'Responsible for developing products and systems.',
      head: 'John Doe',
    },
    {
      id: 2,
      name: 'Marketing',
      description: 'Handles advertising, promotions, and public relations.',
      head: 'Jane Smith',
    },
  ]);

  const [isAddDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState<Department>({
    id: 0,
    name: '',
    description: '',
    head: '',
  });

  // Handle adding a new department
  const addDepartment = () => {
    const newId = Math.max(...departments.map(dep => dep.id)) + 1;
    setDepartments([...departments, { ...newDepartment, id: newId }]);
    setAddDepartmentModalOpen(false);
    setNewDepartment({
      id: 0,
      name: '',
      description: '',
      head: '',
    });
  };

  // Handle editing a department
  const editDepartment = (id: number) => {
    const departmentToEdit = departments.find(dep => dep.id === id);
    if (departmentToEdit) {
      setNewDepartment(departmentToEdit);
      setAddDepartmentModalOpen(true);
    }
  };

  // Handle deleting a department
  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(dep => dep.id !== id));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Department Management"
        subtitle="Manage your organization's departments and their heads"
        icon={BuildingIcon}
      />
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-8">
        {/* Department List */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900">All Departments</h3>
          <div className="space-y-4 mt-4">
            {departments.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{dep.name}</h4>
                  <p className="text-sm text-gray-600">{dep.description}</p>
                  <p className="text-sm text-gray-600">Head: {dep.head}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => editDepartment(dep.id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteDepartment(dep.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Department Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setAddDepartmentModalOpen(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            <PlusCircle className="w-5 h-5 inline-block mr-2" />
            Add New Department
          </button>
        </div>

        {/* Add/Edit Department Modal */}
        {isAddDepartmentModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {newDepartment.id ? 'Edit Department' : 'Add New Department'}
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Department Name</label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Department Name"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Department Description"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Head</label>
                <input
                  type="text"
                  value={newDepartment.head}
                  onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Department Head"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setAddDepartmentModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={addDepartment}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
