import { UsersService } from './users.service';
import { User } from './user.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(user: Partial<User>): Promise<User>;
    update(id: number, user: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
}
