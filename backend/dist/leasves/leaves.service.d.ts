import { SupabaseService } from '../supabase/supabase.service';
import { Leave } from './leave.interface';
export declare class LeavesService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Leave[]>;
    findOne(id: number): Promise<Leave>;
    create(leave: Partial<Leave>): Promise<Leave>;
    update(id: number, leave: Partial<Leave>): Promise<Leave>;
    remove(id: number): Promise<void>;
}
