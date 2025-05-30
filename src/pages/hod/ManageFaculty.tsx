import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  UsersIcon, 
  BookOpenIcon,
  AwardIcon,
  MailIcon,
  PhoneIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  BarChartIcon,
  XIcon,
  PlusIcon,
  DownloadIcon,
  SearchIcon
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import Select from 'react-select';
import { Modal } from '../../components/common/Modal';
import { FacultyForm } from '../../components/common/FacultyForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/Tabs';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/common/Table';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../hooks/useToast';
import { Progress } from '../../components/common/Progress';

export interface Faculty {
  id: number;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  qualifications: string[];
  joiningDate: string;
  experience: string;
  courses: string[];
  roles: string[];
  officeHours: string[];
  researchAreas: string[];
  profileImage?: string;
  attendance: { date: string; status: 'Present' | 'Absent' | 'Leave' }[];
  performance: {
    studentFeedback: number;
    peerReview: number;
    hodEvaluation: number;
    researchScore: number;
    publications: string[];
  };
}

type OptionType = { value: string; label: string };

const rolesOptions = [
  'Class Advisor',
  'Mentor', 
  'Course Coordinator',
  'Event In-charge',
  'Department Head',
  'Research Supervisor'
];

const courseOptions = [
  'CS101: Introduction to Programming',
  'CS201: Data Structures',
  'CS301: Algorithms',
  'CS401: Database Systems',
  'CS501: Operating Systems'
];

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

const generatePerformanceData = (faculty: Faculty) => [
  { metric: 'Student Feedback', score: faculty.performance.studentFeedback, fullMark: 5 },
  { metric: 'Peer Review', score: faculty.performance.peerReview, fullMark: 5 },
  { metric: 'HOD Evaluation', score: faculty.performance.hodEvaluation, fullMark: 5 },
  { metric: 'Research Score', score: faculty.performance.researchScore, fullMark: 5 },
];

const initialFaculty: Faculty[] = [
  {
    id: 1,
    name: 'Dr. John Doe',
    designation: 'Professor',
    department: 'Computer Science',
    email: 'john.doe@college.edu',
    phone: '+1 555-000-1111',
    qualifications: ['PhD in Computer Science', 'M.Tech in IT'],
    joiningDate: '2014-06-10',
    experience: '10 years',
    courses: ['CS101: Intro to Computing', 'CS401: Data Structures'],
    roles: ['Mentor', 'Course Coordinator'],
    officeHours: ['Tue 10:00-12:00', 'Thu 15:00-17:00'],
    researchAreas: ['Artificial Intelligence', 'Data Mining'],
    profileImage: 'https://via.placeholder.com/150',
    attendance: [
      { date: '2023-10-01', status: 'Present' },
      { date: '2023-10-02', status: 'Leave' },
      { date: '2023-10-03', status: 'Present' }
    ],
    performance: {
      studentFeedback: 4.6,
      peerReview: 4.1,
      hodEvaluation: 4.4,
      researchScore: 4.7,
      publications: ['Research Paper A - 2021', 'Book Chapter B - 2022']
    }
  },
  {
    id: 2,
    name: 'Ms. Jane Smith',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    email: 'jane.smith@college.edu',
    phone: '+1 555-222-3333',
    qualifications: ['M.Tech in Software Engineering'],
    joiningDate: '2018-01-20',
    experience: '6 years',
    courses: ['CS203: Web Technologies', 'CS304: Database Systems'],
    roles: ['Project Guide'],
    officeHours: ['Mon 11:00-13:00', 'Wed 10:00-12:00'],
    researchAreas: ['Web Development', 'Database Optimization'],
    profileImage: 'https://via.placeholder.com/150',
    attendance: [
      { date: '2023-10-01', status: 'Present' },
      { date: '2023-10-02', status: 'Present' },
      { date: '2023-10-03', status: 'Present' }
    ],
    performance: {
      studentFeedback: 4.2,
      peerReview: 4.0,
      hodEvaluation: 4.1,
      researchScore: 4.3,
      publications: ['Responsive Web Design - 2022']
    }
  },
  {
    id: 3,
    name: 'Dr. Rahul Mehra',
    designation: 'Associate Professor',
    department: 'Computer Science',
    email: 'rahul.mehra@college.edu',
    phone: '+1 555-444-5555',
    qualifications: ['PhD in Information Systems'],
    joiningDate: '2012-09-15',
    experience: '12 years',
    courses: ['CS202: Operating Systems', 'CS305: Cloud Computing'],
    roles: ['Research Coordinator'],
    officeHours: ['Tue 14:00-16:00', 'Fri 10:00-12:00'],
    researchAreas: ['Cloud Security', 'Distributed Systems'],
    profileImage: 'https://via.placeholder.com/150',
    attendance: [
      { date: '2023-10-01', status: 'Leave' },
      { date: '2023-10-02', status: 'Present' },
      { date: '2023-10-03', status: 'Present' }
    ],
    performance: {
      studentFeedback: 4.3,
      peerReview: 4.5,
      hodEvaluation: 4.6,
      researchScore: 4.9,
      publications: ['Cloud Security Architecture - 2021', 'System Design in Practice - 2023']
    }
  },
  {
    id: 4,
    name: 'Mrs. Priya Nair',
    designation: 'Lecturer',
    department: 'Computer Science',
    email: 'priya.nair@college.edu',
    phone: '+1 555-666-7777',
    qualifications: ['MCA', 'B.Sc in Computer Science'],
    joiningDate: '2019-07-01',
    experience: '5 years',
    courses: ['CS102: C Programming', 'CS204: Data Analysis'],
    roles: ['Lab In-charge'],
    officeHours: ['Mon 09:00-11:00', 'Wed 13:00-15:00'],
    researchAreas: ['Data Visualization', 'Python Programming'],
    profileImage: 'https://via.placeholder.com/150',
    attendance: [
      { date: '2023-10-01', status: 'Present' },
      { date: '2023-10-02', status: 'Leave' },
      { date: '2023-10-03', status: 'Present' }
    ],
    performance: {
      studentFeedback: 4.0,
      peerReview: 3.9,
      hodEvaluation: 4.2,
      researchScore: 4.0,
      publications: ['Python for Beginners - 2022']
    }
  },
  {
    id: 5,
    name: 'Mr. Sameer Khan',
    designation: 'Senior Lecturer',
    department: 'Computer Science',
    email: 'sameer.khan@college.edu',
    phone: '+1 555-888-9999',
    qualifications: ['M.Tech in Computer Networks'],
    joiningDate: '2016-03-12',
    experience: '9 years',
    courses: ['CS205: Networking Basics', 'CS403: Cybersecurity'],
    roles: ['Class Advisor'],
    officeHours: ['Tue 09:00-11:00', 'Thu 11:00-13:00'],
    researchAreas: ['Network Security', 'IoT'],
    profileImage: 'https://via.placeholder.com/150',
    attendance: [
      { date: '2023-10-01', status: 'Present' },
      { date: '2023-10-02', status: 'Present' },
      { date: '2023-10-03', status: 'Present' }
    ],
    performance: {
      studentFeedback: 4.4,
      peerReview: 4.3,
      hodEvaluation: 4.5,
      researchScore: 4.6,
      publications: ['IoT Security Challenges - 2023']
    }
  }
];

export function FacultyManagement() {
  const { toast } = useToast();
  const [facultyList, setFacultyList] = useState<Faculty[]>(initialFaculty);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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

      const newFaculty: Faculty[] = [];

      for (const item of jsonData) {
        const faculty: Faculty = {
          id: facultyList.length + newFaculty.length + 1,
          name: item['Name'] || '',
          designation: item['Designation'] || '',
          department: item['Department'] || '',
          email: item['Email'] || '',
          phone: item['Phone'] || '',
          qualifications: item['Qualifications'] ? item['Qualifications'].split(',').map((q: string) => q.trim()) : [],
          joiningDate: item['JoiningDate'] || '',
          experience: item['Experience'] || '',
          courses: item['Courses'] ? item['Courses'].split(',').map((c: string) => c.trim()) : [],
          roles: item['Roles'] ? item['Roles'].split(',').map((r: string) => r.trim()) : [],
          officeHours: item['OfficeHours'] ? item['OfficeHours'].split(',').map((o: string) => o.trim()) : [],
          researchAreas: item['ResearchAreas'] ? item['ResearchAreas'].split(',').map((r: string) => r.trim()) : [],
          profileImage: item['ProfileImage'] || '',
          attendance: [], // Could be extended to parse attendance if needed
          performance: {
            studentFeedback: 0,
            peerReview: 0,
            hodEvaluation: 0,
            researchScore: 0,
            publications: []
          }
        };
        newFaculty.push(faculty);
      }

      // Here you would typically send newFaculty to backend API to save
      // For now, we just update the state
      setFacultyList(prev => [...prev, ...newFaculty]);
      toast({ title: 'Faculty data uploaded successfully', variant: 'success' });
    } catch (error) {
      toast({ title: 'Failed to upload faculty data', variant: 'destructive' });
      console.error('Error uploading faculty data:', error);
    }
    setUploading(false);
  };

  const filteredFaculty = useMemo(() => {
    return facultyList.filter(faculty => {
      const matchesSearch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment ? faculty.department === selectedDepartment : true;
      return matchesSearch && matchesDepartment;
    });
  }, [facultyList, searchQuery, selectedDepartment]);

  const handleAddFaculty = (newFaculty: Omit<Faculty, 'id'>) => {
    setFacultyList(prev => [...prev, { ...newFaculty, id: prev.length + 1 }]);
    setIsEditModalOpen(false);
    toast({ title: 'Faculty added successfully', variant: 'success' });
  };

  const handleUpdateFaculty = (updatedFaculty: Faculty | Omit<Faculty, 'id'>) => {
    if ('id' in updatedFaculty) {
      setFacultyList(prev => 
        prev.map(f => f.id === updatedFaculty.id ? updatedFaculty as Faculty : f)
      );
    } else {
      handleAddFaculty(updatedFaculty);
      return;
    }
    setIsEditModalOpen(false);
    toast({ title: 'Faculty updated successfully', variant: 'success' });
  };

  const handleRoleChange = (facultyId: number, role: string, action: 'add' | 'remove') => {
    setFacultyList(prev => prev.map(f => {
      if (f.id === facultyId) {
        const newRoles = action === 'add' 
          ? [...f.roles, role] 
          : f.roles.filter(r => r !== role);
        return { ...f, roles: newRoles };
      }
      return f;
    }));
    toast({ title: `Role ${action === 'add' ? 'added' : 'removed'}`, variant: 'default' });
  };

  const handleCourseAssignment = (facultyId: number, selectedOptions: readonly OptionType[]) => {
    const courses = selectedOptions.map(opt => opt.value);
    setFacultyList(prev => prev.map(f => 
      f.id === facultyId ? { ...f, courses } : f
    ));
    toast({ title: 'Courses updated', variant: 'default' });
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Faculty Management"
        subtitle="Comprehensive faculty administration system"
        icon={UsersIcon}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-xl">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search faculty..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            options={departments.map(d => ({ value: d, label: d }))}
            placeholder="All Departments"
            isClearable
            className="min-w-[200px]"
            onChange={(opt) => setSelectedDepartment(opt?.value || '')}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '42px',
              }),
            }}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="outline" 
            onClick={() => toast({ title: 'Export functionality not implemented yet', variant: 'info' })}
            className="gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Faculty
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="directory" className="gap-2">
            <UsersIcon className="w-4 h-4" />
            Directory
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <AwardIcon className="w-4 h-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <BookOpenIcon className="w-4 h-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <BarChartIcon className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-2">
            <PieChart className="w-4 h-4" />
            Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="w-[30%]">Faculty Member</div>
                  </TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Research Areas</TableHead>
                  <TableHead>
                    <div className="text-right">Actions</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredFaculty.length > 0 ? (
                  filteredFaculty.map((faculty) => (
                    <TableRow key={faculty.id} className="hover:bg-muted/50">
                      <TableCell><div className="font-medium">{faculty.name}</div></TableCell>
                      <TableCell>{faculty.department}</TableCell>
                      <TableCell>{faculty.designation}</TableCell>
                      <TableCell>{faculty.experience}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {faculty.researchAreas.map((area, i) => (
                            <Badge key={i} variant="neutral">{area}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedFaculty(faculty);
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
                    <td className="h-24 text-center text-muted-foreground" colSpan={6}>
                      No faculty members found
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="w-[30%]">Faculty Member</div>
                  </TableHead>
                  <TableHead>Current Roles</TableHead>
                  <TableHead>Assign Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell>
                      <div className="font-medium">{faculty.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {faculty.roles.map((role) => (
                          <Badge key={role} className="gap-1 pr-1.5" variant={'success'}>
                            {role}
                            <button 
                              onClick={() => handleRoleChange(faculty.id, role, 'remove')}
                              className="hover:text-destructive transition-colors"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        options={rolesOptions
                          .filter(r => !faculty.roles.includes(r))
                          .map(r => ({ value: r, label: r }))}
                        onChange={(opt) => opt && handleRoleChange(faculty.id, opt.value, 'add')}
                        placeholder="Assign role..."
                        isSearchable
                        className="min-w-[200px]"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '36px',
                          }),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="w-[30%]">Faculty Member</div>
                  </TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned Courses</TableHead>
                  <TableHead>Course Assignment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell>
                      <div className="font-medium">{faculty.name}</div>
                    </TableCell>
                    <TableCell>{faculty.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {faculty.courses.map((course) => (
                          <Badge key={course} variant="neutral">{course}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        isMulti
                        options={courseOptions.map(c => ({ value: c, label: c }))}
                        value={faculty.courses.map(c => ({ value: c, label: c }))}
                        onChange={(opt) => handleCourseAssignment(faculty.id, opt)}
                        className="min-w-[300px]"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '36px',
                          }),
                        }}
                      />
                    </TableCell>
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
                  <TableHead>Faculty Member</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.map((faculty) => (
                  faculty.attendance.length > 0 ? (
                    faculty.attendance.map((record, index) => (
                      <TableRow key={`${faculty.id}-${index}`}>
                        <TableCell>
                          <div className="font-medium">{faculty.name}</div>
                        </TableCell>
                        <TableCell>{format(new Date(record.date), 'MMMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === 'Present' ? 'success' : record.status === 'Leave' ? 'warning' : 'destructive'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow key={faculty.id}>
                      <td colSpan={3} className="text-muted-foreground">
                        No attendance records found for {faculty.name}
                      </td>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFaculty.map((faculty) => (
                <div key={faculty.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-4">{faculty.name}</h4>
                  <div className="h-[250px]">
                    <RadarChart outerRadius={90} data={generatePerformanceData(faculty)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium">Publications:</h5>
                    <ul className="list-disc pl-5">
                      {faculty.performance.publications.map((pub, index) => (
                        <li key={index} className="text-sm">{pub}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Faculty Distribution by Department</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 h-[400px]">
                <PieChart width={400} height={400}>
                  <Pie
                    data={departments.map(dept => {
                      const count = facultyList.filter(f => f.department === dept).length;
                      return {
                        name: dept,
                        value: count,
                        faculty: facultyList.filter(f => f.department === dept)
                      };
                    })}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => {
                      setSelectedDepartment(data.name);
                      setActiveTab('directory');
                    }}
                  >
                    {departments.map((_value: string, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, entry: { payload?: { percent?: number } }) => [
                      `${value} faculty${entry.payload?.percent ? ` (${(entry.payload.percent * 100).toFixed(1)}%)` : ''}`,
                      name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </div>
              <div className="w-full md:w-1/2">
                <h4 className="font-medium mb-4">Click on a segment to view faculty in that department</h4>
                <div className="space-y-2">
                  {departments.map(dept => (
                    <div key={dept} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ 
                          backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][departments.indexOf(dept) % 5] 
                        }}
                      />
                      <span>{dept}: {facultyList.filter(f => f.department === dept).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {isViewModalOpen && selectedFaculty && (
        <Modal 
          isOpen={isViewModalOpen}
          title={`${selectedFaculty.name} Details`}
          onClose={() => setIsViewModalOpen(false)}
        >
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{selectedFaculty.name} Details</h3>
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
                  <div className=" space-y-2">
                    <p className="flex items-center">
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      <span>{selectedFaculty.designation}</span>
                    </p>
                    <p className="flex items-center">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      <span>{selectedFaculty.department} Department</span>
                    </p>
                    <p className="flex items-center">
                      <MailIcon className="w-4 h-4 mr-2" />
                      <span>{selectedFaculty.email}</span>
                    </p>
                    <p className="flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      <span>{selectedFaculty.phone}</span>
                    </p>
                    <p className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>Office Hours: {selectedFaculty.officeHours.join(', ')}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Qualifications</h4>
                  <ul className="space-y-1">
                    {selectedFaculty.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-center">
                        <GraduationCapIcon className="w-4 h-4 mr-2" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
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
                    {selectedFaculty.attendance.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(new Date(record.date), 'MMMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === 'Present' ? 'success' : record.status === 'Leave' ? 'warning' : 'destructive'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <p>Student Feedback: <Progress value={Number(selectedFaculty.performance.studentFeedback || 0) * 20} /></p>
                  <p>Peer Review: <Progress value={Number(selectedFaculty.performance.peerReview || 0) * 20} /></p>
                  <p>HOD Evaluation: <Progress value={Number(selectedFaculty.performance.hodEvaluation || 0) * 20} /></p>
                  <p>Research Score: <Progress value={Number(selectedFaculty.performance.researchScore || 0) * 20} /></p>
                </div>
                <h5 className="font-medium mt-4">Publications:</h5>
                <ul className="list-disc pl-5">
                  {selectedFaculty.performance.publications.map((pub, index) => (
                    <li key={index}>{pub}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal 
          isOpen={isEditModalOpen}
          title={selectedFaculty ? 'Edit Faculty' : 'Add Faculty'}
          onClose={() => setIsEditModalOpen(false)}
        >
          <FacultyForm 
            faculty={selectedFaculty || undefined} 
            onSubmit={selectedFaculty ? handleUpdateFaculty : handleAddFaculty} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
}
