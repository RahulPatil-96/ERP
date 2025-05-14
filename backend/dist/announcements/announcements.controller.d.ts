import { AnnouncementsService } from './announcements.service';
import { Announcement } from './announcement.interface';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(): Promise<Announcement[]>;
    findOne(id: number): Promise<Announcement>;
    create(announcement: Partial<Announcement>): Promise<Announcement>;
    update(id: number, announcement: Partial<Announcement>): Promise<Announcement>;
    remove(id: number): Promise<void>;
}
