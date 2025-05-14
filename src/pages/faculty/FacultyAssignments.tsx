import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Edit, Trash, Plus, Search, FileText, BookOpen, List, CheckSquare, Upload } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Textarea } from '../../components/common/Textarea';
import { DateTimePicker } from '../../components/common/DateTimePicker';

type AssignmentType = 'essay' | 'mcq' | 'file-upload' | 'code';
type QuestionType = { question: string; options?: string[]; correctAnswer?: string; points: number };

interface FacultyAssignment {
  id: string;
  title: string;
  course: string;
  type: AssignmentType;
  dueDate: string;
  status: 'draft' | 'published' | 'completed';
  instructions: string;
  points: number;
  questions?: QuestionType[];
  attachments: string[];
  allowedFormats?: string[];
  wordLimit?: number;
  maxFileSize?: number;
}

const initialAssignments: FacultyAssignment[] = [
  {
    id: '1',
    title: 'History Final Essay',
    course: 'HIST-101',
    type: 'essay',
    dueDate: '2024-06-15T23:59',
    status: 'published',
    instructions: 'Write a 1500-word essay on the causes of World War I',
    points: 100,
    wordLimit: 1500,
    attachments: ['essay_guidelines.pdf'],
  },
  {
    id: '2',
    title: 'Data Structures MCQ Test',
    course: 'CS-201',
    type: 'mcq',
    dueDate: '2024-05-30T12:00',
    status: 'draft',
    instructions: 'Multiple choice questions on data structures',
    points: 50,
    questions: [
      {
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
        correctAnswer: 'O(log n)',
        points: 10
      }
    ],
    attachments: [],
  },
  {
    id: '3',
    title: 'Biology Lab Report',
    course: 'BIO-202',
    type: 'file-upload',
    dueDate: '2024-06-10T23:59',
    status: 'published',
    instructions: 'Submit your lab report in PDF or DOCX format',
    points: 80,
    allowedFormats: ['.pdf', '.docx'],
    maxFileSize: 5,
    attachments: ['lab_template.docx'],
  },
  {
    id: '4',
    title: 'Python Programming Task',
    course: 'CS-301',
    type: 'code',
    dueDate: '2024-06-20T18:00',
    status: 'draft',
    instructions: 'Write a Python script to process data',
    points: 75,
    allowedFormats: ['.py'],
    maxFileSize: 2,
    attachments: ['data_sample.csv'],
  },
  {
    id: '5',
    title: 'Group Project: Marketing Plan',
    course: 'MKT-401',
    type: 'file-upload',
    dueDate: '2024-07-01T23:59',
    status: 'published',
    instructions: 'Submit a group marketing plan presentation in PDF format',
    points: 120,
    allowedFormats: ['.pdf'],
    maxFileSize: 10,
    attachments: ['project_guidelines.pdf'],
  },
  {
    id: '6',
    title: 'Timed Quiz: Algebra Basics',
    course: 'MATH-101',
    type: 'mcq',
    dueDate: '2024-05-25T10:00',
    status: 'published',
    instructions: 'Complete the timed quiz on algebra basics within 30 minutes',
    points: 40,
    questions: [
      {
        question: 'What is the solution to 2x + 3 = 7?',
        options: ['x=1', 'x=2', 'x=3', 'x=4'],
        correctAnswer: 'x=2',
        points: 10
      },
      {
        question: 'Simplify: (x^2 * x^3)',
        options: ['x^5', 'x^6', 'x^9', 'x^8'],
        correctAnswer: 'x^5',
        points: 10
      }
    ],
    attachments: [],
  },
  {
    id: '7',
    title: 'Peer Review: Literature Analysis',
    course: 'ENG-210',
    type: 'essay',
    dueDate: '2024-06-05T23:59',
    status: 'draft',
    instructions: 'Write a 1000-word analysis and review a peer’s essay',
    points: 90,
    wordLimit: 1000,
    attachments: [],
  },
];

export function FacultyAssignments() {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>(() => {
    // Clear localStorage on page load to always load initialAssignments
    localStorage.removeItem('assignments');
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'draft' | 'published' | 'completed'>('All');
  const [typeFilter, setTypeFilter] = useState<AssignmentType | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<FacultyAssignment | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || assignment.status === statusFilter;
    const matchesType = typeFilter === 'All' || assignment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAdd = (assignment: Omit<FacultyAssignment, 'id'>) => {
    setAssignments(prev => [...prev, { ...assignment, id: Date.now().toString() }]);
  };

  const handleEdit = (id: string, updatedAssignment: Omit<FacultyAssignment, 'id'>) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id ? { ...updatedAssignment, id } : assignment
      )
    );
  };

  const handleDelete = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    setDeleteCandidate(null);
  };

  const handleSubmit = (formData: Omit<FacultyAssignment, 'id'>) => {
    if (editingAssignment) {
      handleEdit(editingAssignment.id, formData);
    } else {
      handleAdd(formData);
    }
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Assignments"
        subtitle="Create and schedule academic assignments"
        icon={BookOpen}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        <Select
          value={statusFilter}
          onChange={(value: string) => setStatusFilter(value as any)}
          className="w-full sm:w-36"
        >
          <option value="All">All Statuses </option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={typeFilter}
          onChange={(value: string) => setTypeFilter(value as any)}
          className="w-full sm:w-36"
        >
          <option value="All">All Types</option>
          <option value="essay">Essay</option>
          <option value="mcq">MCQ</option>
          <option value="file-upload">File Upload</option>
          <option value="code">Code</option>
        </Select>
        
        <Button onClick={() => { setIsModalOpen(true); setEditingAssignment(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No assignments found matching your criteria
        </div>
      ) : (
        <TransitionGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(assignment => (
            <CSSTransition key={assignment.id} timeout={300} classNames="fade">
              <AssignmentCard
                assignment={assignment}
                onEdit={() => {
                  setEditingAssignment(assignment);
                  setIsModalOpen(true);
                }}
                onDelete={() => setDeleteCandidate(assignment.id)}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}

      <AssignmentFormModal
        isOpen={isModalOpen}
        initialData={editingAssignment}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? All associated data will be permanently removed."
        onConfirm={() => deleteCandidate && handleDelete(deleteCandidate)}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}

function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
}: {
  assignment: FacultyAssignment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const getTypeIcon = () => {
    switch (assignment.type) {
      case 'essay': return <FileText className="w-5 h-5" />;
      case 'mcq': return <List className="w-5 h-5" />;
      case 'file-upload': return <Upload className="w-5 h-5" />;
      case 'code': return <CheckSquare className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            {getTypeIcon()}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
        </div>
        <Badge variant={assignment.status === 'published' ? 'success' : assignment.status === 'draft' ? 'warning' : 'neutral'}>
          {assignment.status}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Course:</strong> {assignment.course}</p>
        <p>
          <strong>Due:</strong> {new Date(assignment.dueDate).toLocaleString()}
        </p>
        <p><strong>Points:</strong> {assignment.points}</p>
        {assignment.type === 'essay' && <p><strong>Word Limit:</strong> {assignment.wordLimit}</p>}
        {assignment.type === 'mcq' && <p><strong>Questions:</strong> {assignment.questions?.length || 0}</p>}
        {assignment.type === 'file-upload' && <p><strong>Allowed Formats:</strong> {assignment.allowedFormats?.join(', ')}</p>}
        {assignment.type === 'code' && <p><strong>Allowed Formats:</strong> {assignment.allowedFormats?.join(', ')}</p>}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash className="w-4 h-4 mr-2 text-red-600" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

function AssignmentFormModal({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  initialData?: FacultyAssignment | null;
  onClose: () => void;
  onSubmit: (data: Omit<FacultyAssignment, 'id'>) => void;
}) {
  const [formData, setFormData] = useState<Omit<FacultyAssignment, 'id'>>({
    title: '',
    course: '',
    type: 'essay',
    dueDate: new Date().toISOString(),
    status: 'draft',
    instructions: '',
    points: 100,
    attachments: [],
    questions: [],
    allowedFormats: [],
    wordLimit: undefined,
    maxFileSize: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 10,
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData({
        title: '',
        course: '',
        type: 'essay',
        dueDate: new Date().toISOString(),
        status: 'draft',
        instructions: '',
        points: 100,
        attachments: [],
        questions: [],
        allowedFormats: [],
        wordLimit: undefined,
        maxFileSize: undefined,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.points <= 0) newErrors.points = 'Points must be greater than zero';
    
    if (formData.type === 'mcq') {
      if ((formData.questions?.length || 0) === 0) {
        newErrors.questions = 'At least one question is required';
      } else {
        const hasInvalid = formData.questions?.some(q => !q.correctAnswer);
        if (hasInvalid) {
          newErrors.questions = 'All questions must have a correct answer selected';
        }
      }
    }

    if (formData.type === 'essay' && formData.wordLimit === undefined) {
      newErrors.wordLimit = 'Word limit is required';
    }

    if ((formData.type === 'file-upload' || formData.type === 'code') && formData.allowedFormats?.length === 0) {
      newErrors.allowedFormats = 'At least one allowed format is required';
    }

    if ((formData.type === 'file-upload' || formData.type === 'code') && formData.maxFileSize === undefined) {
      newErrors.maxFileSize = 'Max file size is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleAddQuestion = () => {
    if (
      currentQuestion.question.trim() &&
      currentQuestion.options?.every(opt => opt.trim()) &&
      currentQuestion.correctAnswer?.trim()
    ) {
      setFormData(prev => ({
        ...prev,
        questions: [...(prev.questions || []), currentQuestion],
      }));
      setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '', points: 10 });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.questions;
        return newErrors;
      });
    } else {
      setErrors(prev => ({ ...prev, questions: 'Please fill all fields and select a correct answer' }));
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions!.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Assignment' : 'Create New Assignment'}
    >
      <form onSubmit={handleSubmit} className ="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(value: string) => setFormData({ ...formData, title: value })}
            error={errors.title}
            required
          />

          <Input
            label="Course Code"
            value={formData.course}
            onChange={(value: string) => setFormData({ ...formData, course: value })}
            error={errors.course}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assignment Type"
            value={formData.type}
            onChange={(value: string) => setFormData({ ...formData, type: value as AssignmentType })}
          >
            <option value="essay">Essay</option>
            <option value="mcq">MCQ</option>
            <option value="file-upload">File Upload</option>
            <option value="code">Code</option>
          </Select>

          <DateTimePicker
            label="Due Date"
            value={formData.dueDate}
            onChange={(value: string) => setFormData({ ...formData, dueDate: value })}
            error={errors.dueDate}
            required
          />
        </div>

        <Input
          label="Points"
          type="number"
          value={formData.points.toString()}
          onChange={(value: string) => setFormData({ ...formData, points: Number(value) })}
          error={errors.points}
          required
        />

        <Textarea
          label="Instructions"
          value={formData.instructions}
          onChange={(value: string) => setFormData({ ...formData, instructions: value })}
        />

        {formData.type === 'essay' && (
          <Input
            label="Word Limit"
            type="number"
            value={formData.wordLimit?.toString() || ''}
            onChange={(value) => setFormData({ ...formData, wordLimit: Number(value) })}
            error={errors.wordLimit}
            required
          />
        )}

        {formData.type === 'file-upload' && (
          <div>
            <label>Allowed Formats</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  checked={formData.allowedFormats?.includes('.pdf')}
                  onChange={(e) => {
                    const formats = formData.allowedFormats || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, allowedFormats: [...formats, '.pdf'] });
                    } else {
                      setFormData({ ...formData, allowedFormats: formats.filter(f => f !== '.pdf') });
                    }
                  }}
                /> PDF
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.allowedFormats?.includes('.docx')}
                  onChange={(e) => {
                    const formats = formData.allowedFormats || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, allowedFormats: [...formats, '.docx'] });
                    } else {
                      setFormData({ ...formData, allowedFormats: formats.filter(f => f !== '.docx') });
                    }
                  }}
                /> DOCX
              </label>
            </div>
            <Input
              label="Max File Size (MB)"
              type="number"
              value={formData.maxFileSize?.toString() || ''}
              onChange={(value) => setFormData({ ...formData, maxFileSize: Number(value) })}
              error={errors.maxFileSize}
              required
            />
          </div>
        )}

        {formData.type === 'code' && (
          <div>
            <Input
              label="Allowed File Extensions (comma-separated)"
              value={formData.allowedFormats?.join(', ') || ''}
              onChange={(value) => setFormData({ ...formData, allowedFormats: value.split(',').map(s => s.trim()) })}
              error={errors.allowedFormats}
              required
            />
            <Input
              label="Max File Size (MB)"
              type="number"
              value={formData.maxFileSize?.toString() || ''}
              onChange={(value) => setFormData({ ...formData, maxFileSize: Number(value) })}
              error={errors.maxFileSize}
              required
            />
          </div>
        )}

        {formData.type === 'mcq' && (
          <div>
            <h4 className="font-semibold">Questions</h4>
            {errors.questions && <p className="text-red-500 text-sm">{errors.questions}</p>}
            {(formData.questions || []).map((q, index) => (
              <div key={index} className="border p-4 mb-2 rounded">
                <Input
                  label={`Question ${index + 1}`}
                  value={q.question}
                  onChange={(value: string) => {
                    const updatedQuestions = [...(formData.questions || [])];
                    updatedQuestions[index].question = value;
                    setFormData({ ...formData, questions: updatedQuestions });
                  }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options?.map((option, optIndex) => (
                    <Input
                      key={optIndex}
                      label={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(value: string) => {
                        const updatedQuestions = [...(formData.questions || [])];
                        updatedQuestions[index].options![optIndex] = value;
                        setFormData({ ...formData, questions: updatedQuestions });
                      }}
                    />
                  ))}
                </div>
                <Select
                  label="Correct Answer"
                  value={q.correctAnswer || ''}
                  onChange={(value: string) => {
                    const updatedQuestions = [...(formData.questions || [])];
                    updatedQuestions[index].correctAnswer = value;
                    setFormData({ ...formData, questions: updatedQuestions });
                  }}
                >
                  <option value="">Select Correct Answer</option>
                  {q.options?.map((option, optIndex) => (
                    <option key={optIndex} value={option}>{option}</option>
                  ))}
                </Select>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(index)}>
                  Remove Question
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                label="Question Text"
                value={currentQuestion.question}
                onChange={(value: string) => setCurrentQuestion({ ...currentQuestion, question: value })}
              />
              <Button onClick={handleAddQuestion}>Add Question</Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
}