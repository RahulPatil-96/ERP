import { useState } from 'react';
import { Trash, Edit2, PlusCircle, BookOpen} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

// Course interface (just a basic structure, can be extended)
interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string; // Duration in hours (or any format)
  status: 'Active' | 'Inactive';
}

export function Courses() {
  // Initial mock courses data
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming with Python.',
      instructor: 'John Doe',
      duration: '10 hours',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Web Development with React',
      description: 'Master React for building modern web apps.',
      instructor: 'Jane Smith',
      duration: '15 hours',
      status: 'Inactive',
    },
  ]);

  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Course>({
    id: 0,
    title: '',
    description: '',
    instructor: '',
    duration: '',
    status: 'Active',
  });

  // Handle the "Add Course" functionality
  const addCourse = () => {
    const newId = Math.max(...courses.map(course => course.id)) + 1;
    setCourses([
      ...courses,
      { ...newCourse, id: newId },
    ]);
    setAddCourseModalOpen(false);
    setNewCourse({
      id: 0,
      title: '',
      description: '',
      instructor: '',
      duration: '',
      status: 'Active',
    });
  };

  // Handle the "Edit Course" functionality (just for simplicity, we won't implement editing in detail here)
  const editCourse = (id: number) => {
    const courseToEdit = courses.find(course => course.id === id);
    if (courseToEdit) {
      setNewCourse(courseToEdit);
      setAddCourseModalOpen(true);
    }
  };

  // Handle the "Delete Course" functionality
  const deleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Courses Management"
        subtitle="Manage all courses available in the system" 
        icon={BookOpen}
      />
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-8">
        {/* Courses List */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900">All Courses</h3>
          <div className="space-y-4 mt-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                  <p className="text-sm text-gray-600">Duration: {course.duration}</p>
                  <p className={`text-sm ${course.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                    {course.status}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => editCourse(course.id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Course Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setAddCourseModalOpen(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            <PlusCircle className="w-5 h-5 inline-block mr-2" />
            Add New Course
          </button>
        </div>

        {/* Add/Edit Course Modal */}
        {isAddCourseModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {newCourse.id ? 'Edit Course' : 'Add New Course'}
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Course Title"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Course Description"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Instructor</label>
                <input
                  type="text"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Instructor Name"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Duration</label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Course Duration"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Status</label>
                <select
                  value={newCourse.status}
                  onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value as 'Active' | 'Inactive' })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setAddCourseModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={addCourse}
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
