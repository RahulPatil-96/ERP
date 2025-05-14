import { SupabaseService } from '../supabase/supabase.service';
import { Event } from './event.interface';
export declare class EventsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    create(event: Partial<Event>): Promise<Event>;
    update(id: number, event: Partial<Event>): Promise<Event>;
    remove(id: number): Promise<void>;
}
