import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Department } from './department.interface';

@Injectable()
export class DepartmentsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Department[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('departments').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch departments');
    }
    return data;
  }

  async findOne(id: number): Promise<Department> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Department not found');
    }
    return data;
  }

  async create(department: Partial<Department>): Promise<Department> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('departments')
      .insert(department)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create department');
    }
    return data;
  }

  async update(id: number, department: Partial<Department>): Promise<Department> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('departments')
      .update(department)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update department');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
