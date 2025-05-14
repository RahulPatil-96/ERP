import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Announcement } from './announcement.interface';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Announcement[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('announcements').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch announcements');
    }
    return data;
  }

  async findOne(id: number): Promise<Announcement> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Announcement not found');
    }
    return data;
  }

  async create(announcement: Partial<Announcement>): Promise<Announcement> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create announcement');
    }
    return data;
  }

  async update(id: number, announcement: Partial<Announcement>): Promise<Announcement> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('announcements')
      .update(announcement)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update announcement');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
