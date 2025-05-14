import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { XIcon, PlusIcon } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface Faculty {
  id: number;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  qualifications: string[];
  joiningDate: string;
  experience: string;
  courses: string[];
  roles: string[];
  officeHours: string[];
  researchAreas: string[];
  profileImage?: string;
  attendance: { date: string; status: 'Present' | 'Absent' | 'Leave' }[];
  performance: {
    studentFeedback: number;
    peerReview: number;
    hodEvaluation: number;
    researchScore: number;
    publications: string[];
  };
}

interface FacultyFormProps {
  faculty?: Faculty | null;
  onSubmit: (faculty: Omit<Faculty, 'id'> | Faculty) => void;
  onClose: () => void;
}


const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Visiting Faculty', 'Emeritus Professor'];

export function FacultyForm({ faculty, onSubmit, onClose }: FacultyFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Faculty, 'id'>>({
    name: faculty?.name || '',
    designation: faculty?.designation || '',
    department: faculty?.department || '',
    email: faculty?.email || '',
    phone: faculty?.phone || '',
    qualifications: faculty?.qualifications || [],
    joiningDate: faculty?.joiningDate || '',
    experience: faculty?.experience || '',
    courses: faculty?.courses || [],
    roles: faculty?.roles || [],
    officeHours: faculty?.officeHours || [],
    researchAreas: faculty?.researchAreas || [],
    attendance: faculty?.attendance || [],
    performance: faculty?.performance || {
      studentFeedback: 0,
      peerReview: 0,
      hodEvaluation: 0,
      researchScore: 0,
      publications: []
    }
  });

  const [newQualification, setNewQualification] = useState('');
  const [newResearchArea, setNewResearchArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.department) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    onSubmit(formData);
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const addResearchArea = () => {
    if (newResearchArea.trim()) {
      setFormData(prev => ({
        ...prev,
        researchAreas: [...prev.researchAreas, newResearchArea.trim()]
      }));
      setNewResearchArea('');
    }
  };

  const removeResearchArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          value={formData.name}
          onChange={(value) => setFormData({...formData, name: value})}
          required
        />
        <div className="space-y-1">
          <label className="text-sm font-medium">Designation *</label>
          <select
            value={formData.designation}
            onChange={(e) => setFormData({...formData, designation: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select designation</option>
            {designations.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Department *</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select department</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({...formData, email: value})}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(value) => setFormData({...formData, phone: value})}
        />
        <Input
          label="Joining Date"
          type="date"
          value={formData.joiningDate}
          onChange={(value) => setFormData({...formData, joiningDate: value})}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Qualifications</label>
          <div className="flex gap-2">
            <Input
              value={newQualification}
              onChange={setNewQualification}
              placeholder="Add qualification"
            />
            <Button type="button" size="sm" onClick={addQualification}>
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.qualifications.map((qual, index) => (
              <Badge key={index} variant="neutral">
                {qual}
                <button
                  type="button"
                  onClick={() => removeQualification(index)}
                  className="ml-1 hover:text-red-600"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Research Areas</label>
          <div className="flex gap-2">
            <Input
              value={newResearchArea}
              onChange={setNewResearchArea}
              placeholder="Add research area"
            />
            <Button type="button" size="sm" onClick={addResearchArea}>
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.researchAreas.map((area, index) => (
              <Badge key={index} variant="neutral">
                {area}
                <button
                  type="button"
                  onClick={() => removeResearchArea(index)}
                  className="ml-1 hover:text-red-600"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {faculty ? 'Update' : 'Add'} Faculty
        </Button>
      </div>
    </form>
  );
}
