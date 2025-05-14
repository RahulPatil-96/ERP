export interface Assignment {
    id?: number;
    title: string;
    description: string;
    courseId: number;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
}
