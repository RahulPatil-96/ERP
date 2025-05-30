import { useState, useEffect } from 'react';
import { FileText, Upload, Clock, CheckCircle, XCircle, Download, AlertTriangle, Code2, Flag } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/button';
import { motion, AnimatePresence } from 'framer-motion';
import { AssignmentCard } from '../../components/common/AssignmentCard';

// Types
interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'late';
  score: number | null;
  description: string;
  attachments: string[];
}

interface MCQTest extends Assignment {
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }[];
  timeLimit: number;
}

// Mock Data
const MCQ_TESTS: MCQTest[] = [
  {
    id: 1,
    title: 'Advanced JavaScript Concepts',
    subject: "JavaScript",
    dueDate: '2025-03-10T12:00:00Z',
    status: 'pending',
    score: null,
    description: 'Test your knowledge of modern JavaScript features',
    attachments: [],
    timeLimit: 45,
    questions: [
      {
        question: 'What is the output of "typeof null" in JavaScript?',
        options: ['"object"', '"null"', '"undefined"', '"boolean"'],
        correctAnswer: '"object"',
        explanation: 'This is a known JavaScript quirk dating back to the first version of the language.'
      },
      {
        question: 'Which method creates a new array with all sub-array elements concatenated?',
        options: ['Array.prototype.flat()', 'Array.prototype.join()', 'Array.prototype.concat()', 'Array.prototype.merge()'],
        correctAnswer: 'Array.prototype.flat()'
      },
      {
        question: 'What does the event loop prioritize in Node.js?',
        options: [
          'Microtask queue (process.nextTick)',
          'Macrotask queue (setTimeout)',
          'I/O operations',
          'All queues are equal'
        ],
        correctAnswer: 'Microtask queue (process.nextTick)',
        explanation: 'The event loop processes microtasks before macrotasks in each iteration.'
      },
      {
        question: 'What is the purpose of the Symbol type in ES6?',
        options: [
          'Create unique identifiers',
          'Handle floating point numbers',
          'Replace string constants',
          'Manage memory allocation'
        ],
        correctAnswer: 'Create unique identifiers'
      },
      {
        question: 'Which of these is NOT a JavaScript runtime?',
        options: ['Deno', 'Bun', 'Node.js', 'Rust'],
        correctAnswer: 'Rust',
        explanation: 'Rust is a systems programming language, not a JavaScript runtime.'
      },
      {
        question: 'What does the "new" keyword do in JavaScript?',
        options: [
          'Creates a new object instance',
          'Allocates memory for a new variable',
          'Declares a new class',
          'Initializes a new array'
        ],
        correctAnswer: 'Creates a new object instance'
      },
      {
        question: 'What is the purpose of the Virtual DOM in React?',
        options: [
          'Optimize UI updates',
          'Handle server-side rendering',
          'Manage state transitions',
          'Implement security policies'
        ],
        correctAnswer: 'Optimize UI updates'
      },
      {
        question: 'Which concept is demonstrated by Promises?',
        options: [
          'Asynchronous programming',
          'Object composition',
          'Memory management',
          'Synchronous iteration'
        ],
        correctAnswer: 'Asynchronous programming'
      },
      {
        question: 'What is the purpose of Webpack?',
        options: [
          'Module bundling',
          'State management',
          'DOM manipulation',
          'API testing'
        ],
        correctAnswer: 'Module bundling'
      },
      {
        question: 'What does CORS stand for?',
        options: [
          'Cross-Origin Resource Sharing',
          'Cross-Origin Request Security',
          'Client-Side Resource Sharing',
          'Content Origin Resolution System'
        ],
        correctAnswer: 'Cross-Origin Resource Sharing'
      }
    ]
  }
];

const ASSIGNMENTS: Assignment[] = [
  {
    id: 2,
    title: 'React Component Patterns',
    subject: 'React',
    dueDate: '2025-03-05T12:00:00Z',
    status: 'pending',
    score: null,
    description: 'Implement advanced React component patterns',
    attachments: ['assignment-spec.pdf'],
  },
  {
    id: 3,
    title: 'Node.js Architecture',
    subject: 'Node.js',
    dueDate: '2025-03-07T12:00:00Z',
    status: 'submitted',
    score: 92,
    description: 'Design a scalable Node.js architecture',
    attachments: ['architecture-diagram.pdf'],
  },
];

// Helper Functions
const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  const isPast = date < new Date();
  const formatted = date.toLocaleDateString();
  const distance = isPast ? 'Late' : `Due in ${Math.ceil((date.getTime() - Date.now()) / (1000 * 3600 * 24))} days`;

  return { formatted, distance, isPast };
};

const getSubjectIcon = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'react':
      return <Code2 className="w-5 h-5" />;
    case 'node.js':
      return <Code2 className="w-5 h-5" />;
    default:
      return <Code2 className="w-5 h-5" />;
  }
};

// Components
const StatBox = ({ icon: Icon, title, value }: { icon: any, title: string, value: string | number }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-600">{title}</span>
    </div>
    <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

const EnhancedMCQTest = ({ test }: { test: MCQTest }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [reviewedQuestions, setReviewedQuestions] = useState<{ [key: number]: boolean }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Statistics
  const answeredCount = Object.keys(selectedAnswers).length;
  const reviewCount = Object.keys(reviewedQuestions).length;
  const unansweredCount = test.questions.length - answeredCount;

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSubmitted && timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const handleOptionChange = (questionId: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const toggleReview = () => {
    setReviewedQuestions(prev => ({
      ...prev,
      [currentQuestion]: !prev[currentQuestion]
    }));
  };

  const handleSubmit = () => {
    const correct = test.questions.filter(
      (q, idx) => selectedAnswers[idx] === q.correctAnswer
    ).length;
    setScore(correct);
    setIsSubmitted(true);
  };

  const getQuestionStatus = (index: number) => {
    if (selectedAnswers[index] !== undefined) {
      return reviewedQuestions[index] ? 'answered-reviewed' : 'answered';
    }
    return reviewedQuestions[index] ? 'review' : 'unanswered';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatBox icon={Clock} title="Time Left" value={formatTime(timeLeft)} />
        <StatBox icon={CheckCircle} title="Answered" value={answeredCount} />
        <StatBox icon={Flag} title="Marked Review" value={reviewCount} />
        <StatBox icon={AlertTriangle} title="Unanswered" value={unansweredCount} />
      </div>

      {/* Question Navigation */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {test.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`p-2 rounded transition-all ${
              currentQuestion === idx ? 'ring-2 ring-indigo-500' : ''
            } ${
              {
                'answered-reviewed': 'bg-blue-100 text-blue-800',
                'answered': 'bg-green-100 text-green-800',
                'review': 'bg-yellow-100 text-yellow-800',
                'unanswered': 'bg-gray-100 text-gray-600'
              }[getQuestionStatus(idx)]
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Question {currentQuestion + 1}</h3>
          <Button
            variant="outline"
            onClick={toggleReview}
            active={reviewedQuestions[currentQuestion]}
          >
            <Flag className="w-4 h-4 mr-2" />
            {reviewedQuestions[currentQuestion] ? 'Unmark Review' : 'Mark for Review'}
          </Button>
        </div>

        <p className="text-lg text-gray-800">{test.questions[currentQuestion].question}</p>
        
        <div className="space-y-2">
          {test.questions[currentQuestion].options.map(option => (
            <label
              key={option}
              className={`flex items-center p-3 rounded-lg border ${
                !isSubmitted ? 'hover:border-indigo-300 ' : ''
              } ${
                isSubmitted && option === test.questions[currentQuestion].correctAnswer
                  ? 'border-green-200 bg-green-50'
                  : isSubmitted && selectedAnswers[currentQuestion] === option
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option}
                checked={selectedAnswers[currentQuestion] === option}
                onChange={() => handleOptionChange(currentQuestion, option)}
                className="mr-3"
                disabled={isSubmitted}
              />
              <span className={`${isSubmitted && option === test.questions[currentQuestion].correctAnswer ? 'text-green-600 font-bold' : ''} ${isSubmitted && selectedAnswers[currentQuestion] === option && option !== test.questions[currentQuestion].correctAnswer ? 'text-red-600 line-through' : ''}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between">
        <Button onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))} disabled={currentQuestion === 0 || isSubmitted}>
          ← Previous
        </Button>
        <Button onClick={() => setCurrentQuestion(prev => Math.min(test.questions.length - 1, prev + 1))} disabled={currentQuestion === test.questions.length - 1 || isSubmitted}>
          Next →
        </Button>
      </div>

      {/* Submission Controls */}
      {!isSubmitted && (
        <Button onClick={() => setShowConfirmSubmit(true)} className="w-full mt-4" variant="default">
          Submit Test
        </Button>
      )}

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Submission</h3>
            <p className="mb-4">
              {unansweredCount > 0 || reviewCount > 0
                ? `You have ${unansweredCount} unanswered questions and ${reviewCount} marked for review. Are you sure you want to submit?`
                : 'Are you sure you want to submit your test?'}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowConfirmSubmit(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={() => { handleSubmit(); setShowConfirmSubmit(false); }} variant="destructive" className="flex-1">Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Correct Answers</p>
                <p className="text-2xl font-bold">{score}/{test.questions.length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Time Taken</p>
                <p className="text-2xl font-bold">{Math.floor((test.timeLimit * 60 - timeLeft) / 60)}m {timeLeft % 60}s</p>
              </div>
            </div>

            {/* Detailed Question Breakdown */}
            <h3 className="text-lg font-semibold mb-2">Question Breakdown</h3>
            <ul className="space-y-2">
              {test.questions.map((q, idx) => (
                <li key={idx} className={`flex justify-between p-2 rounded-lg ${selectedAnswers[idx] === q.correctAnswer ? 'bg-green-100' : 'bg-red-100'}`}>
                  <span>{q.question}</span>
                  <span className={`font-bold ${selectedAnswers[idx] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedAnswers[idx] ?? 'Not answered'} (Correct: {q.correctAnswer}) {reviewedQuestions[idx] ? '(Marked for Review)' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// File Uploader Component
const FileUploader = ({ files, onUpload, onRemove, onSubmit, status }: { 
  files: File[];
  onUpload: (files: FileList) => void;
  onRemove: (file: File) => void;
  onSubmit: () => void;
  status: 'idle' | 'submitting' | 'success' | 'error';
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(e.type === 'dragenter');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) onUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">Drag and drop files here</p>
            <p className="text-sm text-gray-500">PDF, DOCX, PPTX, ZIP (max 100MB)</p>
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => e.target.files && onUpload(e.target.files)}
            className="hidden"
            id="file-upload"
            disabled={status === 'submitting'}
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50"
          >
            Browse Files
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)}MB</p>
                </div>
              </div>
              <button
                onClick={() => onRemove(file)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={onSubmit}
        className="w-full"
        variant="default"
        disabled={files.length === 0 || status === 'submitting'}
      >
        Submit Assignment
      </Button>

      {status === 'success' && (
        <div className="mt-4 text-emerald-600 text-sm flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Assignment submitted successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 text-red-600 text-sm flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Error submitting assignment. Please try again.
        </div>
      )}
    </div>
  );
};

// Main Assignments Component
export function Assignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const selectedAssignmentData = ASSIGNMENTS.find(a => a.id === selectedAssignment);
  const selectedTestData = MCQ_TESTS.find(test => test.id === selectedTest);

  const handleFileUpload = (files: FileList) => {
    setUploadedFiles(prev => [...prev, ...Array.from(files)]);
  };

  const handleSubmit = async () => {
    setSubmissionStatus('submitting');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmissionStatus('success');
      setUploadedFiles([]);
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  useEffect(() => {
    if (submissionStatus === 'success') {
      const timer = setTimeout(() => setSubmissionStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assignments"
        subtitle="Manage your academic tasks efficiently"
        icon={FileText}
      />

      <AnimatePresence mode="wait">
        {!selectedAssignment && !selectedTest ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ASSIGNMENTS.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onSelect={() => setSelectedAssignment(assignment.id)}
              />
            ))}
            {MCQ_TESTS.map((test) => (
              <Card key={test.id} className="h-full transition-all hover:ring-2 hover:ring-indigo-100">
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                  <Button onClick={() => setSelectedTest(test.id)} className="mt-4">
                    Take Test
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        ) : selectedTest ? (
          <motion.div
            key="test-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <EnhancedMCQTest test={selectedTestData!} />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedAssignment(null)}
                  className="group hover:bg-gray-50"
                >
                  <span className="mr-1 transition-transform group-hover:-translate-x-1">←</span>
                  Back to Assignments
                </Button>
                {selectedAssignmentData && (
                  <div className="flex items-center text-sm text-gray-500 ">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Due: {formatDueDate(selectedAssignmentData.dueDate).formatted}
                    </span>
                  </div>
                )}
              </div>

              {selectedAssignmentData && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                        {getSubjectIcon(selectedAssignmentData.subject)}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                          {selectedAssignmentData.title}
                        </h1>
                        <p className="text-gray-600">
                          {selectedAssignmentData.subject}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {selectedAssignmentData.description}
                    </p>
                  </div>

                  {selectedAssignmentData.attachments.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Attachments
                      </h3>
                      <div className="grid gap-2">
                        {selectedAssignmentData.attachments.map((attachment) => (
                          <div
                            key={attachment}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">{attachment}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <FileUploader
                    files={uploadedFiles}
                    onUpload={handleFileUpload}
                    onRemove={(file) => setUploadedFiles(files => files.filter(f => f !== file))}
                    onSubmit={handleSubmit}
                    status={submissionStatus}
                  />
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}