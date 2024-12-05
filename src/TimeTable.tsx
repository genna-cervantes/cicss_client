

const sortByStartTime = (timetable: any)=> {
  return timetable.sort((a: any, b: any) => {
    const startA = parseInt(a.timeBlock.start, 10);
    const startB = parseInt(b.timeBlock.start, 10);
    return startA - startB;
  });
};

// Timetable   component
export const Timetable = ({ data }: { data: any }) => {
    console.log(data)
  // Helper to format time
  const formatTime = (time: string): string => {
    const hours = parseInt(time.slice(0, 2), 10);
    const minutes = time.slice(2);
    const period = hours >= 12 ? "PM" : "AM";
    const standardHours = hours % 12 || 12; // Convert 0 or 12 to 12, otherwise use modulo 12
    return `${standardHours}:${minutes} ${period}`;
  };
  const monday = sortByStartTime(data.M);
  const tuesday = sortByStartTime(data.T);
  const wednesday = sortByStartTime(data.W);
  const thursday = sortByStartTime(data.TH);
  const friday = sortByStartTime(data.F);
  const saturday = sortByStartTime(data.S);

  return (
    <div className="grid grid-cols-6 gap-5 mx-10">
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center">M</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {monday.map((entry: any, index: any) => (
            <div
              key={index}
              className="border rounded-md shadow p-4 bg-white flex flex-col"
            >
              <div className="text-lg font-semibold">
                {entry.course.subject_code}
              </div>
              <div className="text-sm text-gray-500">{entry.prof.name}</div>
              <div className="text-sm">
                Room: <span className="font-medium">{entry.room.room_id}</span>
              </div>
              <div className="text-sm">
                Time:{" "}
                <span className="font-medium">
                  {formatTime(entry.timeBlock.start)} -{" "}
                  {formatTime(entry.timeBlock.end)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center">T</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {tuesday.map((entry: any, index: any) => (
            <div
              key={index}
              className="border rounded-md shadow p-4 bg-white flex flex-col"
            >
              <div className="text-lg font-semibold">
                {entry.course.subject_code}
              </div>
              <div className="text-sm text-gray-500">{entry.prof.name}</div>
              <div className="text-sm">
                Room: <span className="font-medium">{entry.room.room_id}</span>
              </div>
              <div className="text-sm">
                Time:{" "}
                <span className="font-medium">
                  {formatTime(entry.timeBlock.start)} -{" "}
                  {formatTime(entry.timeBlock.end)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center">W</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {wednesday.map((entry: any, index: any) => (
            <div
              key={index}
              className="border rounded-md shadow p-4 bg-white flex flex-col"
            >
              <div className="text-lg font-semibold">
                {entry.course.subject_code}
              </div>
              <div className="text-sm text-gray-500">{entry.prof.name}</div>
              <div className="text-sm">
                Room: <span className="font-medium">{entry.room.room_id}</span>
              </div>
              <div className="text-sm">
                Time:{" "}
                <span className="font-medium">
                  {formatTime(entry.timeBlock.start)} -{" "}
                  {formatTime(entry.timeBlock.end)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center">TH</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {thursday.map((entry: any, index: any) => (
            <div
              key={index}
              className="border rounded-md shadow p-4 bg-white flex flex-col"
            >
              <div className="text-lg font-semibold">
                {entry.course.subject_code}
              </div>
              <div className="text-sm text-gray-500">{entry.prof.name}</div>
              <div className="text-sm">
                Room: <span className="font-medium">{entry.room.room_id}</span>
              </div>
              <div className="text-sm">
                Time:{" "}
                <span className="font-medium">
                  {formatTime(entry.timeBlock.start)} -{" "}
                  {formatTime(entry.timeBlock.end)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center">F</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {friday.map((entry: any, index: any) => (
            <div
              key={index}
              className="border rounded-md shadow p-4 bg-white flex flex-col"
            >
              <div className="text-lg font-semibold">
                {entry.course.subject_code}
              </div>
              <div className="text-sm text-gray-500">{entry.prof.name}</div>
              <div className="text-sm">
                Room: <span className="font-medium">{entry.room.room_id}</span>
              </div>
              <div className="text-sm">
                Time:{" "}
                <span className="font-medium">
                  {formatTime(entry.timeBlock.start)} -{" "}
                  {formatTime(entry.timeBlock.end)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center">S</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {saturday.map((entry: any, index: any) => (
            <div
              key={index}
              className="border rounded-md shadow p-4 bg-white flex flex-col"
            >
              <div className="text-lg font-semibold">
                {entry.course.subject_code}
              </div>
              <div className="text-sm text-gray-500">{entry.prof.name}</div>
              <div className="text-sm">
                Room: <span className="font-medium">{entry.room.room_id}</span>
              </div>
              <div className="text-sm">
                Time:{" "}
                <span className="font-medium">
                  {formatTime(entry.timeBlock.start)} -{" "}
                  {formatTime(entry.timeBlock.end)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
