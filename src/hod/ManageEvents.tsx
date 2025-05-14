import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

interface Meeting {
  id: number;
  agenda: string;
  participants: string[];
  date: string;
  time: string;
  minutes?: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

export function EventsManagement() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [newMeeting, setNewMeeting] = useState({ agenda: '', participants: '', date: '', time: '', minutes: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });

  const handleScheduleMeeting = () => {
    const participantsArray = newMeeting.participants.split(',').map(participant => participant.trim());
    const newMeetingEntry: Meeting = {
      id: meetings.length + 1,
      agenda: newMeeting.agenda,
      participants: participantsArray,
      date: newMeeting.date,
      time: newMeeting.time,
      minutes: newMeeting.minutes,
    };
    setMeetings([...meetings, newMeetingEntry]);
    setNewMeeting({ agenda: '', participants: '', date: '', time: '', minutes: '' });
  };

  const handleAddEvent = () => {
    const newEventEntry: Event = {
      id: events.length + 1,
      title: newEvent.title,
      date: newEvent.date,
      description: newEvent.description,
    };
    setEvents([...events, newEventEntry]);
    setNewEvent({ title: '', date: '', description: '' });
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Meeting / Events Management"
        subtitle="Manage departmental meetings and events"
        icon={CalendarIcon}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Meetings</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Meeting Agenda"
            value={newMeeting.agenda}
            onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="text"
            placeholder="Participants (comma separated)"
            value={newMeeting.participants}
            onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="date"
            value={newMeeting.date}
            onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="time"
            value={newMeeting.time}
            onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />
          <textarea
            placeholder="Minutes of Meeting"
            value={newMeeting.minutes}
            onChange={(e) => setNewMeeting({ ...newMeeting, minutes: e.target.value })}
            className="border rounded-lg p-2 w-full"
            rows={3}
          />
          <button
            onClick={handleScheduleMeeting}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Schedule Meeting
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting List</h3>
        <div className="space-y-4">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <Card key={meeting.id} className="flex justify-between p-4">
                <div>
                  <h4 className="font-medium text-gray-900">{meeting.agenda}</h4>
                  <p className="text-sm text-gray-600">
                    Participants: {meeting.participants.join(', ')} • Date: {meeting.date} • Time: {meeting.time}
                  </p>
                  {meeting.minutes && (
                    <p className="text-sm text-gray-600 mt-2">Minutes: {meeting.minutes}</p>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No meetings scheduled yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Event</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />
          <textarea
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="border rounded-lg p-2 w-full"
            rows={3}
          />
          <button
            onClick={handleAddEvent}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Calendar</h3>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="flex justify-between p-4">
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">Date: {event.date}</p>
                  <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No events added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}