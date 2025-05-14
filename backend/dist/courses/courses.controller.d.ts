import { CoursesService } from './courses.service';
import { Course } from './course.interface';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<Course[]>;
    findOne(id: number): Promise<Course>;
    create(course: Partial<Course>): Promise<Course>;
    update(id: number, course: Partial<Course>): Promise<Course>;
    remove(id: number): Promise<void>;
}
