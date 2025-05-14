import { FacultyService } from './faculty.service';
import { Faculty } from './faculty.interface';
export declare class FacultyController {
    private readonly facultyService;
    constructor(facultyService: FacultyService);
    findAll(): Promise<Faculty[]>;
    findOne(id: number): Promise<Faculty>;
    create(faculty: Partial<Faculty>): Promise<Faculty>;
    update(id: number, faculty: Partial<Faculty>): Promise<Faculty>;
    remove(id: number): Promise<void>;
}
