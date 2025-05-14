import React, { useState } from 'react';

interface AttendanceRecord {
  date: string;
  status: "Present" | "Absent" | "Leave";
}

interface Student {
  id: number;
  name: string;
  academicId: string;
  email: string;
  phone: string;
  batch: string;
  semester: number;
  gpa: number;
  backlogs: number;
  attendance: AttendanceRecord[];
  classAdvisor: string | null;
  redFlags: string[];
}

interface StudentFormProps {
  student?: Student | null;
  onSubmit: (data: Omit<Student, 'id'>) => void;
  onClose?: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>(student ? {
    name: student.name,
    academicId: student.academicId,
    email: student.email,
    phone: student.phone,
    batch: student.batch,
    semester: student.semester,
    gpa: student.gpa,
    backlogs: student.backlogs,
    attendance: student.attendance,
    classAdvisor: student.classAdvisor ?? '',
    redFlags: student.redFlags
  } : {
    name: '',
    academicId: '',
    email: '',
    phone: '',
    batch: '',
    semester: 1,
    gpa: 0,
    backlogs: 0,
    attendance: [],
    classAdvisor: '',
    redFlags: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (onClose) onClose();
    setFormData({
      name: '',
      academicId: '',
      email: '',
      phone: '',
      batch: '',
      semester: 1,
      gpa: 0,
      backlogs: 0,
      attendance: [],
      classAdvisor: '',
      redFlags: []
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Academic ID:</label>
        <input
          type="text"
          name="academicId"
          value={formData.academicId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Batch:</label>
        <input
          type="text"
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Semester:</label>
        <input
          type="number"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentForm;
