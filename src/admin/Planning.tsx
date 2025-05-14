import { useState } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Form, Label } from 'reactstrap';
import { Calendar } from 'lucide-react'; // Calendar icon for header
import { Plus, CheckCircle, XCircle } from 'lucide-react'; // Icons for add task, complete and delete tasks
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for tasks/events
import { PageHeader } from '../../components/common/PageHeader';

const Planning = () => {
  const [tasks, setTasks] = useState<{ id: string; title: string; priority: string; deadline: string | null; completed: boolean }[]>([]); // Tasks with additional attributes
  const [eventList, setEventList] = useState<{ id: string; title: string; date: string; description: string }[]>([]); // Events with descriptions
  const [modalOpen, setModalOpen] = useState(false); // Modal state for task adding
  const [newTask, setNewTask] = useState(''); // New task input value
  const [newTaskPriority, setNewTaskPriority] = useState('Medium'); // Priority level of new task
  const [newTaskDeadline, setNewTaskDeadline] = useState<string | null>(''); // Deadline for the task
  const [newEvent, setNewEvent] = useState<{ title: string; date: string; description: string }>({ title: '', date: '', description: '' }); // New event info

  // Toggle modal visibility
  const toggleModal = () => setModalOpen(!modalOpen);

  // Add a new task
  const addTask = () => {
    if (newTask) {
      setTasks([
        ...tasks,
        {
          id: uuidv4(),
          title: newTask,
          priority: newTaskPriority,
          deadline: newTaskDeadline,
          completed: false,
        },
      ]);
      setNewTask('');
      setNewTaskPriority('Medium');
      setNewTaskDeadline('');
    }
  };

  // Mark task as completed
  const markTaskAsCompleted = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Add a new event
  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEventList([
        ...eventList,
        { id: uuidv4(), title: newEvent.title, date: newEvent.date, description: newEvent.description },
      ]);
      setNewEvent({ title: '', date: '', description: '' });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Planning Dashboard"
        subtitle="Manage your tasks and events efficiently."
        icon={Calendar}
        />
      <div className="max-w-6xl mx-auto p-8 rounded-xl shadow-lg bg-white">
        {/* Task Management Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
          <div className="flex justify-between items-center mb-4">
            <Button color="primary" onClick={toggleModal} className="flex items-center">
              <Plus size={18} className="mr-2" /> Add Task
            </Button>
            <div className="w-full max-w-md mt-4">
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`flex justify-between items-center p-3 border rounded-lg ${task.completed ? 'bg-green-100' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      <Button
                        color={task.completed ? 'success' : 'secondary'}
                        size="sm"
                        onClick={() => markTaskAsCompleted(task.id)}
                        className="mr-2"
                      >
                        {task.completed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </Button>
                      <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                    </div>
                    <Button color="danger" size="sm" onClick={() => deleteTask(task.id)}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Event Management Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
              <input
                type="text"
                className="p-2 border rounded-md w-full lg:w-1/3 mb-3 lg:mb-0"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="date"
                className="p-2 border rounded-md w-full lg:w-1/3 mb-3 lg:mb-0"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <textarea
                className="p-2 border rounded-md w-full lg:w-1/3 mb-3 lg:mb-0"
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <Button color="primary" onClick={addEvent} className="ml-4 mt-2 lg:mt-0">
                Add Event
              </Button>
            </div>
            <ul className="space-y-2">
              {eventList.map((event) => (
                <li key={event.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-semibold">{event.title}</span>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-sm text-gray-700">{event.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Calendar size={24} className="mr-2" /> Upcoming Tasks & Events Calendar
          </h2>
          <div className="bg-gray-200 p-6 rounded-lg">
            <p className="text-lg">This is where your calendar will be displayed.</p>
            {/* Here you could use a calendar library or custom logic */}
          </div>
        </div>
      </div>

      {/* Modal for Adding Task */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Add New Task</ModalHeader>
        <ModalBody className="p-4">
          <Form>
            <Label for="task-title">Task Title</Label>
            <Input
              id="task-title"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description"
              className="mb-3"
            />
            <Label for="task-priority">Priority</Label>
            <select
              id="task-priority"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="p-2 border rounded-md w-full mb-3"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <Label for="task-deadline">Deadline</Label>
            <Input
              id="task-deadline"
              type="date"
              value={newTaskDeadline || ''}
              onChange={(e) => setNewTaskDeadline(e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addTask}>
            Add Task
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Planning;
