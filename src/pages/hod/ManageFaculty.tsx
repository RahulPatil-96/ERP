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
import { Button } from '../../components/common/button';
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

interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  experience: number;
  specialization: string[];
  courses: string[];
  research: string[];
  publications: number;
  rating: number;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  salary: number;
  performance: {
    teaching: number;
    research: number;
    service: number;
    overall: number;
  };
}

const mockFaculty: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1-555-0123',
    department: 'Computer Science',
    designation: 'Professor',
    qualification: 'Ph.D. in Computer Science',
    experience: 15,
    specialization: ['Machine Learning', 'Data Science', 'AI'],
    courses: ['CS101', 'CS301', 'CS401'],
    research: ['Deep Learning Applications', 'Natural Language Processing'],
    publications: 45,
    rating: 4.8,
    status: 'active',
    joinDate: '2008-08-15',
    salary: 95000,
    performance: {
      teaching: 92,
      research: 88,
      service: 85,
      overall: 88
    }
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    phone: '+1-555-0124',
    department: 'Computer Science',
    designation: 'Associate Professor',
    qualification: 'Ph.D. in Software Engineering',
    experience: 12,
    specialization: ['Software Architecture', 'Web Development', 'Database Systems'],
    courses: ['CS201', 'CS302', 'CS403'],
    research: ['Microservices Architecture', 'Cloud Computing'],
    publications: 32,
    rating: 4.6,
    status: 'active',
    joinDate: '2011-01-20',
    salary: 82000,
    performance: {
      teaching: 89,
      research: 85,
      service: 90,
      overall: 88
    }
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    phone: '+1-555-0125',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Cybersecurity',
    experience: 8,
    specialization: ['Network Security', 'Cryptography', 'Ethical Hacking'],
    courses: ['CS205', 'CS305', 'CS405'],
    research: ['Blockchain Security', 'IoT Security'],
    publications: 18,
    rating: 4.7,
    status: 'active',
    joinDate: '2015-09-01',
    salary: 72000,
    performance: {
      teaching: 91,
      research: 82,
      service: 78,
      overall: 84
    }
  }
];

const departments = [
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' }
];

const designations = [
  { value: 'professor', label: 'Professor' },
  { value: 'associate-professor', label: 'Associate Professor' },
  { value: 'assistant-professor', label: 'Assistant Professor' },
  { value: 'lecturer', label: 'Lecturer' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on-leave', label: 'On Leave' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function FacultyManagement() {
  const [faculty, setFaculty] = useState<Faculty[]>(mockFaculty);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredFaculty = useMemo(() => {
    return faculty.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.specialization.some(spec => 
                            spec.toLowerCase().includes(searchTerm.toLowerCase())
                          );
      const matchesDepartment = !selectedDepartment || member.department === selectedDepartment.label;
      const matchesDesignation = !selectedDesignation || member.designation === selectedDesignation.label;
      const matchesStatus = !selectedStatus || member.status === selectedStatus.value;

      return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus;
    });
  }, [faculty, searchTerm, selectedDepartment, selectedDesignation, selectedStatus]);

  const departmentStats = useMemo(() => {
    const stats = faculty.reduce((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [faculty]);

  const designationStats = useMemo(() => {
    const stats = faculty.reduce((acc, member) => {
      acc[member.designation] = (acc[member.designation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [faculty]);

  const performanceData = useMemo(() => {
    const avgPerformance = faculty.reduce((acc, member) => {
      acc.teaching += member.performance.teaching;
      acc.research += member.performance.research;
      acc.service += member.performance.service;
      return acc;
    }, { teaching: 0, research: 0, service: 0 });

    const count = faculty.length;
    return [
      { subject: 'Teaching', A: Math.round(avgPerformance.teaching / count), fullMark: 100 },
      { subject: 'Research', A: Math.round(avgPerformance.research / count), fullMark: 100 },
      { subject: 'Service', A: Math.round(avgPerformance.service / count), fullMark: 100 }
    ];
  }, [faculty]);

  const handleAddFaculty = async (facultyData: Partial<Faculty>) => {
    setIsLoading(true);
    try {
      const newFaculty: Faculty = {
        id: Date.now().toString(),
        name: facultyData.name || '',
        email: facultyData.email || '',
        phone: facultyData.phone || '',
        department: facultyData.department || '',
        designation: facultyData.designation || '',
        qualification: facultyData.qualification || '',
        experience: facultyData.experience || 0,
        specialization: facultyData.specialization || [],
        courses: facultyData.courses || [],
        research: facultyData.research || [],
        publications: facultyData.publications || 0,
        rating: facultyData.rating || 0,
        status: (facultyData.status as Faculty['status']) || 'active',
        joinDate: facultyData.joinDate || new Date().toISOString().split('T')[0],
        salary: facultyData.salary || 0,
        performance: facultyData.performance || {
          teaching: 0,
          research: 0,
          service: 0,
          overall: 0
        }
      };

      setFaculty(prev => [...prev, newFaculty]);
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Faculty member added successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add faculty member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFaculty = async (facultyData: Partial<Faculty>) => {
    if (!selectedFaculty) return;

    setIsLoading(true);
    try {
      const updatedFaculty = { ...selectedFaculty, ...facultyData };
      setFaculty(prev => prev.map(member => 
        member.id === selectedFaculty.id ? updatedFaculty : member
      ));
      setIsEditModalOpen(false);
      setSelectedFaculty(null);
      toast({
        title: "Success",
        description: "Faculty member updated successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update faculty member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    setIsLoading(true);
    try {
      setFaculty(prev => prev.filter(member => member.id !== id));
      toast({
        title: "Success",
        description: "Faculty member deleted successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete faculty member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(faculty);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faculty');
    XLSX.writeFile(workbook, 'faculty_data.xlsx');
    toast({
      title: "Success",
      description: "Faculty data exported successfully",
      variant: "default"
    });
  };

  const getStatusBadgeVariant = (status: Faculty['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'destructive';
      case 'on-leave': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Management"
        description="Manage faculty members, track performance, and analyze department statistics"
        icon={<UsersIcon className="h-6 w-6" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Faculty</p>
              <p className="text-2xl font-bold text-gray-900">{faculty.length}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Faculty</p>
              <p className="text-2xl font-bold text-green-600">
                {faculty.filter(f => f.status === 'active').length}
              </p>
            </div>
            <GraduationCapIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Publications</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(faculty.reduce((sum, f) => sum + f.publications, 0) / faculty.length)}
              </p>
            </div>
            <BookOpenIcon className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(faculty.reduce((sum, f) => sum + f.rating, 0) / faculty.length).toFixed(1)}
              </p>
            </div>
            <AwardIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
          <PieChart width={300} height={200}>
            <Pie
              data={departmentStats}
              cx={150}
              cy={100}
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {departmentStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Designation Distribution</h3>
          <PieChart width={300} height={200}>
            <Pie
              data={designationStats}
              cx={150}
              cy={100}
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {designationStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Average Performance</h3>
          <RadarChart width={300} height={200} data={performanceData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                options={departments}
                placeholder="Department"
                isClearable
                className="min-w-[150px]"
              />
              
              <Select
                value={selectedDesignation}
                onChange={setSelectedDesignation}
                options={designations}
                placeholder="Designation"
                isClearable
                className="min-w-[150px]"
              />
              
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                placeholder="Status"
                isClearable
                className="min-w-[120px]"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Faculty
            </Button>
          </div>
        </div>
      </Card>

      {/* Faculty Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Publications</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredFaculty.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.designation}</TableCell>
                    <TableCell>{member.experience} years</TableCell>
                    <TableCell>{member.publications}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{member.rating}</span>
                        <AwardIcon className="h-4 w-4 text-yellow-500" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFaculty(member);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteFaculty(member.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Faculty Member"
      >
        <FacultyForm
          onSubmit={handleAddFaculty}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFaculty(null);
        }}
        title="Edit Faculty Member"
      >
        {selectedFaculty && (
          <FacultyForm
            initialData={selectedFaculty}
            onSubmit={handleEditFaculty}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedFaculty(null);
            }}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
}

export default FacultyManagement;