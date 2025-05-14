export interface Faculty {
  id: number;
  name: string;
  designation: string;
  contact: string;
  qualifications: string[];
  department: string;
  joiningDate: string;
  experience: number;
  roles: {
    classAdvisor?: boolean;
    mentor?: boolean;
    courseCoordinator?: boolean;
    eventInCharge?: boolean;
  };
}

export interface RoleAssignmentPayload {
  facultyId: number;
  role: 'classAdvisor' | 'mentor' | 'courseCoordinator' | 'eventInCharge';
  assign: boolean;
}
