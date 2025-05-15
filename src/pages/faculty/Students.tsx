import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
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

export function Students() {
  const { toast } = useToast();
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudentList(data);
    } catch (error) {
      toast({ title: 'Failed to load students', variant: 'destructive' });
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const newStudents: Student[] = [];

      for (const item of jsonData) {
        const student: Student = {
          id: studentList.length + newStudents.length + 1,
          name: item['Name'] || '',
          academicId: item['AcademicId'] || '',
          email: item['Email'] || '',
          phone: item['Phone'] || '',
          batch: item['Batch'] || '',
          semester: item['Semester'] || 0,
          gpa: item['GPA'] || 0,
          backlogs: item['Backlogs'] || 0,
          attendance: [], // Could be extended to parse attendance if needed
          classAdvisor: item['ClassAdvisor'] || '',
          redFlags: item['RedFlags'] ? item['RedFlags'].split(',').map((r: string) => r.trim()) : [],
        };
        newStudents.push(student);
      }

      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudents),
      });

      if (!response.ok) {
        throw new Error('Failed to upload student data');
      }

      const createdStudents = await response.json();
      setStudentList(prev => [...prev, ...createdStudents]);
      toast({ title: 'Student data uploaded successfully', variant: 'success' });
    } catch (error) {
      toast({ title: 'Failed to upload student data', variant: 'destructive' });
      console.error('Error uploading student data:', error);
    }
    setUploading(false);
  };

const filteredStudents = useMemo(() => {
    return studentList.filter(student => 
      student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.academicId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [studentList, searchQuery]);

  const handleAddStudent = async (newStudent: Omit<Student, 'id'>) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      const createdStudent = await response.json();
      setStudentList(prev => [...prev, createdStudent]);
      setIsEditModalOpen(false);
      toast({ title: 'Student added successfully', variant: 'success' });
    } catch (error) {
      toast({ title: 'Failed to add student', variant: 'destructive' });
      console.error(error);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student | Omit<Student, 'id'>) => {
    if ('id' in updatedStudent) {
      try {
        const response = await fetch(`/api/students/${updatedStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedStudent),
        });
        if (!response.ok) {
          throw new Error('Failed to update student');
        }
        const data = await response.json();
        setStudentList(prev => prev.map(s => s.id === data.id ? data : s));
        setIsEditModalOpen(false);
        toast({ title: 'Student updated successfully', variant: 'success' });
      } catch (error) {
        toast({ title: 'Failed to update student', variant: 'destructive' });
        console.error(error);
      }
    } else {
      await handleAddStudent(updatedStudent);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Students"
        subtitle="Comprehensive student administration system"
        icon={UsersIcon}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xl">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Student
          </Button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            disabled={uploading}
            className="ml-4 p-2 border border-gray-300 rounded-md cursor-pointer"
          />
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
                ) : (filteredStudents ?? []).length > 0 ? (
                  (filteredStudents ?? []).map((student) => (
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
                {(filteredStudents ?? []).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell>{student.gpa}</TableCell>
                    <TableCell>{student.backlogs}</TableCell>
                    <TableCell>{student.semester}</TableCell>
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
{(filteredStudents ?? []).filter(Boolean).reduce<React.ReactNode[]>((acc, student) => {
  const attendanceArray = Array.isArray(student?.attendance) ? student.attendance : [];
  const attendanceRows = attendanceArray.map((record: AttendanceRecord, index: number) => (
    <TableRow key={`${student.id}-${index}`}>
      <TableCell>{student.name}</TableCell>
      <TableCell>{format(new Date(record.date), 'MMMM dd, yyyy')}</TableCell>
      <TableCell>
        <Badge variant={record.status === 'Present' ? 'success' : 'destructive'}>
          {record.status}
        </Badge>
      </TableCell>
    </TableRow>
  ));
  return acc.concat(attendanceRows);
}, [])}
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
                {(filteredStudents ?? []).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell>
                      {(student.redFlags ?? []).length > 0 ? (
                        (student.redFlags ?? []).map((flag: string, index: number) => (
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
                {(filteredStudents ?? []).map((student) => (
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
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
{(selectedStudent.attendance ?? []).map((record: AttendanceRecord, index: number) => (
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
{(selectedStudent.redFlags ?? []).length > 0 ? (
                  (selectedStudent.redFlags ?? []).map((flag: string, index: number) => (
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
