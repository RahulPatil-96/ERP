import { useState } from 'react';
import { BookOpenIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

interface CourseOutcome {
  outcome: string;
  achievementLevel: number; // 0-100 scale
}

interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  syllabus: string;
  primaryFaculty: string;
  secondaryFaculty?: string;
  coTeaching: boolean;
  enrollment: number;
  passRate: number; // percentage
  failRate: number; // percentage
  courseOutcomes: CourseOutcome[];
}

export function CourseManagement() {
  const [courses] = useState<Course[]>([
    {
      id: 1,
      name: 'Introduction to Computer Science',
      code: 'CS101',
      credits: 3,
      syllabus: 'Basics of computer science, programming, and algorithms.',
      primaryFaculty: 'Alice Johnson',
      secondaryFaculty: 'Bob Smith',
      coTeaching: true,
      enrollment: 120,
      passRate: 85,
      failRate: 15,
      courseOutcomes: [
        { outcome: 'Understand basic programming concepts', achievementLevel: 90 },
        { outcome: 'Solve problems using algorithms', achievementLevel: 80 },
      ],
    },
    {
      id: 2,
      name: 'Advanced Marketing',
      code: 'MK401',
      credits: 4,
      syllabus: 'In-depth study of marketing strategies and consumer behavior.',
      primaryFaculty: 'Bob Smith',
      secondaryFaculty: 'Alice Johnson',
      coTeaching: true,
      enrollment: 80,
      passRate: 75,
      failRate: 25,
      courseOutcomes: [
        { outcome: 'Develop marketing strategies', achievementLevel: 70 },
        { outcome: 'Analyze consumer behavior', achievementLevel: 85 },
      ],
    },
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Course Management"
        subtitle="Manage courses in your department"
        icon={BookOpenIcon}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Courses</h3>
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="flex justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900">{course.name}</h4>
                <p className="text-sm text-gray-600">
                  {course.code} • Credits: {course.credits} • Taught by: {course.primaryFaculty} {course.secondaryFaculty && `(Co-taught by: ${course.secondaryFaculty})`}
                </p>
                <p className="text-sm text-gray-600">Syllabus: {course.syllabus}</p>
                <p className="text-sm text-gray-600">Enrollment: {course.enrollment}</p>
                <p className="text-sm text-gray-600">Pass Rate: {course.passRate}% • Fail Rate: {course.failRate}%</p>
                <div className="mt-2">
                  <h5 className="font-medium">Course Outcomes:</h5>
                  <ul className="list-disc pl-5">
                    {course.courseOutcomes.map((co, index) => (
                      <li key={index}>
                        {co.outcome} - Achievement Level: {co.achievementLevel}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-blue-500 hover:text-blue-600">Edit</button>
                <button className="text-red-500 hover:text-red-600">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}