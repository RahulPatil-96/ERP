import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { FacultyModule } from './faculty/faculty.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { LeavesModule } from './leaves/leaves.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    CoursesModule,
    StudentsModule,
    FacultyModule,
    AttendanceModule,
    AssignmentsModule,
    AnnouncementsModule,
    LeavesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
