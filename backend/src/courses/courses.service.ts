import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Course } from './course.interface';

@Injectable()
export class CoursesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Course[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('courses').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch courses');
    }
    return data;
  }

  async findOne(id: number): Promise<Course> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Course not found');
    }
    return data;
  }

  async create(course: Partial<Course>): Promise<Course> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create course');
    }
    return data;
  }

  async update(id: number, course: Partial<Course>): Promise<Course> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update course');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
