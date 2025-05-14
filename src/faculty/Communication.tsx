import { useState, useEffect } from 'react';
import { CheckCircle, Bell, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

interface Message {
  id: number;
  subject: string;
  sender: string;
  content: string;
  isRead: boolean;
}

interface Announcement {
  content: string;
  recipient: string;
}

export function Communication() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('');
  const [announcement, setAnnouncement] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('All');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    // Simulate fetching messages and announcements
    const initialMessages = [
      { id: 1, subject: 'Important Exam Update', sender: 'Student A', content: 'Can you confirm the exam schedule?', isRead: false },
      { id: 2, subject: 'Assignment Submission', sender: 'Student B', content: 'I need more time to submit the assignment.', isRead: false },
      { id: 3, subject: 'Query Regarding Lecture Notes', sender: 'Student C', content: 'Where can I find the lecture notes for last week?', isRead: true },
    ];
    const initialAnnouncements = [
      { content: 'Midterm exam on March 15th.', recipient: 'All' },
      { content: 'Assignment 1 grades are released.', recipient: 'Students' },
    ];
    
    setMessages(initialMessages);
    setAnnouncements(initialAnnouncements);
    setUnreadMessages(initialMessages.filter((message) => !message.isRead).length);
  }, []);

  const handleSendMessage = () => {
    const newMsg = {
      id: messages.length + 1,
      subject: newSubject,
      sender: 'Faculty', // As the faculty is sending the message
      content: newMessage,
      isRead: false,
    };
    setMessages([newMsg, ...messages]);
    setNewMessage('');
    setNewSubject('');
  };

  const markMessageAsRead = (id: number) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, isRead: true } : msg
    );
    setMessages(updatedMessages);
    setUnreadMessages(updatedMessages.filter((message) => !message.isRead).length);
  };

  const handleAnnouncementSubmit = () => {
    const newAnnouncement = {
      content: announcement,
      recipient,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setAnnouncement('');
    setRecipient('All'); // Reset recipient to 'All' after posting
  };

  const deleteAnnouncement = (index: number) => {
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements.splice(index, 1);
    setAnnouncements(updatedAnnouncements);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Faculty Communication Page"
        subtitle="Send messages and announcements to students"
        icon={Bell}
        />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Unread Messages Notification */}
        <div className="mb-6 flex justify-between items-center text-lg font-semibold">
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            <span>Unread Messages: {unreadMessages}</span>
          </div>
        </div>

        {/* Inbox */}
        <div className="mb-6 overflow-y-auto flex-1">
          <h2 className="text-xl font-semibold text-gray-800">Inbox</h2>
          <div className="space-y-4 mt-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 bg-white rounded-lg shadow-md flex justify-between items-center cursor-pointer ${
                  message.isRead ? 'bg-gray-100' : 'bg-yellow-50'
                }`}
                onClick={() => markMessageAsRead(message.id)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{message.sender}</span>
                  <span className="text-lg font-bold text-gray-900">{message.subject}</span>
                </div>
                <CheckCircle
                  className={`w-6 h-6 ${message.isRead ? 'text-green-500' : 'text-gray-300'}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Compose New Message */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Compose Message</h2>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            rows={4}
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Send Message
          </button>
        </div>

        {/* Announcements */}
        <div className="mb-6 flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Announcements</h2>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Post a new announcement..."
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            rows={4}
          />
          <div className="mb-4">
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
              Select Recipient
            </label>
            <select
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="All">All</option>
              <option value="Faculty">Faculty</option>
              <option value="Students">Students</option>
            </select>
          </div>
          <button
            onClick={handleAnnouncementSubmit}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Post Announcement
          </button>

          <div className="space-y-4 mt-6">
            {announcements.map((announcement, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                <div className="text-sm text-gray-800">
                  <span className="font-semibold">{announcement.recipient}: </span>
                  {announcement.content}
                </div>
                <button onClick={() => deleteAnnouncement(index)}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
