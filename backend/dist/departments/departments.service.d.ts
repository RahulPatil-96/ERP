import { SupabaseService } from '../supabase/supabase.service';
import { Department } from './department.interface';
export declare class DepartmentsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Department[]>;
    findOne(id: number): Promise<Department>;
    create(department: Partial<Department>): Promise<Department>;
    update(id: number, department: Partial<Department>): Promise<Department>;
    remove(id: number): Promise<void>;
}
