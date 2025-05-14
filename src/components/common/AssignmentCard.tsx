import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Progress } from '../../components/common/Progress';

// Interface for assignment
interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'late';
  score: number | null;
  description: string;
  attachments: string[];
}

const statusConfig = {
  pending: { icon: Clock, color: 'bg-amber-100 text-amber-800' },
  submitted: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' },
  late: { icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
};

// Format due date helper function
const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  const isPast = date < new Date();
  const formatted = date.toLocaleDateString();
  const distance = isPast ? 'Late' : `Due in ${Math.ceil((date.getTime() - Date.now()) / (1000 * 3600 * 24))} days`;

  return { formatted, distance, isPast };
};

// Assignment card component
export const AssignmentCard = ({
  assignment,
  onSelect,
}: {
  assignment: Assignment;
  onSelect: () => void;
}) => {
  const { formatted, distance, isPast } = formatDueDate(assignment.dueDate);
  const isLate = assignment.status === 'late' || isPast;
  const { icon: StatusIcon, color } = statusConfig[isLate ? 'late' : assignment.status];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="cursor-pointer"
      onClick={onSelect}
    >
      <Card className="h-full transition-all hover:ring-2 hover:ring-indigo-100">
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              {/* Subject Icon Placeholder */}
              <Clock className="w-5 h-5" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
              <StatusIcon className="inline-block w-4 h-4 mr-1.5" />
              {isLate ? 'Late' : assignment.status}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>

          <div className="mt-auto space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {formatted}
              </span>
              <span className={`font-medium ${isLate ? 'text-red-500' : 'text-gray-700'}`}>
                {distance}
              </span>
            </div>

            {assignment.score !== null && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Score</span>
                  <span className="font-semibold text-gray-700">{assignment.score}%</span>
                </div>
                <Progress value={assignment.score} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
