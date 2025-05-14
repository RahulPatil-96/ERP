import { StudentsService } from './students.service';
import { Student } from './student.interface';
declare global {
    namespace Express {
        interface Multer {
        }
    }
}
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(): Promise<Student[]>;
    findOne(id: string): Promise<Student>;
    create(student: Partial<Student>): Promise<Student>;
    bulkCreate(students: Partial<Student>[]): Promise<Student[]>;
    uploadExcel(file: any): Promise<Student[]>;
    update(id: string, student: Partial<Student>): Promise<Student>;
    remove(id: string): Promise<void>;
}
