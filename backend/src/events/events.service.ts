import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Event } from './event.interface';

@Injectable()
export class EventsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Event[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('events').select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Failed to fetch events');
    }
    return data;
  }

  async findOne(id: number): Promise<Event> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Event not found');
    }
    return data;
  }

  async create(event: Partial<Event>): Promise<Event> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to create event');
    }
    return data;
  }

  async update(id: number, event: Partial<Event>): Promise<Event> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Failed to update event');
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
