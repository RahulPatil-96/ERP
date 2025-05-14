export function Calendar() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Attendance Calendar</h3>
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-10 border rounded flex items-center justify-center">
              {i < 31 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
