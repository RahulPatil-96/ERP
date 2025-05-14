import { File } from 'multer';
import { SupabaseService } from '../supabase/supabase.service';
import { Student } from './student.interface';
export declare class StudentsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Student[]>;
    findOne(id: string): Promise<Student>;
    create(student: Partial<Student>): Promise<Student>;
    update(id: string, student: Partial<Student>): Promise<Student>;
    remove(id: string): Promise<void>;
    bulkCreate(students: Partial<Student>[]): Promise<Student[]>;
    processExcelFile(file: File): Promise<Student[]>;
}
