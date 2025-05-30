import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './Table';
import { Button } from './Button';

interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Leave';
}

export interface Student {
  id: number;
  name: string;
  academicId?: string;
  email: string;
  phone: string;
  batch?: string;
  semester?: number;
  gpa?: number;
  backlogs?: number;
  attendance: AttendanceRecord[];
  classAdvisor?: string | null;
  redFlags?: string[];
}

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  isLoading?: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onView, isLoading }) => {
  return (
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
              <TableCell><div className="h-4 w-[200px] bg-gray-200 animate-pulse rounded"></div></TableCell>
              <TableCell><div className="h-4 w-[150px] bg-gray-200 animate-pulse rounded"></div></TableCell>
              <TableCell><div className="h-4 w-[120px] bg-gray-200 animate-pulse rounded"></div></TableCell>
              <TableCell><div className="h-4 w-[100px] bg-gray-200 animate-pulse rounded"></div></TableCell>
              <TableCell><div className="h-4 w-[80px] bg-gray-200 animate-pulse rounded"></div></TableCell>
              <TableCell><div className="h-8 w-[100px] ml-auto bg-gray-200 animate-pulse rounded"></div></TableCell>
            </TableRow>
          ))
        ) : students.length > 0 ? (
          students.map((student) => (
            <TableRow key={student.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="font-medium">{student.name}</div>
              </TableCell>
              <TableCell>{student.academicId || '-'}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.phone}</TableCell>
              <TableCell>{student.batch || '-'}</TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  onClick={() => onView(student)}
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
  );
};

export default StudentTable;
