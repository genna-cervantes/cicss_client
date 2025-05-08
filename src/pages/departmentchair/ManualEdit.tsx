import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  CalendarApp,
  createCalendar,
  createViewWeek,
} from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import "../../components/custom-calendar.css";
import "../../components/custom-event.css";
import { dateToDay, weekDates } from "../../utils/constants";
import {
  getViolations,
  transformToScheduleEvents,
} from "../../components/ScheduleView";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import timeGridEvent from "./TimeGridEvent";
import { constants } from "node:http2";
import TimeGridEvent from "./TimeGridEvent";
import { transformToOriginalEvents, uniqueByKey } from "../../utils/utils";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const ManualEdit = ({
  filter = "Section",
  value = "1CSA",
}: {
  filter: string;
  value: string;
}) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    filter = searchParams.get("filter") || "Section";
    value = searchParams.get("value") || "1CSA";
  }, []);

  const schedBlockRef = useRef<any>(null);
  const violationsRef = useRef<any>(null);
  const calendarRef = useRef<any>(null);

  const [
    perSchedBlockScheduleViolations,
    setPerScheduleBlockScheduleViolations,
  ] = useState<any>([]);
  const [perFilterScheduleViolations, setPerFilterScheduleViolations] =
    useState<any>([]);
  const [violationFitler, setViolationFilter] = useState("perSchedBlock");
  const [terminalVisible, setTerminalVisible] = useState(true);

  const [acceptViolationsModal, setAcceptViolationsModal] = useState(false);

  const [scheduleEvents, setScheduleEvents] = useState<any>();
  const [transformedScheduleEvents, setTransformedScheduleEvents] =
    useState<any>();

  const [changedScheduleBlocks, setChangedSchedBlocks] = useState<any>([]);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReadyDepartments = async () => {
      const res = await fetch(
        "http://localhost:3000/schedule/ready/departments"
      );
      if (res.ok) {
        const data = await res.json();
        if (!data.csReady || !data.isReady || !data.itReady) {
          navigate("/departmentchair/ready-schedule");
        }
      }
    };
    fetchReadyDepartments();
  }, []);

  // default schedule to show
  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch("http://localhost:3000/schedule/class/CS/1/CSA"); // DEFAULT NA SIMULA
      const data = await res.json();
      let sched = data;

      if (data?.error) {
        sched = {};
      }

      if (res.ok) {
        setScheduleEvents(sched);
      } else {
        setError("may error sa pag kuha ng sched");
      }
    };

    if (filter === "Section") {
      fetchSchedule();
    }
  }, []);

  // rendering when schedule is fetched
  useEffect(() => {
    // console.log("raw schedule events");
    // console.log(scheduleEvents);

    // console.log("transformed schedule events");
    // console.log(transformToScheduleEvents(scheduleEvents))

    if (scheduleEvents) {
      let transformedEvents = transformToScheduleEvents(
        scheduleEvents,
        filter,
        value
      );
      let violations = getViolations(scheduleEvents);

      let perSchedBlockViolations = [];
      let perFilterViolations = [];
      for (let i = 0; i < violations.length; i++) {
        let specViol = violations[i];

        if (specViol?.time?.time) {
          perSchedBlockViolations.push(specViol);
        } else {
          perFilterViolations.push(specViol);
        }
      }
      // console.log(perSchedBlockViolations)
      // perSchedBlockViolations = uniqueByKey(perSchedBlockScheduleViolations, 'id')
      setPerFilterScheduleViolations(perFilterViolations);
      setPerScheduleBlockScheduleViolations(perSchedBlockViolations);

      setTransformedScheduleEvents(transformedEvents);
    }
  }, [scheduleEvents]);

  useEffect(() => {
    console.log("transform", perFilterScheduleViolations);
    console.log("transform 2", perSchedBlockScheduleViolations);
  }, [perFilterScheduleViolations, perSchedBlockScheduleViolations]);

  // update schedule when go to next or previous
  useEffect(() => {
    // console.log("filter", filter);
    // console.log("value", value);

    if (filter === "Section") {
      let year = value.slice(0, 1);
      let section = value.slice(1);

      // console.log(year);
      // console.log(section);

      const fetchSchedule = async () => {
        const department = localStorage.getItem("department") ?? "CS";
        const res = await fetch(
          `http://localhost:3000/schedule/class/${department}/${year}/${section}`
        ); // DEFAULT NA CS MUNA
        const data = await res.json();
        let sched = data;

        if (data?.error) {
          sched = {};
        }

        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched");
        }
      };

      fetchSchedule();
    } else if (filter === "Professor") {
      let tasId = value;

      // console.log('tas', tasId)

      const fetchSchedule = async () => {
        const res = await fetch(`http://localhost:3000/schedule/tas/${tasId}`);
        const data = await res.json();
        let sched = data;

        if (data?.error) {
          sched = {};
        }

        // console.log('data', data)

        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched - tas");
        }
      };

      fetchSchedule();
    } else if (filter === "Room") {
      let roomId = value;

      // console.log('room', roomId)

      const fetchSchedule = async () => {
        const res = await fetch(
          `http://localhost:3000/schedule/room/${roomId}`
        );
        const data = await res.json();
        let sched = data;

        if (data?.error) {
          sched = {};
        }

        // console.log('data', data)

        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched - tas");
        }
      };

      fetchSchedule();
    }
  }, [filter, value]);

  const handleCancelViolations = () => {
    setAcceptViolationsModal(false);
    navigate(`/departmentchair/manual-edit?filter=${filter}&value=${value}`);
    // window.location.reload();
  };

  const handleAcceptViolations = async () => {
    console.log("accept violations");
    console.log(schedBlockRef.current);
    const res = await fetch(
      "http://localhost:3000/schedule/accept/violations",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(schedBlockRef.current),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        console.log("yeyy");
      } else [console.log("nooo")];
    }
    setAcceptViolationsModal(false);
    window.location.reload();
  };

  const handleChangeSchedBlock = (newEvent: any) => {
    setChangedSchedBlocks((prev: any) => {
      const newSchedBlocks = prev.filter((sb: any) => sb.id !== newEvent.id);
      newSchedBlocks.push(newEvent);
      return newSchedBlocks;
    });
  };

  // if (transformedScheduleEvents) {
  // let calendar: CalendarApp =
  if (!calendarRef.current) {
    calendarRef.current = createCalendar({
      views: [createViewWeek()],
      events: transformedScheduleEvents,
      selectedDate: "2025-02-03",
      dayBoundaries: {
        start: "07:00",
        end: "21:00",
      },
      weekOptions: { eventOverlap: false, nDays: 6 },
      plugins: filter === "Section" ? [createDragAndDropPlugin(30)] : [],
      callbacks: {
        onEventUpdate(updatedEvent) {
          console.log("onEventUpdate", updatedEvent);
        },
        onBeforeEventUpdate(oldEvent, newEvent, $app) {
          console.log("before event updated");
          const parseDateTime = (dateTimeStr: string) =>
            new Date(dateTimeStr.replace(" ", "T"));

          const newStart = parseDateTime(newEvent.start);
          const newEnd = parseDateTime(newEvent.end);

          if (filter === "Section") {
            let date: string = newEvent.start.split(" ")[0];
            let start: string = `${newEvent.start
              .split(" ")[1]
              .slice(0, 2)}${newEvent.start.split(" ")[1].slice(3)}`;
            let end: string = `${newEvent.end
              .split(" ")[1]
              .slice(0, 2)}${newEvent.end.split(" ")[1].slice(3)}`;

            // "{"type":"lec","violations":[]}"
            let description = JSON.parse(newEvent?.description ?? "");

            const reqObj = {
              section: value.slice(1),
              year: value.slice(0, 1),
              department: value.slice(1, 3),
              id: newEvent.id,
              room: {
                roomId: newEvent.location,
              },
              tas: newEvent?.people?.[0] ?? "GENED_PROF",
              day: dateToDay[date],
              timeBlock: {
                start,
                end,
              },
              course: {
                type: description?.type,
                category: description?.category,
                subjectCode: newEvent.title,
              },
              violations: description?.violations,
            };

            console.log(reqObj);
            schedBlockRef.current = reqObj;
            handleChangeSchedBlock(newEvent);

            const fetchViolations = async () => {
              const res = await fetch(
                "http://localhost:3000/schedule/check/violations",
                {
                  method: "POST",
                  headers: {
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify(reqObj),
                }
              );

              if (res.ok) {
                const data = await res.json();
                if (!data.success) {
                  violationsRef.current = data;
                  setAcceptViolationsModal(true);
                }
                console.log(data);
              } else {
                console.log("error");
              }
            };
            fetchViolations();
          }

          console.log("violations ref");
          console.log(violationsRef);
          if (violationsRef.current.type === "hard") {
            return false;
          }
          return true;
        },
      },
    });
  }

  useEffect(() => {
    if (transformedScheduleEvents && calendarRef.current) {
      calendarRef.current.events.set(transformedScheduleEvents);
    }
    // setChangedSchedBlocks(transformedScheduleEvents)
  }, [transformedScheduleEvents]);

  const handleSave = async () => {
    // console.log('saved events')
    // console.log(transformedScheduleEvents)
    const originalEvents = transformToOriginalEvents(
      transformedScheduleEvents,
      changedScheduleBlocks,
      value
    );

    const res = await fetch("http://localhost:3000/schedule/manual-edit/save", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ transformedSchedBlocks: originalEvents }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        console.log("yeyy");
      } else {
        console.log("error", data);
      }
    }
  };

  const handleDeploy = async () => {
    const res = await fetch(
      "http://localhost:3000/schedule/manual-edit/deploy"
    );

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        console.log("yeyy");
      } else {
        console.log("error", data);
      }
    }
  };

  const memoizedCustomComponents = useMemo(
    () => ({
      timeGridEvent: TimeGridEvent, // Your custom component for the time grid
    }),
    []
  );

  const formatMilitaryTime = (time: number): string => {
    if (time == undefined) {
      return "";
    }
    const timeStr = time.toString().padStart(4, "0"); // Ensure 4 digits
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2);
    return `${hours}:${minutes}`;
  };

  // on event update ndi inaaccept ??

  return (
    <>
      {acceptViolationsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-3xl text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-6">
              <h2>
                New Violations Found{" "}
                {violationsRef.current.type === "HARD" &&
                  violationsRef.current.type.toUpperCase()}
              </h2>
            </h2>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
              {violationsRef.current.type === "hard" ? (
                <>
                  <p className="text-lg text-gray-700">
                    Your adjustment will lead to these new violations:
                  </p>
                  {violationsRef.current.violations.map((viol: any) => (
                    <div
                      key={viol.id}
                      className="bg-red-100 border border-red-300 rounded-lg p-4 space-y-2"
                    >
                      <h1 className="text-sm bg-red-300 px-3 py-1 rounded-lg inline-block">
                        <span className="font-semibold">{viol.type}</span>:{" "}
                        {viol.description}
                      </h1>
                      <p>
                        <strong>{viol.section.current}</strong> [
                        {viol.course.current}]{" "}
                        <span className="text-sm text-gray-600">
                          conflicts with
                        </span>{" "}
                        <strong>{viol.section.against}</strong> [
                        {viol.course.against}]
                        <span className="pl-1 text-gray-600">on</span>{" "}
                        <strong>{viol.time.day}</strong> from{" "}
                        <strong>
                          {formatMilitaryTime(viol.time?.time?.start)}
                        </strong>{" "}
                        to{" "}
                        <strong>
                          {formatMilitaryTime(viol.time?.time?.end)}
                        </strong>
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {violationsRef.current.violations.addedViolations.length >
                    0 && (
                    <h3 className="text-lg font-medium text-yellow-700">
                      These violations will be added:
                    </h3>
                  )}
                  {violationsRef.current.violations.addedViolations.map(
                    (addedViol: any) => (
                      <div
                        key={addedViol.id}
                        className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 space-y-2"
                      >
                        <span className="text-sm font-medium bg-yellow-300 px-3 py-1 rounded-lg inline-block">
                          {addedViol.type}: {addedViol.description}
                        </span>
                        <p>
                          <strong>{addedViol.section.current}</strong> (
                          {addedViol.course.current})
                          <span className="pl-1 text-gray-600">on</span>{" "}
                          <strong>{addedViol.time.day}</strong> from{" "}
                          <strong>
                            {formatMilitaryTime(addedViol.time?.time?.start)}
                          </strong>{" "}
                          to{" "}
                          <strong>
                            {formatMilitaryTime(addedViol.time?.time?.end)}
                          </strong>
                        </p>
                      </div>
                    )
                  )}
                  {violationsRef.current.violations.removedViolations.length >
                    0 && (
                    <h3 className="text-lg font-medium text-green-700">
                      These violations will be removed:
                    </h3>
                  )}
                  {violationsRef.current.violations.removedViolations.map(
                    (removedViol: any) => (
                      <div
                        key={removedViol.id}
                        className="bg-green-100 border border-green-300 rounded-lg p-4 space-y-2"
                      >
                        <span className="text-sm font-medium bg-green-300 px-3 py-1 rounded-lg inline-block">
                          {removedViol.type}: {removedViol.description}
                        </span>
                        <p>
                          <strong>{removedViol.section.current}</strong> (
                          {removedViol.course.current})
                          <span className="pl-1 text-gray-600">on</span>{" "}
                          <strong>{removedViol.time.day}</strong> from{" "}
                          <strong>
                            {formatMilitaryTime(removedViol.time?.time?.start)}
                          </strong>{" "}
                          to{" "}
                          <strong>
                            {formatMilitaryTime(removedViol.time?.time?.end)}
                          </strong>
                        </p>
                      </div>
                    )
                  )}
                </>
              )}

              {violationsRef.current.type === "hard" && (
                <p className="text-red-600 font-semibold">
                  The violations listed contain a HARD constraint. You are not
                  allowed to make this change.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => handleCancelViolations()}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition"
              >
                {violationsRef.current.type === "hard" ? "Close" : "Cancel"}
              </button>
              {violationsRef.current.type !== "hard" && (
                <button
                  onClick={handleAcceptViolations}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                >
                  Accept
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {terminalVisible ? (
        <div className="bg-primary/10 mt-6 rounded-lg">
          <div className="bg-primary/10 rounded-t-lg flex w-full justify-between items-center px-8 py-3">
            <h1 className="font-bold">Constraints Violations</h1>
            <div className="flex gap-x-3">
              <button
                onClick={() => setViolationFilter("perSchedBlock")}
                className={`${
                  violationFitler === "perSchedBlock"
                    ? "bg-primary"
                    : "bg-slate-500/50"
                } px-3 py-2 rounded-lg text-white text-xs font-bold`}
              >
                Per Schedule Block
              </button>
              <button
                onClick={() => setViolationFilter("perFilter")}
                className={`${
                  violationFitler === "perFilter"
                    ? "bg-primary"
                    : "bg-slate-500/50"
                } px-3 py-2 rounded-lg text-white text-xs font-bold`}
              >
                Per Section
              </button>
              <button onClick={() => setTerminalVisible(!terminalVisible)}>
                Hide
              </button>
            </div>
          </div>
          <div className="px-4 text-xs rounded-b-lg py-2">
            {violationFitler === "perSchedBlock" ? (
              perSchedBlockScheduleViolations &&
              perSchedBlockScheduleViolations.length > 0 ? (
                perSchedBlockScheduleViolations.map((viol: any) => {
                  console.log(viol);
                  return (
                    <div
                      key={viol.id}
                      className="flex py-1 items-center gap-x-2"
                    >
                      <h1 className="bg-red-300 border-[1px] border-red-400 px-3 py-1 rounded-md text-red-900 font-semibold">
                        {viol.type}
                      </h1>
                      <h1 className="font-semibold">{viol.time.day}</h1>
                      <h1 className="font-semibold">
                        {formatMilitaryTime(viol.time?.time?.start)} to{" "}
                        {formatMilitaryTime(viol.time?.time?.end)}
                      </h1>
                      <h1>:</h1>
                      <h1>[{viol.course.current}]</h1>
                      <h1>:</h1>
                      <h1>{viol.description}</h1>
                    </div>
                  );
                })
              ) : (
                <div className="px-8">
                  <h1 className="font-semibold">No constraints</h1>
                </div>
              )
            ) : perFilterScheduleViolations ? (
              perFilterScheduleViolations.length > 0 ? (
                perFilterScheduleViolations.map((viol: any) => {
                  console.log(viol);
                  return (
                    <div
                      key={viol.id}
                      className="flex py-1 items-center gap-x-2"
                    >
                      <h1 className="bg-red-300 px-3 py-1 rounded-md text-red-900 font-semibold">
                        {viol.type}
                      </h1>
                      <h1 className="font-semibold">{viol.time.day}</h1>
                      <h1>:</h1>
                      <h1>{viol.description}</h1>
                    </div>
                  );
                })
              ) : (
                <div className="px-4">
                  <h1 className="font-semibold">No constraints</h1>
                </div>
              )
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-between items-center px-2 py-3 bg-slate-300">
          <h1 className="font-bold">Constraints Violations</h1>
          <div className="flex gap-x-3">
            <button
              onClick={() => setViolationFilter("perSchedBlock")}
              className={`${
                violationFitler === "perSchedBlock"
                  ? "bg-primary"
                  : "bg-primary/70"
              } px-3 py-2 rounded-lg text-white text-sm font-bold`}
            >
              Per Schedule Block
            </button>
            <button
              onClick={() => setViolationFilter("perFilter")}
              className={`${
                violationFitler === "perFilter" ? "bg-primary" : "bg-primary/70"
              } px-3 py-2 rounded-lg text-white text-sm font-bold`}
            >
              Per Section
            </button>
            <button onClick={() => setTerminalVisible(!terminalVisible)}>
              {terminalVisible ? "Hide" : "Unhide"}
            </button>
          </div>
        </div>
      )}
      <ScheduleXCalendar
        calendarApp={calendarRef.current}
        customComponents={memoizedCustomComponents}
        // timeGridEvent={TimeGridEvent}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDeploy}>Deploy</button>
    </>
  );
};

export default ManualEdit;

// kapag mawawala ung violation pano un kasi pag dagdag lng ung inaano
// every change ng position dapat uupdate -- consequence of above
// save changes sa baba incase walang nabawas and walang naadd

// deploy function
