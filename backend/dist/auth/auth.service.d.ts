import { SupabaseService } from '../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly supabaseService;
    private readonly jwtService;
    constructor(supabaseService: SupabaseService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        [key: string]: unknown;
    }>;
    getUserById(userId: string): Promise<{
        [key: string]: unknown;
    }>;
    registerUser(name: string, email: string, password: string): Promise<{
        [key: string]: unknown;
    }>;
}
