import { LeavesService } from './leaves.service';
import { Leave } from './leave.interface';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    findAll(): Promise<Leave[]>;
    findOne(id: number): Promise<Leave>;
    create(leave: Partial<Leave>): Promise<Leave>;
    update(id: number, leave: Partial<Leave>): Promise<Leave>;
    remove(id: number): Promise<void>;
}
