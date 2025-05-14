import { SupabaseService } from '../supabase/supabase.service';
import { User } from './user.interface';
export declare class UsersService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(user: Partial<User>): Promise<User>;
    update(id: number, user: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
}
