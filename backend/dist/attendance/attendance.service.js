"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let AttendanceService = class AttendanceService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async saveAttendance(records) {
        const supabase = this.supabaseService.getClient();
        const { error } = await supabase
            .from('attendance')
            .upsert(records, { onConflict: 'entityId,date,courseId,timeSlot,sessionType' });
        if (error) {
            console.error('Error saving attendance:', error);
            throw new Error('Failed to save attendance');
        }
    }
    async getAttendanceRecords(date, courseId, timeSlot, sessionType) {
        const supabase = this.supabaseService.getClient();
        if (!date || !courseId || !timeSlot || !sessionType) {
            throw new Error('Missing required query parameters');
        }
        const { data, error } = await supabase
            .from('attendance')
            .select('*, students(name, studentId)')
            .eq('date', date)
            .eq('courseId', courseId)
            .eq('timeSlot', timeSlot)
            .eq('sessionType', sessionType);
        if (error) {
            console.error('Error fetching attendance records:', error);
            throw new Error('Failed to fetch attendance records');
        }
        const mappedData = data.map((record) => ({
            ...record,
            name: record.students?.name || 'Unknown',
            studentId: record.students?.studentId || '',
        }));
        return mappedData;
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map