import React, { useState, useRef, useEffect } from "react";

// Define types
interface CourseBlock {
  id: number;
  courseCode: string;
  courseName: string;
  labLec: string;
  room: string;
  professor: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface TimeFormat {
  value: string;
  display: string;
}

interface DragInfo {
  blockId: number;
  offsetY: number;
}

interface ErrorLog {
  id: number;
  message: string;
  timestamp: Date;
}

const CourseSchedule: React.FC = () => {
  const [scheduleBlocks, setScheduleBlocks] = useState<CourseBlock[]>([
    {
      id: 1,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "MON",
      startTime: "09:30",
      endTime: "12:30",
      color: "bg-gray-300",
    },
    {
      id: 2,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "TUE",
      startTime: "10:00",
      endTime: "12:30",
      color: "bg-yellow-300",
    },
    {
      id: 3,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "WED",
      startTime: "07:30",
      endTime: "11:30",
      color: "bg-blue-300",
    },
    {
      id: 4,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "WED",
      startTime: "12:00",
      endTime: "15:00",
      color: "bg-gray-300",
    },
    {
      id: 5,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "WED",
      startTime: "17:00",
      endTime: "20:30",
      color: "bg-purple-400",
    },
    {
      id: 6,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "THURS",
      startTime: "10:00",
      endTime: "15:00",
      color: "bg-green-300",
    },
    {
      id: 7,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "THURS",
      startTime: "15:30",
      endTime: "20:00",
      color: "bg-purple-400",
    },
    {
      id: 8,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "FRI",
      startTime: "15:30",
      endTime: "17:30",
      color: "bg-yellow-300",
    },
    {
      id: 9,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "MON",
      startTime: "14:00",
      endTime: "18:00",
      color: "bg-blue-300",
    },
    {
      id: 10,
      courseCode: "Course Code",
      courseName: "Course Name",
      labLec: "Lab/Lec",
      room: "Room",
      professor: "Professor",
      day: "MON",
      startTime: "18:00",
      endTime: "21:00",
      color: "bg-green-300",
    },
  ]);

  const [draggedBlock, setDraggedBlock] = useState<CourseBlock | null>(null);
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
  const [ghostPosition, setGhostPosition] = useState<{
    day: string;
    top: number;
  } | null>(null);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);

  const days: string[] = ["MON", "TUE", "WED", "THURS", "FRI", "SAT"];
  const hours: TimeFormat[] = [];
  const cellHeight = 32; // Each cell is 32px high
  const errorLogLimit = 10; // Maximum number of error logs to show

  // Generate hours from 7am to 9pm
  for (let hour = 7; hour <= 21; hour++) {
    const formattedHour =
      hour === 12
        ? "12:00 PM"
        : hour < 12
        ? `${hour}:00 AM`
        : `${hour - 12}:00 PM`;
    hours.push({
      value: hour < 10 ? `0${hour}:00` : `${hour}:00`,
      display: formattedHour,
    });
    if (hour < 21) {
      const halfHour =
        hour === 12
          ? "12:30 PM"
          : hour < 12
          ? `${hour}:30 AM`
          : `${hour - 12}:30 PM`;
      hours.push({
        value: hour < 10 ? `0${hour}:30` : `${hour}:30`,
        display: halfHour,
      });
    }
  }

  const gridRef = useRef<HTMLDivElement>(null);

  // Convert time string to position
  const getPositionFromTime = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    // Calculate blocks position precisely based on hours and minutes
    return (hours - 7) * 2 + minutes / 30;
  };

  // Get height based on time difference (adjusted to include the exact end time cell)
  const getBlockHeight = (startTime: string, endTime: string): number => {
    const startPosition = getPositionFromTime(startTime);
    // Calculate to include the end time exactly
    const endPosition = getPositionFromTime(endTime);
    return endPosition * cellHeight - startPosition * cellHeight;
  };

  // Get time from grid position, snapped to half-hour increments
  const getTimeFromPosition = (y: number): string => {
    // Snap to nearest half-hour
    const cellIndex = Math.round(y / cellHeight);
    const hours = Math.floor(cellIndex / 2) + 7;
    const minutes = (cellIndex % 2) * 30;

    // Ensure we stay within time bounds (7:00 - 21:30)
    if (hours < 7) return "07:00";
    if (hours > 21 || (hours === 21 && minutes > 0)) return "21:00";

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Format time for display (convert 24hr to 12hr)
  const formatTimeForDisplay = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Log an error to the terminal
  const logError = (message: string): void => {
    setErrorLogs((prevLogs) => {
      // Create new log entry
      const newLog = {
        id: Date.now(),
        message,
        timestamp: new Date(),
      };

      // Add to beginning of array and limit number of logs
      const updatedLogs = [newLog, ...prevLogs].slice(0, errorLogLimit);

      // Show terminal
      setShowTerminal(true);

      return updatedLogs;
    });
  };

  // Check for time overlap
  const hasOverlap = (
    day: string,
    startTime: string,
    endTime: string,
    blockId: number
  ): boolean => {
    let hasConflict = false;
    let conflictBlocks: CourseBlock[] = [];

    scheduleBlocks.forEach((block) => {
      if (block.id === blockId || block.day !== day) return;

      const blockStart = getPositionFromTime(block.startTime);
      const blockEnd = getPositionFromTime(block.endTime);
      const newStart = getPositionFromTime(startTime);
      const newEnd = getPositionFromTime(endTime);

      const overlap =
        (newStart >= blockStart && newStart < blockEnd) ||
        (newEnd > blockStart && newEnd <= blockEnd) ||
        (newStart <= blockStart && newEnd >= blockEnd);

      if (overlap) {
        hasConflict = true;
        conflictBlocks.push(block);
      }
    });

    // Log errors for conflicts
    if (hasConflict) {
      const errorInfo = conflictBlocks
        .map(
          (block) =>
            `Block #${block.id} <${block.courseCode}> (${
              block.day
            } ${formatTimeForDisplay(block.startTime)}-${formatTimeForDisplay(
              block.endTime
            )})`
        )
        .join(", ");

      logError(`Overlap detected: Schedule block conflicts with ${errorInfo}`);
    }

    return hasConflict;
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    block: CourseBlock
  ): void => {
    if (!e.currentTarget) return;

    // Calculate the offset from the top of the block
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    setDraggedBlock(block);
    setDragInfo({ blockId: block.id, offsetY });

    // Set drag image to be transparent (helps with custom positioning)
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    day: string
  ): void => {
    e.preventDefault();

    if (!draggedBlock || !gridRef.current || !dragInfo) return;

    const rect = gridRef.current.getBoundingClientRect();
    // Calculate position for ghost element
    const adjustedY = e.clientY - rect.top - dragInfo.offsetY;

    // Create ghost position based on current drag position
    setGhostPosition({
      day,
      top: adjustedY,
    });
  };

  const handleDragEnd = (): void => {
    setDraggedBlock(null);
    setDragInfo(null);
    setGhostPosition(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    day: string
  ): void => {
    e.preventDefault();
    if (!draggedBlock || !gridRef.current || !dragInfo) return;

    const rect = gridRef.current.getBoundingClientRect();
    // Use the offset to position the block where the user grabbed it
    const adjustedY = e.clientY - rect.top - dragInfo.offsetY;

    // Calculate new start time based on drop position
    const newStartTime = getTimeFromPosition(adjustedY);

    // Calculate duration of the block in half-hour increments
    const originalStartPos = getPositionFromTime(draggedBlock.startTime);
    const originalEndPos = getPositionFromTime(draggedBlock.endTime);
    const durationInHalfHours = originalEndPos - originalStartPos;

    // Calculate new end time
    const newStartPos = getPositionFromTime(newStartTime);
    const newEndPos = newStartPos + durationInHalfHours;

    // Convert to hours and minutes
    const endHours = Math.floor(newEndPos / 2) + 7;
    const endMins = (newEndPos % 2) * 30;

    let newEndTime = `${endHours.toString().padStart(2, "0")}:${endMins
      .toString()
      .padStart(2, "0")}`;

    // Ensure block doesn't go beyond the schedule
    if (endHours > 21 || (endHours === 21 && endMins > 0)) {
      newEndTime = "21:00";
    }

    // Check for overlap
    if (hasOverlap(day, newStartTime, newEndTime, draggedBlock.id)) {
      // Error messages are now handled by the hasOverlap function
      return;
    }

    // Log successful move
    logError(
      `Moved Block #${draggedBlock.id} <${
        draggedBlock.courseCode
      }> to ${day} ${formatTimeForDisplay(newStartTime)}-${formatTimeForDisplay(
        newEndTime
      )}`
    );

    // Update the block
    setScheduleBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === draggedBlock.id
          ? { ...block, day, startTime: newStartTime, endTime: newEndTime }
          : block
      )
    );

    setDraggedBlock(null);
    setDragInfo(null);
    setGhostPosition(null);
  };

  // Format timestamp for error logs
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weekly Course Schedule</h1>

      {/* Terminal-style error log display */}
      {showTerminal && (
        <div className="mb-4 relative">
          <div className="bg-gray-900 text-gray-100 p-2 rounded-t flex justify-between items-center">
            <span className="font-mono text-sm">Terminal Output</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setErrorLogs([])}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                Hide
              </button>
            </div>
          </div>
          <div className="bg-gray-800 text-gray-200 font-mono text-sm p-3 rounded-b h-40 overflow-y-auto">
            {errorLogs.length === 0 ? (
              <div className="text-gray-500">No errors to display</div>
            ) : (
              errorLogs.map((log) => (
                <div
                  key={log.id}
                  className="mb-1 border-b border-gray-700 pb-1"
                >
                  <span className="text-gray-500">
                    [{formatTimestamp(log.timestamp)}]
                  </span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 bg-white border border-gray-200">
          <div className="col-span-1 border-r border-b border-gray-200 p-2 bg-gray-50">
            <div className="h-8"></div>
          </div>

          {days.map((day) => (
            <div
              key={day}
              className="col-span-1 border-r border-b border-gray-200 p-2 text-center bg-gray-50"
              onDragOver={(e) => handleDragOver(e, day)}
              onDrop={(e) => handleDrop(e, day)}
            >
              {day}
            </div>
          ))}

          <div ref={gridRef} className="col-span-7 grid grid-cols-7">
            <div className="col-span-1 border-r border-gray-200">
              {hours.map((hour, index) => (
                <div
                  key={index}
                  className="h-8 border-b border-gray-200 text-sm text-right pr-2 text-gray-600"
                >
                  {hour.display}
                </div>
              ))}
            </div>

            {days.map((day) => (
              <div
                key={day}
                className="col-span-1 border-r border-gray-200 relative"
                onDragOver={(e) => handleDragOver(e, day)}
                onDrop={(e) => handleDrop(e, day)}
                onDragEnd={handleDragEnd}
              >
                {hours.map((_, index) => (
                  <div
                    key={index}
                    className="h-8 border-b border-gray-200"
                  ></div>
                ))}

                {/* Ghost block when dragging */}
                {ghostPosition && ghostPosition.day === day && draggedBlock && (
                  <div
                    className={`absolute ${draggedBlock.color} p-1 w-full border border-gray-400 rounded shadow-sm overflow-hidden opacity-50`}
                    style={{
                      top: `${
                        Math.floor(ghostPosition.top / cellHeight) * cellHeight
                      }px`,
                      height: `${getBlockHeight(
                        draggedBlock.startTime,
                        draggedBlock.endTime
                      )}px`,
                      left: "0px",
                      right: "0px",
                      pointerEvents: "none",
                      borderStyle: "dashed",
                    }}
                  >
                    <div className="text-xs font-bold">
                      &lt;{draggedBlock.courseCode}&gt;
                    </div>
                    <div className="text-xs">{draggedBlock.courseName}</div>
                    <div className="text-xs">{draggedBlock.labLec}</div>
                  </div>
                )}

                {scheduleBlocks
                  .filter((block) => block.day === day)
                  .map((block) => {
                    // Calculate precise positioning based on time
                    const startPosition = getPositionFromTime(block.startTime);
                    const top = startPosition * cellHeight;

                    // Calculate height to exactly include the end time cell
                    const height = getBlockHeight(
                      block.startTime,
                      block.endTime
                    );

                    return (
                      <div
                        key={block.id}
                        className={`absolute ${
                          block.color
                        } p-1 w-full border border-gray-400 rounded shadow-sm overflow-hidden ${
                          draggedBlock?.id === block.id ? "opacity-50" : ""
                        }`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          left: "0px",
                          right: "0px",
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block)}
                      >
                        <div className="text-xs font-bold">
                          &lt;{block.courseCode}&gt;
                        </div>
                        <div className="text-xs">{block.courseName}</div>
                        <div className="text-xs">{block.labLec}</div>
                        <div className="text-xs">{block.room}</div>
                        <div className="text-xs">{block.professor}</div>
                        <div className="text-xs mt-1">
                          -{formatTimeForDisplay(block.startTime)}-
                        </div>
                        <div className="text-xs">
                          -{formatTimeForDisplay(block.endTime)}-
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSchedule;
