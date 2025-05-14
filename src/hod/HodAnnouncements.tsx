import { useState } from 'react';
import { BellIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import Select from 'react-select';

interface Announcement {
  id: number;
  title: string;
  audience: string;
  date: string;
  attachments: string[];
}

export function HodAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);

  const audienceOptions = [
    { value: 'Faculty', label: 'Faculty' },
    { value: 'Students', label: 'Students' },
    { value: 'Specific Class/Batch', label: 'Specific Class/Batch' },
  ];

  const handleCreateAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: announcements.length + 1,
      title,
      audience: audience || 'General',
      date: new Date().toLocaleDateString(),
      attachments,
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setTitle('');
    setAudience(null);
    setAttachments([]);
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Notices / Announcements"
        subtitle="Manage departmental announcements"
        icon={BellIcon}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Announcement</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
          <Select
            options={audienceOptions}
            value={audienceOptions.find(option => option.value === audience)}
            onChange={(option) => setAudience(option?.value || null)}
            className="mb-4"
            placeholder="Select Target Audience"
          />
          <input
            type="text"
            placeholder="Attach Files (comma separated URLs)"
            value={attachments.join(', ')}
            onChange={(e) => setAttachments(e.target.value.split(',').map(file => file.trim()))}
            className="border rounded-lg p-2 w-full"
          />
          <button
            onClick={handleCreateAnnouncement}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Create Announcement
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">View History</h3>
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="flex justify-between p-4">
                <div>
                  <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                  <p className="text-sm text-gray-600">
                    Audience: {announcement.audience} • Date: {announcement.date}
                  </p>
                  {announcement.attachments.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Attachments: {announcement.attachments.join(', ')}
                    </p>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No announcements made yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notices</h3>
        <p className="text-sm text-gray-600">View circulars sent from the principal or admin.</p>
        {/* Placeholder for admin notices */}
        <div className="mt-4">
          <p className="text-gray-500">Admin notices will be shown here.</p>
        </div>
      </div>
    </div>
  );
}