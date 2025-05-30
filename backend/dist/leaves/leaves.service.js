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
exports.LeavesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let LeavesService = class LeavesService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.from('leaves').select('*');
        if (error || !data) {
            throw new Error(error?.message || 'Failed to fetch leaves');
        }
        return data;
    }
    async findOne(id) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('leaves')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            throw new Error(error?.message || 'Leave not found');
        }
        return data;
    }
    async create(leave) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('leaves')
            .insert(leave)
            .single();
        if (error || !data) {
            throw new Error(error?.message || 'Failed to create leave');
        }
        return data;
    }
    async update(id, leave) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('leaves')
            .update(leave)
            .eq('id', id)
            .single();
        if (error || !data) {
            throw new Error(error?.message || 'Failed to update leave');
        }
        return data;
    }
    async remove(id) {
        const supabase = this.supabaseService.getClient();
        const { error } = await supabase.from('leaves').delete().eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
};
exports.LeavesService = LeavesService;
exports.LeavesService = LeavesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], LeavesService);
//# sourceMappingURL=leaves.service.js.map