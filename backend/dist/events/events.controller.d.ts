import { EventsService } from './events.service';
import { Event } from './event.interface';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    create(event: Partial<Event>): Promise<Event>;
    update(id: number, event: Partial<Event>): Promise<Event>;
    remove(id: number): Promise<void>;
}
