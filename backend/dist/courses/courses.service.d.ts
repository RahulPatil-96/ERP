import { SupabaseService } from '../supabase/supabase.service';
import { Course } from './course.interface';
export declare class CoursesService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Course[]>;
    findOne(id: number): Promise<Course>;
    create(course: Partial<Course>): Promise<Course>;
    update(id: number, course: Partial<Course>): Promise<Course>;
    remove(id: number): Promise<void>;
}
