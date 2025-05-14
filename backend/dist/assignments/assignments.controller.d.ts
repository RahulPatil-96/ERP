import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.interface';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    findAll(): Promise<Assignment[]>;
    findOne(id: number): Promise<Assignment>;
    create(assignment: Partial<Assignment>): Promise<Assignment>;
    update(id: number, assignment: Partial<Assignment>): Promise<Assignment>;
    remove(id: number): Promise<void>;
}
