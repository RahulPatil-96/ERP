import { useState, useEffect } from 'react';
import { Download, BookOpenCheck, CalendarCheck, AlertTriangle, FileText } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

type ExamType = 'mid' | 'end';
type ExamStatus = 'upcoming' | 'ongoing' | 'completed';
type Grade = {
  course: string;
  score: number;
  grade: string;
  gradePoints: number;
};

type Exam = {
  id: string;
  type: ExamType;
  semester: string;
  courses: string[];
  formStatus: 'not-started' | 'in-progress' | 'submitted';
  hallTicket: string | null;
  grades: Grade[] | null;
  examDate: string;
  status: ExamStatus;
  isReExam: boolean;
};

export default function Examination() {
  const [activeTab, setActiveTab] = useState<ExamType>('mid');
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '2025-mid',
      type: 'mid',
      semester: 'Spring 2025',
      courses: ['Mathematics', 'Computer Science', 'Physics'],
      formStatus: 'submitted',
      hallTicket: '/hallticket.pdf',
      grades: null,
      examDate: '2025-04-15',
      status: 'completed',
      isReExam: false
    },
    {
      id: '2025-end',
      type: 'end',
      semester: 'Spring 2025',
      courses: ['Mathematics', 'Computer Science', 'Physics'],
      formStatus: 'not-started',
      hallTicket: null,
      grades: null,
      examDate: '2025-06-20',
      status: 'upcoming',
      isReExam: false
    }
  ]);

  useEffect(() => {
    const generateGrades = (courses: string[]): Grade[] => {
      return courses.map(course => {
        const score = Math.floor(Math.random() * 40) + 60;
        return { course, score, ...getGradeFromScore(score) };
      });
    };

    setExams(exams.map(exam => ({
      ...exam,
      grades: exam.status === 'completed' ? generateGrades(exam.courses) : exam.grades
    })));
  }, []);

  const getGradeFromScore = (score: number) => {
    if (score >= 90) return { grade: 'A+', gradePoints: 4.0 };
    if (score >= 80) return { grade: 'A', gradePoints: 3.5 };
    if (score >= 70) return { grade: 'B+', gradePoints: 3.0 };
    if (score >= 60) return { grade: 'B', gradePoints: 2.5 };
    return { grade: 'C', gradePoints: 2.0 };
  };

  const handleFormSubmit = (examId: string) => {
    setExams(exams.map(exam => 
      exam.id === examId ? { 
        ...exam, 
        formStatus: 'submitted',
        hallTicket: '/hallticket.pdf'
      } : exam
    ));
  };

  const generateGradeCard = (exam: Exam) => {
    const pdfContent = `
      ${exam.semester} Grade Card
      ----------------------------------
      Student: John Doe
      Enrollment: 123456
      Exam Type: ${exam.type.toUpperCase()} SEMESTER ${exam.isReExam ? '(Re-Exam)' : ''}
      
      ${exam.grades?.map(g => 
        `${g.course}: ${g.score}% - ${g.grade} (${g.gradePoints})`
      ).join('\n')}
      
      SGPA: ${calculateSGPA(exam.grades || [])}
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.semester}-grade-card.txt`;
    link.click();
  };

  const calculateSGPA = (grades: Grade[]) => {
    return (grades.reduce((sum, g) => sum + g.gradePoints, 0) / grades.length).toFixed(2);
  };

  const currentExam = exams.find(e => e.type === activeTab) || exams[0];

  return (
    <div className="space-y-8">
          <PageHeader
        title="Examination Portal"
        subtitle="Manage your exam registrations, hall tickets, and grade cards"
        icon={BookOpenCheck}
      /> 
      
      <nav className="flex gap-4 mb-8 border-b border-gray-200">
        {['mid', 'end'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as ExamType)}
            className={`pb-2 px-4 font-medium ${
              activeTab === tab 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Semester
          </button>
        ))}
      </nav>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="p-6 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <CalendarCheck className="text-blue-600" />
            <h3 className="font-semibold">Exam Date</h3>
          </div>
          <p className="text-gray-700">
            {new Date(currentExam.examDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="p-6 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="text-yellow-600" />
            <h3 className="font-semibold">Registration Status</h3>
          </div>
          <span className={`px-2 py-1 rounded ${currentExam.formStatus === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {currentExam.formStatus.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <div className="p-6 bg-red-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-red-600" />
            <h3 className="font-semibold">Important Notes</h3>
          </div>
          <p className="text-sm text-gray-700">
            {currentExam.hallTicket 
              ? 'Valid ID proof required at exam center'
              : 'Complete registration to access hall ticket'}
          </p>
        </div>
      </div>

      {currentExam.formStatus !== 'submitted' ? (
        <ExamForm exam={currentExam} onSubmit={handleFormSubmit} />
      ) : (
        <div className="space-y-8">
          <HallTicketSection exam={currentExam} />
          
          {currentExam.grades && (
            <GradeCardSection 
              exam={currentExam} 
              onGenerate={() => generateGradeCard(currentExam)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ExamForm({ exam, onSubmit }: { exam: Exam, onSubmit: (id: string) => void }) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length === 0) {
      alert('Please select at least one course');
      return;
    }
    onSubmit(exam.id);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Exam Registration Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Select Courses</label>
          <div className="grid gap-2">
            {exam.courses.map(course => (
              <label key={course} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course)}
                  onChange={e => {
                    const selected = e.target.checked
                      ? [...selectedCourses, course]
                      : selectedCourses.filter(c => c !== course);
                    setSelectedCourses(selected);
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{course}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Upload Documents</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-600">Upload scanned copies of:</p>
            <ul className="mt-2 text-sm text-gray-500">
              <li>• ID Proof (Aadhar/Passport)</li>
              <li>• Recent Passport Photo</li>
              <li>• Signature</li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover: bg-blue-700 transition duration-200"
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
}

function HallTicketSection({ exam }: { exam: Exam }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Hall Ticket</h2>
      {exam.hallTicket ? (
        <a href={exam.hallTicket} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          Download Hall Ticket
        </a>
      ) : (
        <p className="text-gray-500">Hall ticket will be available after registration.</p>
      )}
    </div>
  );
}

function GradeCardSection({ exam, onGenerate }: { exam: Exam, onGenerate: () => void }) {
  const calculateSGPA = (grades: Grade[]) => {
    const totalPoints = grades.reduce((sum, grade) => sum + grade.gradePoints, 0);
    return (totalPoints / grades.length).toFixed(2);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Grade Card - {exam.semester}</h2>
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <Download size={18} />
          Download Grade Card
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Points</th>
            </tr>
          </thead>
          <tbody>
            {exam.grades?.map((grade, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">{grade.course}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{grade.score}%</td>
                <td className="px-4 py-3 text-sm text-gray-700">{grade.grade}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{grade.gradePoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Semester GPA (SGPA):</span>
          <span className="text-lg font-bold text-blue-600">
            {calculateSGPA(exam.grades || [])}
          </span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium mb-2">Legend:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>A+ : 90-100% (4.0 points)</div>
          <div>A : 80-89% (3.5 points)</div>
          <div>B+ : 70-79% (3.0 points)</div>
          <div>B : 60-69% (2.5 points)</div>
          <div>C : Below 60% (2.0 points)</div>
        </div>
      </div>
    </div>
  );
}