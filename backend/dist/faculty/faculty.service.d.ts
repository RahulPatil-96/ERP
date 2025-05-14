import { SupabaseService } from '../supabase/supabase.service';
import { Faculty } from './faculty.interface';
export declare class FacultyService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Faculty[]>;
    findOne(id: number): Promise<Faculty>;
    create(faculty: Partial<Faculty>): Promise<Faculty>;
    update(id: number, faculty: Partial<Faculty>): Promise<Faculty>;
    remove(id: number): Promise<void>;
}
