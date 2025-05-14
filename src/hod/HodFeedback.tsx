import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import Select from 'react-select';

interface HodFeedbackType {
  id: number;
  type: 'Student' | 'Faculty';
  content: string;
  anonymous: boolean;
}

export function HodFeedback() {
  const [feedbacks, setFeedbacks] = useState<HodFeedbackType[]>([]);
  const [newFeedback, setNewFeedback] = useState<{ type: 'Student' | 'Faculty'; content: string; anonymous: boolean }>({
    type: 'Student',
    content: '',
    anonymous: false,
  });
  const [suggestion, setSuggestion] = useState('');

  const handleCollectFeedback = () => {
    const newFeedbackEntry: HodFeedbackType = {
      id: feedbacks.length + 1,
      type: newFeedback.type,
      content: newFeedback.content,
      anonymous: newFeedback.anonymous,
    };
    setFeedbacks([...feedbacks, newFeedbackEntry]);
    setNewFeedback({ type: 'Student', content: '', anonymous: false });
  };

  const handleSubmitSuggestion = () => {
    // Logic to submit suggestion to admin/principal
    console.log(`Suggestion submitted: ${suggestion}`);
    setSuggestion('');
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Feedback & Suggestions"
        subtitle="Collect and analyze feedback from students and faculty"
        icon={MessageSquare}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Collect Feedback</h3>
        <div className="space-y-4">
          <Select
            options={[
              { value: 'Student' as const, label: 'Student' },
              { value: 'Faculty' as const, label: 'Faculty' },
            ]}
            value={{ value: newFeedback.type, label: newFeedback.type } as { value: 'Student' | 'Faculty'; label: string }}
            onChange={(option) => {
              if (option && (option.value === 'Student' || option.value === 'Faculty')) {
                setNewFeedback({ ...newFeedback, type: option.value });
              }
            }}
            className="mb-4"
            placeholder="Select Feedback Type"
          />
          <textarea
            placeholder="Your Feedback"
            value={newFeedback.content}
            onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
            className="border rounded-lg p-2 w-full"
            rows={4}
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newFeedback.anonymous}
              onChange={(e) => setNewFeedback({ ...newFeedback, anonymous: e.target.checked })}
              className="mr-2"
            />
            Submit Anonymously
          </label>
          <button
            onClick={handleCollectFeedback}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Submit Feedback
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyze Feedback</h3>
        <p className="text-sm text-gray-600">Feedback analysis charts and sentiment summary will be displayed here.</p>
        {/* Placeholder for feedback analysis charts */}
        <div className="mt-4">
          <p className="text-gray-500">Analysis data will be shown here.</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Suggestions</h3>
        <textarea
          placeholder="Your Suggestion"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          className="border rounded-lg p-2 w-full"
          rows={4}
        />
        <button
          onClick={handleSubmitSuggestion}
          className="bg-blue-500 text-white rounded-lg p-2 mt-4"
        >
          Submit Suggestion
        </button>
      </div>
    </div>
  );
}