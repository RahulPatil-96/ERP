import { SupabaseService } from '../supabase/supabase.service';
import { Assignment } from './assignment.interface';
export declare class AssignmentsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Assignment[]>;
    findOne(id: number): Promise<Assignment>;
    create(assignment: Partial<Assignment>): Promise<Assignment>;
    update(id: number, assignment: Partial<Assignment>): Promise<Assignment>;
    remove(id: number): Promise<void>;
}
