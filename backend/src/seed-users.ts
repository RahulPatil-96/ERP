import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { SupabaseService } from './supabase/supabase.service';
import * as bcrypt from 'bcryptjs';

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const supabaseService = new SupabaseService();
  const supabase = supabaseService.getClient();

  try {
    const { data: users, error } = await supabase.from('users').select('*');
    if (error || !users) {
      throw new Error(error?.message || 'Failed to fetch users from Supabase');
    }

    for (const user of users) {
      try {
        // Assuming user has properties: id, name, email, password, roles, createdAt
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
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to create user: ${user.email}`, error.message);
        } else {
          console.error(`Failed to create user: ${user.email}`, error);
        }
      }
    }
  } catch (error) {
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
