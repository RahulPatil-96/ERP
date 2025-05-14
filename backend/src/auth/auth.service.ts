import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

interface Role {
  name: string;
}

interface UserRole {
  role_id: string;
  roles: Role | Role[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<{ [key: string]: unknown }> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Fetch roles for the user
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role_id, roles(name)')
      .eq('user_id', data.id);

    if (rolesError) {
      throw new UnauthorizedException('Failed to fetch user roles');
    }

    const roles = (rolesData as UserRole[])?.flatMap((r: UserRole) => {
      if (Array.isArray(r.roles)) {
        return r.roles.map((role) => role.name);
      } else if (r.roles && typeof r.roles === 'object') {
        return [r.roles.name];
      } else {
        return [];
      }
    }) || [];

    // Remove password before returning user data
    const { password: _, ...userWithoutPassword } = data;

    // Generate JWT token
    const payload = { sub: data.id, email: data.email, roles };
    const token = this.jwtService.sign(payload);

    const currentRole = roles.length > 0 ? roles[0] : 'student'; // default role if none
    return { ...userWithoutPassword, roles, currentRole, token };
  }

  async getUserById(userId: string): Promise<{ [key: string]: unknown }> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('User not found');
    }

    // Fetch roles for the user
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role_id, roles(name)')
      .eq('user_id', data.id);

    if (rolesError) {
      throw new UnauthorizedException('Failed to fetch user roles');
    }

    const roles = (rolesData as UserRole[])?.flatMap((r: UserRole) => {
      if (Array.isArray(r.roles)) {
        return r.roles.map((role) => role.name);
      } else if (r.roles && typeof r.roles === 'object') {
        return [r.roles.name];
      } else {
        return [];
      }
    }) || [];

    const { password: _, ...userWithoutPassword } = data;
    return { ...userWithoutPassword, roles };
  }

  async registerUser(name: string, email: string, password: string): Promise<{ [key: string]: unknown }> {
    const supabase = this.supabaseService.getClient();

    // Check if user with email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      // PGRST116 means no rows found, so ignore that error
      throw new UnauthorizedException('Failed to check existing user');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error || !data) {
      throw new UnauthorizedException('Failed to register user');
    }

    // Remove password before returning user data
    const { password: _, ...userWithoutPassword } = data;

    return userWithoutPassword;
  }
}
