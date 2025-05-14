import { SupabaseService } from '../supabase/supabase.service';
import { Announcement } from './announcement.interface';
export declare class AnnouncementsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<Announcement[]>;
    findOne(id: number): Promise<Announcement>;
    create(announcement: Partial<Announcement>): Promise<Announcement>;
    update(id: number, announcement: Partial<Announcement>): Promise<Announcement>;
    remove(id: number): Promise<void>;
}
