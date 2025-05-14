import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, View, EventProps } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { 
  format, 
  parse, 
  startOfWeek, 
  getDay, 
  addDays,
  differenceInCalendarDays,
  startOfDay,
  addMonths,
  addWeeks
} from 'date-fns';
import { enIN } from 'date-fns/locale';
import { CalendarIcon, PlusCircle, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import { endOfWeek } from 'date-fns';


enum EventType {
  CLASS = 'class',
  EVENT = 'event'
}

enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

enum AppTab {
  TIMETABLE = 'timetable',
  APPROVALS = 'approvals',
  SUBSTITUTIONS = 'substitutions'
}

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    type: EventType;
    faculty?: string;
    room?: string;
    details?: string;
    status: EventStatus;
  };
};

type SubstitutionRequest = {
  id: string;
  original: string;
  substitute: string;
  date: Date;
  course: string;
  status: EventStatus;
};

const locales = { 'en-IN': enIN };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const DragAndDropCalendar = withDragAndDrop<CalendarEvent>(Calendar);

const mockFaculty = [
  { id: '1', name: 'Dr. Smith' },
  { id: '2', name: 'Prof. Johnson' },
  { id: '3', name: 'Dr. Williams' },
  { id: '4', name: 'Prof. Brown' },
  { id: '5', name: 'Dr. Davis' }
];

const mockRooms = [
  { id: '1', number: '101' },
  { id: '2', number: '102' },
  { id: '3', number: '103' },
  { id: '4', number: '104' },
  { id: '5', number: '105' }
];

const ScheduleManagement = () => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    resource: { type: EventType.CLASS, status: EventStatus.PENDING }
  });
  const [conflict, setConflict] = useState<string | null>(null);
  const [substitutionRequests] = useState<SubstitutionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TIMETABLE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateRandomEvents = (): CalendarEvent[] => {
      const courses = ['CS101', 'CS102', 'CS201', 'CS202', 'MATH101', 'PHYS101', 'CHEM101'];
      const today = new Date();
      const monday = startOfWeek(today, { weekStartsOn: 1 });

      return Array.from({ length: 5 }).flatMap((_, dayIndex) => {
        const dayDate = addDays(monday, dayIndex);
        const lecturesPerDay = 2 + Math.floor(Math.random() * 3);

        return Array.from({ length: lecturesPerDay }).map((_, i) => {
          const startHour = 9 + Math.floor(Math.random() * 8);
          const isSameDay = differenceInCalendarDays(dayDate, today) === 0;
          const status = isSameDay ? EventStatus.PENDING : EventStatus.APPROVED;

          return {
            id: `event-${dayIndex}-${i}`,
            title: courses[Math.floor(Math.random() * courses.length)],
            start: new Date(dayDate.setHours(startHour, 0, 0, 0)),
            end: new Date(dayDate.setHours(startHour + 1, 0, 0, 0)),
            resource: {
              type: EventType.CLASS,
              faculty: mockFaculty[Math.floor(Math.random() * mockFaculty.length)].name,
              room: mockRooms[Math.floor(Math.random() * mockRooms.length)].number,
              status
            }
          };
        });
      });
    };

    setTimeout(() => {
      setEvents(generateRandomEvents());
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setNewEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      resource: { 
        type: EventType.CLASS,
        status: EventStatus.PENDING
      }
    });
    setIsModalOpen(true);
  }, []);

  const handleEventDrop = useCallback((args: {
    event: CalendarEvent;
    start: string | Date;
    end: string | Date;
  }) => {
    const { event, start: startArg, end: endArg } = args;
    const start = typeof startArg === 'string' ? new Date(startArg) : startArg;
    const end = typeof endArg === 'string' ? new Date(endArg) : endArg;
    const conflict = checkConflicts({ ...event, start, end }, event.id);
    if (conflict) {
      setConflict(conflict);
      setTimeout(() => setConflict(null), 3000);
      return;
    }
    
    setEvents(prev => prev.map(ev => 
      ev.id === event.id ? { ...ev, start, end } : ev
    ));
  }, []);

  const checkConflicts = useCallback((event: CalendarEvent, currentId?: string): string | null => {
    const isOverlapping = events.some(ev => 
      ev.id !== currentId &&
      ev.resource.type === EventType.CLASS &&
      event.start >= ev.start && event.start < ev.end &&
      (ev.resource.room === event.resource.room || ev.resource.faculty === event.resource.faculty)
    );

    return isOverlapping ? 'Faculty or room double booking detected' : null;
  }, [events]);

  const validateEvent = useCallback((event: Partial<CalendarEvent>): string | null => {
    if (!event.title?.trim()) return 'Title is required';
    if (!event.start || !event.end) return 'Start and end times are required';
    if (event.start >= event.end) return 'End time must be after start time';
    if (event.resource?.type === EventType.CLASS) {
      if (!event.resource.faculty) return 'Faculty is required';
      if (!event.resource.room) return 'Room is required';
    }
    return null;
  }, []);

  const handleCreateEvent = useCallback(() => {
    const validationError = validateEvent(newEvent);
    if (validationError) {
      setConflict(validationError);
      setTimeout(() => setConflict(null), 3000);
      return;
    }

    const conflict = checkConflicts(newEvent as CalendarEvent);
    if (conflict) {
      setConflict(conflict);
      setTimeout(() => setConflict(null), 3000);
      return;
    }

    setEvents(prev => [...prev, {
      ...newEvent,
      id: `event-${Date.now()}`,
      resource: { ...newEvent.resource, status: EventStatus.PENDING }
    } as CalendarEvent]);
    setIsModalOpen(false);
  }, [newEvent, checkConflicts, validateEvent]);

  const EventComponent = ({ event }: EventProps<CalendarEvent>) => (
    <div className={`p-2 rounded border-l-4 ${
      event.resource.status === EventStatus.PENDING ? 'bg-yellow-50 border-yellow-400' :
      event.resource.type === EventType.CLASS ? 'bg-blue-50 border-blue-500' :
      'bg-purple-50 border-purple-500'
    }`}>
      <div className="font-medium truncate">{event.title}</div>
      {event.resource.faculty && (
        <div className="text-sm text-gray-600 truncate">{event.resource.faculty}</div>
      )}
      <div className="text-xs text-gray-500 mt-1">
        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
        {event.resource.room && ` • Room ${event.resource.room}`}
      </div>
    </div>
  );

  const ApprovalItem = ({ event }: { event: CalendarEvent }) => (
    <div className="p-4 mb-2 bg-white rounded-lg shadow-sm border">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="font-medium flex items-center gap-2">
            {event.title}
            <Badge variant={event.resource.status === EventStatus.APPROVED ? 'success' : 'destructive'}>
              {event.resource.status}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            {format(event.start, 'dd/MM/yyyy HH:mm')} - {format(event.end, 'HH:mm')}
          </div>
          {event.resource.faculty && <div className="text-sm">Faculty: {event.resource.faculty}</div>}
        </div>
        {event.resource.status === EventStatus.PENDING && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleStatusChange(event.id, EventStatus.APPROVED)}>
              Approve
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleStatusChange(event.id, EventStatus.REJECTED)}>
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const handleStatusChange = useCallback((eventId: string, status: EventStatus) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { 
        ...event, 
        resource: { 
          ...event.resource, 
          status: status || EventStatus.PENDING 
        } 
      } : event
    ));
  }, []);

  return (
    <div className="h-full flex flex-col">

      <PageHeader
        title="Schedule Management"
        subtitle="Interactive timetable and academic calendar"
        icon={CalendarIcon}
        extraContent={
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Event
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        }
      />

      {conflict && (
        <div className="mx-4 mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {conflict}
        </div>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as AppTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="px-4">
          <TabsTrigger value={AppTab.TIMETABLE}>Timetable</TabsTrigger>
          <TabsTrigger value={AppTab.APPROVALS}>Approvals</TabsTrigger>
          <TabsTrigger value={AppTab.SUBSTITUTIONS}>Substitutions</TabsTrigger>
        </TabsList>

        <TabsContent value={AppTab.TIMETABLE} className="flex-1 flex flex-col">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white shadow-md">
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (view === Views.DAY) setDate(addDays(date, -1));
            if (view === Views.WEEK) setDate(addWeeks(date, -1));
            if (view === Views.MONTH) setDate(addMonths(date, -1));
          }}
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (view === Views.DAY) setDate(addDays(date, 1));
            if (view === Views.WEEK) setDate(addWeeks(date, 1));
            if (view === Views.MONTH) setDate(addMonths(date, 1));
          }}
        >
          →
        </Button>
      </div>
      <span className="font-semibold text-lg whitespace-nowrap">
        {view === Views.MONTH && format(date, 'MMMM yyyy')}
        {view === Views.WEEK && `${format(date, 'MMM dd')} - ${format(endOfWeek(date), 'MMM dd')}`}
        {view === Views.DAY && format(date, 'MMMM dd, yyyy')}
      </span>
    </div>

    {/* Responsive View Switcher */}
    <div className="w-full sm:w-auto">
      <div className="hidden sm:flex gap-1">
        {[Views.MONTH, Views.WEEK, Views.DAY].map((v) => (
          <Button
            key={v}
            variant={view === v ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView(v as View)}
          >
            {v.charAt(0) + v.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>
      <Select
        value={view}
        onChange={(value) => setView(value as View)}
        className="sm:hidden"
      >
        {[Views.MONTH, Views.WEEK, Views.DAY].map((v) => (
          <option key={v} value={v}>
            {v.charAt(0) + v.slice(1).toLowerCase()}
          </option>
        ))}
      </Select>
    </div>
  </div>

  <div className="h-[calc(100vh-200px)] bg-background rounded-lg shadow-sm border">
    {isLoading ? (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    ) : (
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        selectable
        components={{ event: EventComponent }}
        eventPropGetter={() => ({
          className: 'hover:shadow-md transition-shadow'
        })}
        className="h-full rounded-lg border-none"
        min={new Date(0, 0, 0, 8, 0)}
        max={new Date(0, 0, 0, 20, 0)}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.WEEK}
        step={60}
        timeslots={1}
        scrollToTime={startOfDay(new Date())}
      />
    )}
  </div>
</TabsContent>

        <TabsContent value={AppTab.APPROVALS} className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Approval Requests</h3>
              <ScrollArea className="h-[500px] pr-4">
                { events.filter(e => e.resource.status === EventStatus.PENDING).length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No pending approval requests.</div>
                ) : (
                  events.filter(e => e.resource.status === EventStatus.PENDING).map(event => (
                    <ApprovalItem key={event.id} event={event} />
                  ))
                )}
              </ScrollArea>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Approval History</h3>
              <ScrollArea className="h-[500px] pr-4">
                {events.filter(e => e.resource.status !== EventStatus.PENDING).length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No approval history available.</div>
                ) : (
                  events.filter(e => e.resource.status !== EventStatus.PENDING).map(event => (
                    <div key={event.id} className="p-3 mb-2 bg-white rounded-lg shadow-sm border">
                      <div className="flex items-center gap-2">
                        <Badge variant={event.resource.status === EventStatus.APPROVED ? 'success' : 'destructive'}>
                          {event.resource.status}
                        </Badge>
                        <div className="text-sm font-medium">{event.title}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(event.start, 'MMM dd, yyyy')} • {event.resource.faculty || 'Special Event'}
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value={AppTab.SUBSTITUTIONS} className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Request Substitution</h3>
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <div className="space-y-3">
                  <Select
                    value=""
                    onChange={(value: string) => console.log(value)}
                    label="Original Faculty"
                  >
                    {mockFaculty.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </Select>
                  <Input 
                    type="datetime-local" 
                    label="Date/Time"
                    value=""
                    onChange={() => {}}
                  />
                  <Select
                    value=""
                    onChange={(value: string) => console.log(value)}
                    label="Suggested Substitutes"
                  >
                    {mockFaculty.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </Select>
                  <Button>Submit Request</Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Substitutions</h3>
              <ScrollArea className="h-[500px] pr-4">
                {substitutionRequests.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No active substitutions.</div>
                ) : (
                  substitutionRequests.map(req => (
                    <div key={req.id} className="p-4 mb-2 bg-white rounded-lg shadow-sm border">
                      <div className="flex items-center gap-2">
                        <Badge variant={req.status === EventStatus.APPROVED ? 'success' : 'destructive'}>
                          {req.status}
                        </Badge>
                        <div className="text-sm font-medium">{req.course}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <div className="font-medium">{req.original} → {req.substitute}</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {format(req.date, 'dd/MM/yyyy h:mm a')} • {req.course}
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={newEvent.id ? 'Edit Event' : 'Create New Event'}
      >
        <div className="space-y-4">
          <Input
            label="Event Title"
            value={newEvent.title || ''}
            onChange={(value: string) => setNewEvent(prev => ({ ...prev, title: value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Start Time"
              value={newEvent.start ? format(newEvent.start, 'yyyy-MM-dd\'T\'HH:mm') : ''}
              onChange={(value: string) => setNewEvent(prev => ({ ...prev, start: new Date(value) }))}
            />
            <Input
              type="datetime-local"
              label="End Time"
              value={newEvent.end ? format(newEvent.end, 'yyyy-MM-dd\'T\'HH:mm') : ''}
              onChange={(value: string) => setNewEvent(prev => ({ ...prev, end: new Date(value) }))}
            />
          </div>
          <Select
            value={newEvent.resource?.room || ''}
            onChange={(value: string) => setNewEvent(prev => ({
              ...prev,
              resource: {
                ...prev.resource,
                room: value,
                type: EventType.CLASS,
                status: prev.resource?.status || EventStatus.PENDING
              }
            }))}
            label="Select Room"
          >
            {mockRooms.map(room => (
              <option key={room.id} value={room.number}>
                Room {room.number}
              </option>
            ))}
          </Select>
          <Select
            value={newEvent.resource?.faculty || ''}
            onChange={(value: string) => setNewEvent(prev => ({
              ...prev,
              resource: {
                ...prev.resource,
                faculty: value,
                type: EventType.CLASS,
                status: prev.resource?.status || EventStatus.PENDING
              }
            }))}
            label="Select Faculty"
          >
            {mockFaculty.map(faculty => (
              <option key={faculty.id} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              Save Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;
