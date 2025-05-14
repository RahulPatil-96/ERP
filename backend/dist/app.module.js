"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const supabase_module_1 = require("./supabase/supabase.module");
const auth_module_1 = require("./auth/auth.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const departments_module_1 = require("./departments/departments.module");
const courses_module_1 = require("./courses/courses.module");
const students_module_1 = require("./students/students.module");
const faculty_module_1 = require("./faculty/faculty.module");
const attendance_module_1 = require("./attendance/attendance.module");
const assignments_module_1 = require("./assignments/assignments.module");
const announcements_module_1 = require("./announcements/announcements.module");
const leaves_module_1 = require("./leaves/leaves.module");
const events_module_1 = require("./events/events.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            supabase_module_1.SupabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            departments_module_1.DepartmentsModule,
            courses_module_1.CoursesModule,
            students_module_1.StudentsModule,
            faculty_module_1.FacultyModule,
            attendance_module_1.AttendanceModule,
            assignments_module_1.AssignmentsModule,
            announcements_module_1.AnnouncementsModule,
            leaves_module_1.LeavesModule,
            events_module_1.EventsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map