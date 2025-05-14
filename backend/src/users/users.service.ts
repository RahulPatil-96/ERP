import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<User[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch users');
    }
    return data;
  }

  async findOne(id: number): Promise<User> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'User not found');
    }
    return data;
  }

  async create(user: Partial<User>): Promise<User> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create user');
    }
    return data;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update user');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
