import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Faculty } from './faculty.interface';

@Injectable()
export class FacultyService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Faculty[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('faculty').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch faculty');
    }
    return data;
  }

  async findOne(id: number): Promise<Faculty> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Faculty not found');
    }
    return data;
  }

  async create(faculty: Partial<Faculty>): Promise<Faculty> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('faculty')
      .insert(faculty)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create faculty');
    }
    return data;
  }

  async update(id: number, faculty: Partial<Faculty>): Promise<Faculty> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('faculty')
      .update(faculty)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update faculty');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('faculty').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
