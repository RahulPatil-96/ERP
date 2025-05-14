import { useState } from 'react';
import { Trash2, Edit2, Search } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Important Faculty Meeting",
      content: "There will be a faculty meeting next week to discuss curriculum changes.",
      date: "2025-03-07 10:00 AM",
    },
    {
      id: 2,
      title: "Holiday Announcement",
      content: "The university will be closed for the holidays from December 20th to January 5th.",
      date: "2025-03-06 03:00 PM",
    },
  ]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePostAnnouncement = () => {
    const newAnnouncement = {
      id: announcements.length + 1,
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setNewTitle('');
    setNewContent('');
  };

  const handleEditAnnouncement = (id: number) => {
    const announcementToEdit = announcements.find((announcement) => announcement.id === id);
    if (announcementToEdit) {
      setNewTitle(announcementToEdit.title);
      setNewContent(announcementToEdit.content);
      // Delete the announcement to edit it and allow re-posting
      setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
    }
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
  };

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Faculty Announcements"
        subtitle="Important updates and announcements for faculty members"
        icon={Edit2}
      />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 flex flex-col space-y-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements..."
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Announcement Form */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Post a New Announcement</h2>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />
          <button
            onClick={handlePostAnnouncement}
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Post Announcement
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center text-gray-500">No announcements found.</div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 bg-white rounded-lg shadow-md flex justify-between items-start space-x-4"
              >
                <div className="flex flex-col w-3/4">
                  <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
                  <p className="text-gray-700 mt-2">{announcement.content}</p>
                  <span className="text-xs text-gray-500 mt-4">{announcement.date}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAnnouncement(announcement.id)}
                    className="text-indigo-500 hover:text-indigo-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
