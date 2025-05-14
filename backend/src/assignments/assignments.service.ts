import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Assignment } from './assignment.interface';

@Injectable()
export class AssignmentsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Assignment[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('assignments').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch assignments');
    }
    return data;
  }

  async findOne(id: number): Promise<Assignment> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Assignment not found');
    }
    return data;
  }

  async create(assignment: Partial<Assignment>): Promise<Assignment> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('assignments')
      .insert(assignment)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create assignment');
    }
    return data;
  }

  async update(id: number, assignment: Partial<Assignment>): Promise<Assignment> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('assignments')
      .update(assignment)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update assignment');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
