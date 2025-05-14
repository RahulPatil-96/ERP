import { DepartmentsService } from './departments.service';
import { Department } from './department.interface';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(): Promise<Department[]>;
    findOne(id: number): Promise<Department>;
    create(department: Partial<Department>): Promise<Department>;
    update(id: number, department: Partial<Department>): Promise<Department>;
    remove(id: number): Promise<void>;
}
