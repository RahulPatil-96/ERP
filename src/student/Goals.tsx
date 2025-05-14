import React, { useState, useEffect } from 'react';
import { Target, Plus, BarChart, Calendar, Clock, Trophy, Trash2, Edit } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parse, isBefore } from 'date-fns';

interface Milestone {
  id: number;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  category: string;
  completed: boolean;
  milestones: Milestone[];
  createdAt: string;
}

const CATEGORIES = ['Academic', 'Project', 'Personal'];

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Complete React Project',
    description: 'Build a fully functional React application with authentication.',
    deadline: '2025-03-15',
    progress: 50,
    category: 'Project',
    completed: false,
    milestones: [
      { id: 1, title: 'Set up React project', completed: true },
      { id: 2, title: 'Implement authentication', completed: false },
      { id: 3, title: 'Deploy app', completed: false },
    ],
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Study for Final Exams',
    description: 'Prepare for upcoming final exams in computer science.',
    deadline: '2025-04-01',
    progress: 20,
    category: 'Academic',
    completed: false,
    milestones: [
      { id: 1, title: 'Review Data Structures', completed: false },
      { id: 2, title: 'Practice Algorithms', completed: false },
    ],
    createdAt: '2025-01-25T08:30:00Z',
  },
  {
    id: '3',
    title: 'Run a Marathon',
    description: 'Train and complete a full marathon in the next six months.',
    deadline: '2025-08-20',
    progress: 30,
    category: 'Personal',
    completed: false,
    milestones: [
      { id: 1, title: 'Start Training', completed: true },
      { id: 2, title: 'Run 5km', completed: false },
      { id: 3, title: 'Run 10km', completed: false },
    ],
    createdAt: '2025-02-10T12:00:00Z',
  },
];

const initialFormState = {
  title: '',
  description: '',
  deadline: '',
  category: 'Academic',
  milestones: [] as string[],
};

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : initialGoals;
 });

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'progress'>('deadline');

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const filteredGoals = goals
    .filter(goal => {
      if (filter === 'completed') return goal.completed;
      if (filter === 'in-progress') return !goal.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return b.progress - a.progress;
    });

  const handleMilestoneToggle = (goalId: string, milestoneId: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        const completed = progress === 100;
        return { ...goal, milestones: updatedMilestones, progress, completed };
      }
      return goal;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: isEditing ? selectedGoal!.id : Date.now().toString(),
      ...formData,
      progress: 0,
      completed: false,
      milestones: formData.milestones
        .filter(m => m.trim())
        .map((title, i) => ({ id: i + 1, title, completed: false })),
      createdAt: isEditing ? selectedGoal!.createdAt : new Date().toISOString(),
    };

    setGoals(prev => (isEditing 
      ? prev.map(g => g.id === selectedGoal?.id ? newGoal : g)
      : [newGoal, ...prev]
    ));
    closeForm();
  };

  const openEditForm = (goal: Goal) => {
    let parsedDeadline = '';
    try {
      const date = goal.deadline ? parse(goal.deadline) : null;
      parsedDeadline = date ? format(date, 'yyyy-MM-dd') : '';
    } catch {
      parsedDeadline = '';
    }
    setFormData({
      title: goal.title,
      description: goal.description,
      deadline: parsedDeadline,
      category: goal.category,
      milestones: goal.milestones.map(m => m.title),
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setSelectedGoal(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormData(initialFormState);
  };

  const addMilestoneField = () => {
    setFormData(prev => ({ ...prev, milestones: [...prev.milestones, ''] }));
  };

  const updateMilestone = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => i === index ? value : m)
    }));
  };

  const stats = {
    completed: goals.filter(g => g.completed).length,
    inProgress: goals.filter(g => !g.completed && g.progress > 0).length,
    averageProgress: goals.length 
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
      : 0,
    overdue: goals.filter(g => {
      if (!g.deadline) return false;
      try {
        return !g.completed && isBefore(parse(g.deadline), new Date());
      } catch {
        return false;
      }
    }).length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals & Objectives"
        subtitle="Track your academic and personal goals"
        icon={Target} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed"
          value={`${stats.completed}/${goals.length}`}
          icon={<Trophy className="w-6 h-6" />}
          bgColor="bg-green-100"
          textColor="text-green-700"
          iconBg="bg-green-200" />
        <StatCard
          title="In Progress"
          value={stats.inProgress.toString()}
          icon={<Clock className="w-6 h-6" />}
          bgColor="bg-blue-100"
          textColor="text-blue-700"
          iconBg="bg-blue-200" />
        <StatCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
          icon={<BarChart className="w-6 h-6" />}
          bgColor="bg-purple-100"
          textColor="text-purple-700"
          iconBg="bg-purple-200" />
        <StatCard
          title="Overdue"
          value={stats.overdue.toString()}
          icon={<Calendar className="w-6 h-6" />}
          bgColor="bg-red-100"
          textColor="text-red-700"
          iconBg="bg-red-200" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterButton>
          <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')}>
            Completed
          </FilterButton>
          <FilterButton active={filter === 'in-progress'} onClick={() => setFilter('in-progress')}>
            In Progress
          </FilterButton>
        </div>
        <div className="flex gap-2">
          <SortButton active={sortBy === 'deadline'} onClick={() => setSortBy('deadline')}>
            Sort by Deadline
          </SortButton>
          <SortButton active={sortBy === 'progress'} onClick={() => setSortBy('progress')}>
            Sort by Progress
          </SortButton>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          layout
          className="cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowForm(true)}
        >
          <Card className="h-full flex items-center justify-center p-8 border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="text-center space-y-2">
              <div className="mx-auto bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium">Create New Goal</h3>
            </div>
          </Card>
        </motion.div>
        <AnimatePresence>
          {filteredGoals.map(goal => (
            <motion.div
              key={goal.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <GoalCard
                goal={goal}
                onClick={() => setSelectedGoal(goal)}
                onEdit={() => openEditForm(goal)}
                onDelete={() => deleteGoal(goal.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Goal Detail Modal */}
      <AnimatePresence>
        {selectedGoal && (
          <GoalDetailModal
            goal={selectedGoal}
            onClose={() => setSelectedGoal(null)}
            onToggleMilestone={handleMilestoneToggle}
          />
        )}
      </AnimatePresence>

      {/* New Goal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="w-full max-w-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEditing ? 'Edit Goal' : 'Create New Goal'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Milestones</label>
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => updateMilestone(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder={`Milestone ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          milestones: prev.milestones.filter((_, i) => i !== index)
                        }))}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMilestoneField}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Milestone
                  </button>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {isEditing ? 'Update Goal' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StatCard = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
  iconBg,
}: {
  title: string;
  value: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
  iconBg: string;
}) => (
  <Card className={`p-6 flex items-center justify-between ${bgColor}`}>
    <div className={`text-lg font-semibold ${textColor}`}>{title}</div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className={`w-8 h-8 rounded-full ${iconBg} ${textColor} flex items-center justify-center`}>
      {icon}
    </div>
  </Card>
);

const FilterButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded-full text-sm font-semibold ${active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
  >
    {children}
  </button>
);

const SortButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded-full text-sm font-semibold ${active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
  >
    {children}
  </button>
);

const GoalCard = ({ goal, onClick, onEdit, onDelete }: {
  goal: Goal;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
    <Card className="p-6 border rounded-lg shadow-lg" onClick={onClick}>

    <div className="flex justify-between">
      <div>
        <h3 className="font-semibold text-lg">{goal.title}</h3>
        <p className="text-gray-600">{goal.category}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onEdit} className="text-blue-600">
          <Edit className="w-5 h-5" />
        </button>
        <button onClick={onDelete} className="text-red-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-gray-600">{goal.description}</p>
      <p className="text-sm text-gray-500">Deadline: {goal.deadline}</p>
    </div>
  </Card>
);

// Assuming GoalDetailModal is defined elsewhere in your codebase
const GoalDetailModal = ({ goal, onClose, onToggleMilestone }: {
  goal: Goal;
  onClose: () => void;
  onToggleMilestone: (goalId: string, milestoneId: number) => void;
}) => (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50" onClick={onClose}>

    <Card className="w-full max-w-md p-6">
      <h2 className="text-xl font-semibold mb-4">{goal.title}</h2>
      <p className="text-gray-600">{goal.description}</p>
      <p className="text-sm text-gray-500">Deadline: {goal.deadline}</p>
      <h3 className="mt-4 font-semibold">Milestones</h3>
      <ul className="list-disc list-inside">
        {goal.milestones.map(milestone => (
          <li key={milestone.id} className={`flex items-center ${milestone.completed ? 'line-through' : ''}`}>
            <input
              type="checkbox"
              checked={milestone.completed}
              onChange={() => onToggleMilestone(goal.id, milestone.id)}
              className="mr-2"
            />
            {milestone.title}
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="mt-4 text-blue-600">Close</button>
    </Card>
  </div>
);
