import {
  BarChart2,
  Award,
  Clock,
  BookOpen,
  Users,
  Brain,
  Target,
  ChevronRight,
  Trophy,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

const SUBJECTS = [
  {
    name: 'Mathematics',
    grade: 'A',
    score: 92,
    attendance: 95,
    trend: '+5%',
    lastAssessment: '95/100',
    priority: 'high' as const,
  },
  {
    name: 'Physics',
    grade: 'A-',
    score: 88,
    attendance: 90,
    trend: '+3%',
    lastAssessment: '88/100',
    priority: 'medium' as const,
  },
  {
    name: 'Chemistry',
    grade: 'B+',
    score: 85,
    attendance: 88,
    trend: '+2%',
    lastAssessment: '85/100',
    priority: 'low' as const,
  },
  {
    name: 'Computer Science',
    grade: 'A',
    score: 94,
    attendance: 92,
    trend: '+4%',
    lastAssessment: '94/100',
    priority: 'high' as const,
  },
];

const PERFORMANCE_METRICS = [
  {
    title: 'Overall GPA',
    value: '3.8',
    trend: '+0.2',
    icon: Award,
    color: 'from-blue-600 to-blue-700',
  },
  {
    title: 'Attendance Rate',
    value: '92%',
    trend: '+5%',
    icon: Clock,
    color: 'from-green-600 to-green-700',
  },
  {
    title: 'Completed Courses',
    value: '12/15',
    trend: '+2',
    icon: BookOpen,
    color: 'from-purple-600 to-purple-700',
  },
  {
    title: 'Class Rank',
    value: '5/120',
    trend: '+2',
    icon: Users,
    color: 'from-amber-600 to-amber-700',
  },
  {
    title: 'Learning Score',
    value: '88%',
    trend: '+3%',
    icon: Brain,
    color: 'from-pink-600 to-pink-700',
  },
  {
    title: 'Goals Achieved',
    value: '8/10',
    trend: '+2',
    icon: Target,
    color: 'from-indigo-600 to-indigo-700',
  },
];

const MetricCard = ({ metric }: { metric: typeof PERFORMANCE_METRICS[0] }) => (
  <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{metric.title}</p>
        <div className="flex items-baseline mt-1">
          <p className="text-2xl font-bold text-foreground">
            {metric.value}
          </p>
          <span
            className={`ml-2 text-sm ${
              metric.trend.startsWith('+')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {metric.trend}
          </span>
        </div>
      </div>
      <div
        className={`p-3 rounded-2xl bg-gradient-to-r ${metric.color} shadow-sm`}
      >
        <metric.icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
);

const SubjectItem = ({ subject }: { subject: typeof SUBJECTS[0] & { priority: 'high' | 'medium' | 'low' } }) => {
  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-amber-200 bg-amber-50',
    low: 'border-emerald-200 bg-emerald-50',
  };

  return (
    <div className="group relative space-y-4 pb-4 last:pb-0">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-opacity group-last:opacity-0" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg border ${priorityColors[subject.priority]}`}>
            <span className="text-sm font-medium text-foreground">
              {subject.name[0]}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-foreground">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">
              Last assessment: {subject.lastAssessment}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              subject.grade.startsWith('A')
                ? 'bg-green-100 text-green-700'
                : subject.grade.startsWith('B')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {subject.grade}
          </span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Performance</span>
            <span className="font-medium text-foreground">
              {subject.score}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${subject.score}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Attendance</span>
            <span className="font-medium text-foreground">
              {subject.attendance}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
              style={{ width: `${subject.attendance}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export function Progress() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Academic Progress"
        subtitle="Track your performance and achievements"
        icon={BarChart2}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PERFORMANCE_METRICS.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Subject Performance
          </h2>
          <button className="text-sm text-primary hover:text-primary/80 flex items-center">
            View Detailed Report
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-8">
          {SUBJECTS.map((subject, index) => (
            <SubjectItem key={index} subject={subject} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Achievements
            </h2>
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div className="space-y-6">
            {[
              {
                title: 'Perfect Attendance - February',
                date: '2024-02-28',
                icon: CheckCircle,
                type: 'attendance',
              },
              {
                title: 'Top Performer in Physics',
                date: '2024-02-15',
                icon: Award,
                type: 'performance',
              },
              {
                title: 'Completed Advanced Math Course',
                date: '2024-02-01',
                icon: BookOpen,
                type: 'completion',
              },
            ].map((achievement, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-background hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                  ${achievement.type === 'attendance' ? 'bg-green-100' : 
                    achievement.type === 'performance' ? 'bg-blue-100' : 'bg-purple-100'}`}
                >
                  <achievement.icon className={`w-6 h-6 ${
                    achievement.type === 'attendance' ? 'text-green-600' : 
                    achievement.type === 'performance' ? 'text-blue-600' : 'text-purple-600'}`} 
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Learning Analytics
          </h2>
          <div className="space-y-4">
            {[
              {
                label: 'Study Hours',
                value: '120h',
                target: '150h',
                progress: 80,
              },
              {
                label: 'Assignments Completed',
                value: '45',
                target: '50',
                progress: 90,
              },
              {
                label: 'Quiz Performance',
                value: '85%',
                target: '90%',
                progress: 94,
              },
            ].map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="text-foreground">
                    {metric.value} / {metric.target}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.progress >= 90
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : metric.progress >= 75
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                        : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {metric.progress}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}