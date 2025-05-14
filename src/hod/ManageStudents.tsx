import { useState, useMemo } from 'react';
import { 
  UsersIcon, 
  BookOpenIcon,
  AwardIcon,
  GraduationCapIcon,
  CalendarIcon,
  PlusIcon,
  SearchIcon
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import StudentForm from '../../components/common/StudentForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/Tabs';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/common/Table';
import { useToast } from '../../hooks/useToast';
import { Skeleton } from '../../components/common/Skeleton';

interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Leave';
}

interface Student {
  id: number;
  name: string;
  academicId: string;
  email: string;
  phone: string;
  batch: string;
  semester: number;
  gpa: number;
  backlogs: number;
  attendance: AttendanceRecord[];
  classAdvisor: string | null;
  redFlags: string[];
}

const initialStudents: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      academicId: 'CS101',
      email: 'john.doe@university.edu',
      phone: '+1 555-123-4567',
      batch: '2023',
      semester: 5,
      gpa: 3.5,
      backlogs: 0,
      attendance: [
        { date: '2023-10-01', status: 'Present' },
        { date: '2023-10-02', status: 'Absent' },
        { date: '2023-10-03', status: 'Present' },
      ],
      classAdvisor: 'Dr. Alice Johnson',
      redFlags: [],
    },
    {
      id: 2,
      name: 'Jane Smith',
      academicId: 'CS102',
      email: 'jane.smith@university.edu',
      phone: '+1 555-987-6543',
      batch: '2022',
      semester: 6,
      gpa: 3.9,
      backlogs: 0,
      attendance: [
        { date: '2023-10-01', status: 'Present' },
        { date: '2023-10-02', status: 'Present' },
        { date: '2023-10-03', status: 'Present' },
      ],
      classAdvisor: 'Dr. Robert Lee',
      redFlags: [],
    },
    {
      id: 3,
      name: 'Emily Carter',
      academicId: 'CS103',
      email: 'emily.carter@university.edu',
      phone: '+1 555-456-7890',
      batch: '2024',
      semester: 3,
      gpa: 2.8,
      backlogs: 2,
      attendance: [
        { date: '2023-10-01', status: 'Leave' },
        { date: '2023-10-02', status: 'Present' },
        { date: '2023-10-03', status: 'Absent' },
      ],
      classAdvisor: 'Dr. Alice Johnson',
      redFlags: ['Low GPA', 'Multiple Backlogs'],
    },
    {
      id: 4,
      name: 'Michael Nguyen',
      academicId: 'CS104',
      email: 'michael.nguyen@university.edu',
      phone: '+1 555-321-6789',
      batch: '2021',
      semester: 7,
      gpa: 3.2,
      backlogs: 1,
      attendance: [
        { date: '2023-10-01', status: 'Present' },
        { date: '2023-10-02', status: 'Leave' },
        { date: '2023-10-03', status: 'Present' },
      ],
      classAdvisor: 'Dr. Nisha Patel',
      redFlags: ['Pending Backlog'],
    },
    {
      id: 5,
      name: 'Sara Ali',
      academicId: 'CS105',
      email: 'sara.ali@university.edu',
      phone: '+1 555-222-3333',
      batch: '2023',
      semester: 5,
      gpa: 4.0,
      backlogs: 0,
      attendance: [
        { date: '2023-10-01', status: 'Present' },
        { date: '2023-10-02', status: 'Present' },
        { date: '2023-10-03', status: 'Present' },
      ],
      classAdvisor: 'Dr. Robert Lee',
      redFlags: [],
    },
  ];
  

export function StudentManagement() {
  const { toast } = useToast();
  const [studentList, setStudentList] = useState<Student[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  const filteredStudents = useMemo(() => {
    return studentList.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.academicId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [studentList, searchQuery]);

  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    setStudentList(prev => [...prev, { ...newStudent, id: prev.length + 1 }]);
    setIsEditModalOpen(false);
    toast({ title: 'Student added successfully', variant: 'success' });
  };

  const handleUpdateStudent = (updatedStudent: Student | Omit<Student, 'id'>) => {
    if ('id' in updatedStudent) {
      setStudentList(prev => 
        prev.map(s => s.id === updatedStudent.id ? updatedStudent as Student : s)
      );
    } else {
      handleAddStudent(updatedStudent);
      return;
    }
    setIsEditModalOpen(false);
    toast({ title: 'Student updated successfully', variant: 'success' });
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Student Management"
        subtitle="Comprehensive student administration system"
        icon={UsersIcon}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xl">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            className="pl- 10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="directory" className="gap-2">
            <UsersIcon className="w-4 h-4" />
            Directory
          </TabsTrigger>
          <TabsTrigger value="academic-progress" className="gap-2">
            <BookOpenIcon className="w-4 h-4" />
            Academic Progress
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="red-flags" className="gap-2">
            <AwardIcon className="w-4 h-4" />
            Red Flags
          </TabsTrigger>
          <TabsTrigger value="class-advisors" className="gap-2">
            <GraduationCapIcon className="w-4 h-4" />
            Class Advisors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="w-[30%]">Student Name</div>
                  </TableHead>
                  <TableHead>Academic ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{student.name}</div>
                      </TableCell>
                      <TableCell>{student.academicId}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>{student.batch}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsViewModalOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td colSpan={6} className="h-24 text-center text-muted-foreground">
                      No students found
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="academic-progress">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="w-[30%]">Student Name</div>
                  </TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Backlogs</TableHead>
                  <TableHead>Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell>{student.gpa}</TableCell>
                    <TableCell>{student.backlogs}</TableCell>
                    <TableCell>{ student.semester}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  student.attendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{format(new Date(record.date), 'MMMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'Present' ? 'success' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="red-flags">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="w-[30%]">Student Name</div>
                  </TableHead>
                  <TableHead>Red Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell>
                      {student.redFlags.length > 0 ? (
                        student.redFlags.map((flag, index) => (
                          <Badge key={index} variant="warning" className="mr-1">{flag}</Badge>
                        ))
                      ) : (
                        <span>No red flags</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="class-advisors">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="w-[30%]">Student Name</div>
                  </TableHead>
                  <TableHead>Class Advisor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell>{student.classAdvisor || 'No advisor assigned'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {isViewModalOpen && selectedStudent && (
        <Modal 
          isOpen={isViewModalOpen}
          title={`${selectedStudent.name} Details`}
          onClose={() => setIsViewModalOpen(false)}
        >
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{selectedStudent.name} Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <p><strong>Academic ID:</strong> {selectedStudent.academicId}</p>
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                    <p><strong>Batch:</strong> {selectedStudent.batch}</p>
                    <p><strong>Semester:</strong> {selectedStudent.semester}</p>
                    <p><strong>GPA:</strong> {selectedStudent.gpa}</p>
                    <p><strong>Backlogs:</strong> {selectedStudent.backlogs}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Attendance Records</h4>
                  <Table>
                    <TableHeader>
                      < TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStudent.attendance.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{format(new Date(record.date), 'MMMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <Badge variant={record.status === 'Present' ? 'success' : 'destructive'}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Red Flags</h4>
                {selectedStudent.redFlags.length > 0 ? (
                  selectedStudent.redFlags.map((flag, index) => (
                    <Badge key={index} variant="warning" className="mr-1">{flag}</Badge>
                  ))
                ) : (
                  <span>No red flags</span>
                )}
              </div>
            </div>
          </Card>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal 
          isOpen={isEditModalOpen}
          title={selectedStudent ? 'Edit Student' : 'Add Student'}
          onClose={() => setIsEditModalOpen(false)}
        >
          <StudentForm 
            student={selectedStudent} 
            onSubmit={selectedStudent ? handleUpdateStudent : handleAddStudent} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
}