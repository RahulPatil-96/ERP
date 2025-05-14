import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase URL and Key must be provided in environment variables',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { data: _data, error } = await this.supabase
        .from('users')
        .select('id')
        .limit(1);
      if (error) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}
