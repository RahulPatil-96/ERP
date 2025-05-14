import { useState } from 'react';
import { Star } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

type Faculty = {
  id: string;
  name: string;
  questions: {
    id: string;
    text: string;
  }[];
};

type Ratings = {
  [facultyId: string]: {
    [questionId: string]: number;
  };
};

export function Feedback() {
  const [ratings, setRatings] = useState<Ratings>({});
  const [feedbacks, setFeedbacks] = useState<{ [facultyId: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // Sample faculties data - can be fetched from API
  const faculties: Faculty[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      questions: [
        { id: 'q1', text: 'Clarity of explanations' },
        { id: 'q2', text: 'Teaching methodology' },
        { id: 'q3', text: 'Availability for doubt solving' },
      ],
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      questions: [
        { id: 'q1', text: 'Subject knowledge' },
        { id: 'q2', text: 'Classroom management' },
        { id: 'q3', text: 'Assignment feedback quality' },
      ],
    },
  ];

  const handleRatingChange = (facultyId: string, questionId: string, newRating: number) => {
    setRatings(prev => ({
      ...prev,
      [facultyId]: {
        ...prev[facultyId],
        [questionId]: newRating,
      },
    }));
  };

  const handleFeedbackChange = (facultyId: string, text: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [facultyId]: text,
    }));
  };

  const validateSubmission = () => {
    for (const faculty of faculties) {
      if (!feedbacks[faculty.id]?.trim()) return false;
      for (const question of faculty.questions) {
        if (!ratings[faculty.id]?.[question.id]) return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSubmission()) {
      alert('Please complete all ratings and feedbacks for all faculties');
      return;
    }

    // Prepare submission data
    const submissionData = faculties.map(faculty => ({
      facultyId: faculty.id,
      ratings: ratings[faculty.id],
      feedback: feedbacks[faculty.id],
    }));

    setSubmitted(true);
    console.log('Feedback Submitted:', submissionData);
  };

  return (
    <div className="space-y-8">
      <PageHeader
              title="Faculty Feedback"
              subtitle="Provide feedback for all faculties to help them improve"
              icon={Star}
      />

      <div className="w-full h-full p-6 bg-white shadow-lg rounded-xl">
        {submitted ? (
          <div className="text-center p-6 bg-green-100 rounded-lg">
            <h2 className="text-lg font-semibold text-green-700">Feedback Submitted Successfully!</h2>
            <p className="text-gray-700">Thank you for providing feedback for all faculties.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {faculties.map(faculty => (
              <div key={faculty.id} className="p-6 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{faculty.name}</h2>
                
                <div className="space-y-6">
                  {faculty.questions.map(question => (
                    <div key={question.id} className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-2">{question.text}</h3>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => handleRatingChange(faculty.id, question.id, num)}
                            className={`w-8 h-8 ${
                              num <= (ratings[faculty.id]?.[question.id] || 0)
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            } hover:text-yellow-500`}
                          >
                            <Star className="w-full h-full" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                      Additional Feedback for {faculty.name}
                    </h3>
                    <textarea
                      value={feedbacks[faculty.id] || ''}
                      onChange={(e) => handleFeedbackChange(faculty.id, e.target.value)}
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={`Your feedback for ${faculty.name}...`}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8">
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit All Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}