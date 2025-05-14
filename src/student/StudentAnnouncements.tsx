import { useState } from 'react';
import { Bell, Search, AlertTriangle, Megaphone, ClipboardList } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

type Announcement = {
  id: string;
  title: string;
  date: string;
  category: 'notice' | 'circular' | 'event' | 'alert' | 'academic';
  content: string;
  urgency: 'normal' | 'important' | 'critical';
};

export default function StudentAnnouncements() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Semester Exam Schedule Released',
      date: '2024-03-15',
      category: 'academic',
      content: 'The schedule for the upcoming semester examinations has been published. Students can access the timetable through the student portal...',
      urgency: 'important'
    },
    {
      id: '2',
      title: 'Library Closure Notice',
      date: '2024-03-14',
      category: 'notice',
      content: 'The central library will remain closed on March 20th for maintenance work...',
      urgency: 'normal'
    },
    {
      id: '3',
      title: 'Cultural Fest Registration Open',
      date: '2024-03-13',
      category: 'event',
      content: 'Registrations for the annual cultural fest "Spectra 2024" are now open. Last date to register: March 25th...',
      urgency: 'important'
    },
    {
      id: '4',
      title: 'Emergency Weather Alert',
      date: '2024-03-15',
      category: 'alert',
      content: 'Classes suspended on March 16th due to severe weather warning. Stay safe...',
      urgency: 'critical'
    },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: <Bell size={18} /> },
    { id: 'notice', name: 'Notices', icon: <ClipboardList size={18} /> },
    { id: 'circular', name: 'Circulars', icon: <Megaphone size={18} /> },
    { id: 'event', name: 'Events', icon: <AlertTriangle size={18} /> },
    { id: 'academic', name: 'Academic', icon: <ClipboardList size={18} /> },
  ];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alert': return 'bg-red-100 text-red-800';
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'notice': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-l-4 border-red-500';
      case 'important': return 'border-l-4 border-yellow-500';
      default: return 'border-l-2 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
    title="Announcements"
    subtitle="Important updates, notices, and circulars"
    icon={Bell}
  />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No announcements found matching your criteria
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${getUrgencyStyle(
                announcement.urgency
              )}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                    announcement.category
                  )}`}
                >
                  {announcement.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(announcement.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {expandedAnnouncement === announcement.id
                  ? announcement.content
                  : `${announcement.content.slice(0, 100)}...`}
              </p>
              <button
                onClick={() => setExpandedAnnouncement(
                  expandedAnnouncement === announcement.id ? null : announcement.id
                )}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {expandedAnnouncement === announcement.id ? 'Show less' : 'Read more'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}