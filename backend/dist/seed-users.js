"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
const supabase_service_1 = require("./supabase/supabase.service");
const bcrypt = require("bcryptjs");
async function seedUsers() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const supabaseService = new supabase_service_1.SupabaseService();
    const supabase = supabaseService.getClient();
    try {
        const { data: users, error } = await supabase.from('users').select('*');
        if (error || !users) {
            throw new Error(error?.message || 'Failed to fetch users from Supabase');
        }
        for (const user of users) {
            try {
                const hashedPassword = bcrypt.hashSync(user.password, 10);
                const userToInsert = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    roles: user.roles,
                    createdAt: user.createdAt,
                };
                await usersService.create(userToInsert);
                console.log(`Created user: ${user.email}`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Failed to create user: ${user.email}`, error.message);
                }
                else {
                    console.error(`Failed to create user: ${user.email}`, error);
                }
            }
        }
    }
    catch (error) {
        console.error('User seeding failed', error);
    }
    await app.close();
}
seedUsers()
    .then(() => {
    console.log('User seeding completed');
    process.exit(0);
})
    .catch((error) => {
    console.error('User seeding failed', error);
    process.exit(1);
});
//# sourceMappingURL=seed-users.js.map