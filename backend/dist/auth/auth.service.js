"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    supabaseService;
    jwtService;
    constructor(supabaseService, jwtService) {
        this.supabaseService = supabaseService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !data) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, data.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role_id, roles(name)')
            .eq('user_id', data.id);
        if (rolesError) {
            throw new common_1.UnauthorizedException('Failed to fetch user roles');
        }
        const roles = rolesData?.flatMap((r) => {
            if (Array.isArray(r.roles)) {
                return r.roles.map((role) => role.name);
            }
            else if (r.roles && typeof r.roles === 'object') {
                return [r.roles.name];
            }
            else {
                return [];
            }
        }) || [];
        const { password: _, ...userWithoutPassword } = data;
        const payload = { sub: data.id, email: data.email, roles };
        const token = this.jwtService.sign(payload);
        const currentRole = roles.length > 0 ? roles[0] : 'student';
        return { ...userWithoutPassword, roles, currentRole, token };
    }
    async getUserById(userId) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error || !data) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role_id, roles(name)')
            .eq('user_id', data.id);
        if (rolesError) {
            throw new common_1.UnauthorizedException('Failed to fetch user roles');
        }
        const roles = rolesData?.flatMap((r) => {
            if (Array.isArray(r.roles)) {
                return r.roles.map((role) => role.name);
            }
            else if (r.roles && typeof r.roles === 'object') {
                return [r.roles.name];
            }
            else {
                return [];
            }
        }) || [];
        const { password: _, ...userWithoutPassword } = data;
        return { ...userWithoutPassword, roles };
    }
    async registerUser(name, email, password) {
        const supabase = this.supabaseService.getClient();
        const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        if (existingUser) {
            throw new common_1.UnauthorizedException('User with this email already exists');
        }
        if (existingUserError && existingUserError.code !== 'PGRST116') {
            throw new common_1.UnauthorizedException('Failed to check existing user');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword }])
            .select()
            .single();
        if (error || !data) {
            throw new common_1.UnauthorizedException('Failed to register user');
        }
        const { password: _, ...userWithoutPassword } = data;
        return userWithoutPassword;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map