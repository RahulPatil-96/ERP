"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const XLSX = require("xlsx");
let StudentsService = class StudentsService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('students')
            .select('*');
        if (error || !data) {
            console.error('Error fetching students:', error);
            throw new Error(error?.message || 'Failed to fetch students');
        }
        return data.map((student) => ({
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
    async findOne(id) {
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
    async create(student) {
        if (!student.name || !student.email || !student.phone) {
            throw new Error('Missing required fields: name, email, and phone are required');
        }
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
        const createdData = data;
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
    async update(id, student) {
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
        const updatedData = data;
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
    async remove(id) {
        const supabase = this.supabaseService.getClient();
        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    async bulkCreate(students) {
        const supabase = this.supabaseService.getClient();
        const createdStudents = [];
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
                    const createdData = data;
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
                }
                catch (innerErr) {
                    console.error('Exception creating student:', student, innerErr);
                    continue;
                }
            }
            return createdStudents;
        }
        catch (err) {
            console.error('Exception in bulkCreate:', err);
            throw err;
        }
    }
    async processExcelFile(file) {
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            const students = jsonData.map((row) => ({
                name: row['name'] || row['Name'] || '',
                email: row['email'] || row['Email'] || '',
                departmentId: row['departmentId'] || row['DepartmentId'] || row['Department'] || null,
                enrollmentDate: row['enrollmentDate'] || row['EnrollmentDate'] || row['Enrollment Date'] || null,
                phone: row['phone'] || row['Phone'] || '',
            }));
            const createdStudents = await this.bulkCreate(students);
            return createdStudents;
        }
        catch (error) {
            console.error('Error processing Excel file:', error);
            throw new Error('Failed to process Excel file');
        }
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], StudentsService);
//# sourceMappingURL=students.service.js.map