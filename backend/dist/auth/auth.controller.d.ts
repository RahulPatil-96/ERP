import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            [key: string]: unknown;
        };
    }>;
    register(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        user: {
            [key: string]: unknown;
        };
    }>;
    impersonate(body: {
        userId: string;
    }): Promise<{
        user: {
            [key: string]: unknown;
        };
    }>;
}
