
import { File } from 'multer';
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Student } from './student.interface';
import * as XLSX from 'xlsx';

@Injectable()
export class StudentsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Student[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('students')
      .select('*');
    if (error || !data) {
      console.error('Error fetching students:', error);
      throw new Error(error?.message || 'Failed to fetch students');
    }
    return data.map((student: any) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      departmentId: student.department_id,
      enrollmentDate: student.enrollment_date,
      phone: student.phone,
      createdAt: student.created_at,
      updatedAt: student.updated_at,
    }));
  }

  async findOne(id: string): Promise<Student> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Student not found');
    }
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      departmentId: data.department_id,
      enrollmentDate: data.enrollment_date,
      phone: data.phone,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async create(student: Partial<Student>): Promise<Student> {
    // Validate required fields
    if (!student.name || !student.email || !student.phone) {
      throw new Error('Missing required fields: name, email, and phone are required');
    }

    // Sanitize nullable fields: convert empty strings to null
    const departmentId = student.departmentId || null;
    const enrollmentDate = student.enrollmentDate && student.enrollmentDate.trim() !== '' ? student.enrollmentDate : null;

    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('students')
      .insert({
        name: student.name,
        email: student.email,
        department_id: departmentId,
        enrollment_date: enrollmentDate,
        phone: student.phone,
      })
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create student');
    }
    const createdData = data as any;
    return {
      id: createdData.id,
      name: createdData.name,
      email: createdData.email,
      departmentId: createdData.department_id,
      enrollmentDate: createdData.enrollment_date,
      phone: createdData.phone,
      createdAt: createdData.created_at,
      updatedAt: createdData.updated_at,
    };
  }

  async update(id: string, student: Partial<Student>): Promise<Student> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('students')
      .update({
        name: student.name,
        email: student.email,
        department_id: student.departmentId,
        enrollment_date: student.enrollmentDate,
        phone: student.phone,
      })
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update student');
    }
    const updatedData = data as any;
    return {
      id: updatedData.id,
      name: updatedData.name,
      email: updatedData.email,
      departmentId: updatedData.department_id,
      enrollmentDate: updatedData.enrollment_date,
      phone: updatedData.phone,
      createdAt: updatedData.created_at,
      updatedAt: updatedData.updated_at,
    };
  }

  async remove(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }

  async bulkCreate(students: Partial<Student>[]): Promise<Student[]> {
    const supabase = this.supabaseService.getClient();
    const createdStudents: Student[] = [];
    try {
      for (const student of students) {
        try {
          const { data, error } = await supabase
            .from('students')
            .insert({
              name: student.name,
              email: student.email,
              department_id: student.departmentId,
              enrollment_date: student.enrollmentDate,
              phone: student.phone,
            })
            .single();
          if (error || !data) {
            console.error('Error creating student:', student, error);
            continue;
          }
          const createdData = data as any;
          createdStudents.push({
            id: createdData.id,
            name: createdData.name,
            email: createdData.email,
            departmentId: createdData.department_id,
            enrollmentDate: createdData.enrollment_date,
            phone: createdData.phone,
            createdAt: createdData.created_at,
            updatedAt: createdData.updated_at,
          });
        } catch (innerErr) {
          console.error('Exception creating student:', student, innerErr);
          continue;
        }
      }
      return createdStudents;
    } catch (err) {
      console.error('Exception in bulkCreate:', err);
      throw err;
    }
  }

  async processExcelFile(file: File): Promise<Student[]> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // Map jsonData to Partial<Student>[]
      const students: Partial<Student>[] = jsonData.map((row) => ({
        name: row['name'] || row['Name'] || '',
        email: row['email'] || row['Email'] || '',
        departmentId: row['departmentId'] || row['DepartmentId'] || row['Department'] || null,
        enrollmentDate: row['enrollmentDate'] || row['EnrollmentDate'] || row['Enrollment Date'] || null,
        phone: row['phone'] || row['Phone'] || '',
      }));

      // Use bulkCreate to insert students
      const createdStudents = await this.bulkCreate(students);
      return createdStudents;
    } catch (error) {
      console.error('Error processing Excel file:', error);
      throw new Error('Failed to process Excel file');
    }
  }
}