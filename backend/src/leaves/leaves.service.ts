import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Leave } from './leave.interface';

@Injectable()
export class LeavesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Leave[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('leaves').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch leaves');
    }
    return data;
  }

  async findOne(id: number): Promise<Leave> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Leave not found');
    }
    return data;
  }

  async create(leave: Partial<Leave>): Promise<Leave> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaves')
      .insert(leave)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create leave');
    }
    return data;
  }

  async update(id: number, leave: Partial<Leave>): Promise<Leave> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaves')
      .update(leave)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update leave');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('leaves').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
