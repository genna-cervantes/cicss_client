import React, { useEffect, useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import ScheduleView from "../../components/ScheduleView";
import GenerateButton from "../../components/GenerateButton";
import merge from "lodash.merge";
import { useNavigate } from "react-router-dom";
import LockButton from "../../components/LockButton";

const sections = [
  { code: "1CSA", next: "1CSB" },
  { code: "1CSB", next: "1CSC" },
  { code: "1CSC", next: "1CSD" },
  { code: "1CSD", next: "1CSD" },
  { code: "1CSE", next: "1CSE" },
  { code: "3CSA", label: "Core Computer Science", next: "3CSB" },
  { code: "3CSB", label: "Game Development" },
  { code: "3CSC", label: "Data Science" },
  { code: "3CSD", label: "Data Science" },
  { code: "3CSE", label: "Data Science" },
  { code: "3CSF", label: "Data Science" },
];

const ViewSchedule = () => {
  const [currentFilter, setCurrentFilter] = useState("Section");
  const [filter, setFilter] = useState("Section");

  const [yearSections, setYearSections] = useState<{
    [key: string]: { next: string; prev: string; specialization: string };
  }>({});

  const [profDetails, setProfDetails] = useState<{ [key: string]: string }>({});
  const [roomDetails, setRoomDetails] = useState<{ [key: string]: string }>({});

  const [currentValue, setCurrentValue] = useState<{
    label: string;
    name?: string;
    specialization?: string;
  }>(
    currentFilter === "Section"
      ? { label: "1CSA", specialization: "" }
      : currentFilter === "TAS"
        ? { label: "", name: "" }
        : currentFilter === "Room"
          ? { label: "RM1901" }
          : { label: "" }
  );

  const navigate = useNavigate();

  // Navigate to the previous section
  const goToPrevious = () => {
    if (currentFilter === "Section") {
      setCurrentValue({ label: yearSections[currentValue.label].prev });
    } else if (currentFilter === "Professor") {
      const keys = Object.keys(profDetails);
      const index = keys.findIndex((tasId) => tasId === currentValue.label);

      let prevIndex: number = index === 0 ? keys.length - 1 : index - 1;

      setCurrentValue({
        label: keys[prevIndex],
        name: profDetails[keys[prevIndex]],
      });
    } else if (currentFilter === "Room") {
      const keys = Object.keys(roomDetails);
      const index = keys.findIndex((roomId) => roomId === currentValue.label);

      let prevIndex: number = index === 0 ? keys.length - 1 : index - 1;

      setCurrentValue({
        label: keys[prevIndex],
        name: keys[prevIndex],
        specialization: roomDetails[keys[prevIndex]],
      });
    }
  };

  const goToNext = () => {
    if (currentFilter === "Section") {
      setCurrentValue({ label: yearSections[currentValue.label].next });
    } else if (currentFilter === "Professor") {
      const keys = Object.keys(profDetails);
      const index = keys.findIndex((tasId) => tasId === currentValue.label);

      let nextIndex: number = index === keys.length ? 0 : index + 1;

      setCurrentValue({
        label: keys[nextIndex],
        name: profDetails[keys[nextIndex]],
      });
    } else if (currentFilter === "Room") {
      const keys = Object.keys(roomDetails);
      const index = keys.findIndex((roomId) => roomId === currentValue.label);

      let nextIndex: number = index === keys.length ? 0 : index + 1;

      setCurrentValue({
        label: keys[nextIndex],
        name: keys[nextIndex],
        specialization: roomDetails[keys[nextIndex]],
      });
    }
  };

  useEffect(() => {
    if (currentFilter === "Section") {
      setCurrentValue((prev) => ({
        ...prev,
        specialization:
          yearSections[currentValue.label]?.specialization === "none"
            ? ""
            : yearSections[currentValue.label]?.specialization ?? "",
      }));
    }
  }, [currentValue.label]);

  // Get the current section data
  // const currentSection = sections[currentIndex];

  useEffect(() => {
    if (filter === "Professor") {
      const fetchTASData = async () => {
        const department = localStorage.getItem('department') ?? 'CS'
        const res = await fetch(
          `http://localhost:8080/tasconstraints/details/${department}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(('token')) ?? ''}`
            }
            }
        );
        const data = await res.json();

        setProfDetails(
          data.reduce((acc: any, prof: any) => ({ ...acc, ...prof }), {})
        );

        if (res.ok) {
          setCurrentValue({
            label: Object.keys(data[0])[0],
            name: data[0][Object.keys(data[0])[0]],
          });
          setCurrentFilter(filter);
        }
      };

      fetchTASData();
    }
    if (filter === "Section") {
      setCurrentValue({
        label: Object.keys(yearSections)[0],
        specialization:
          yearSections[Object.keys(yearSections)[0]]?.specialization,
      });
      setCurrentFilter(filter);
    }
    if (filter === "Room") {
      const fetchRoomData = async () => {
        const department = localStorage.getItem('department') ?? 'CS'
        const res = await fetch(`http://localhost:8080/rooms/${department}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(('token')) ?? ''}`
        }
        });
        const data = await res.json();

        let roomDetails = data.map((rm: any) => ({ [rm.roomId]: rm.roomType }));
        roomDetails = roomDetails.reduce(
          (acc: any, room: any) => ({ ...acc, ...room }),
          {}
        );
        // console.log(roomDetails)
        // console.log(roomDetails.reduce((acc: any, room: any) => ({ ...acc, ...room }), {}))
        setRoomDetails(roomDetails);

        if (res.ok) {
          setCurrentValue({
            label: Object.keys(roomDetails)[0],
            name: Object.keys(roomDetails)[0],
            specialization: roomDetails[Object.keys(roomDetails)[0]],
          });
          setCurrentFilter(filter);
        }
      };

      fetchRoomData();
    }
  }, [filter]);

  // fetch values for the sections - nakabase don sa year sections
  useEffect(() => {
    const fetchYearSectionsData = async () => {
      const department = localStorage.getItem("department") ?? "CS";
      const res = await fetch(
        `http://localhost:8080/year_sections/${department}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        let firstYearSections = data.firstYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedFirstYearSections = [];
        let secondYearSections = data.secondYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedSecondYearSections = [];
        let thirdYearSections = data.thirdYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedThirdYearSections = [];
        let fourthYearSections = data.fourthYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedFourthYearSections = [];

        for (let i = 0; i < firstYearSections.length; i++) {
          let section = firstYearSections[i];
          let nextSection =
            i === firstYearSections.length - 1
              ? `2${secondYearSections[0].section}`
              : `1${firstYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `4${fourthYearSections[fourthYearSections.length - 1].section}`
              : `1${firstYearSections[i - 1].section}`;

          let newSection = {
            [`1${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedFirstYearSections.push(newSection);
        }

        for (let i = 0; i < secondYearSections.length; i++) {
          let section = secondYearSections[i];
          let nextSection =
            i === secondYearSections.length - 1
              ? `3${thirdYearSections[0].section}`
              : `2${secondYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `1${firstYearSections[firstYearSections.length - 1].section}`
              : `2${secondYearSections[i - 1].section}`;

          let newSection = {
            [`2${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedSecondYearSections.push(newSection);
        }

        for (let i = 0; i < thirdYearSections.length; i++) {
          let section = thirdYearSections[i];
          let nextSection =
            i === thirdYearSections.length - 1
              ? `4${fourthYearSections[0].section}`
              : `3${thirdYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `2${secondYearSections[secondYearSections.length - 1].section}`
              : `3${thirdYearSections[i - 1].section}`;

          let newSection = {
            [`3${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedThirdYearSections.push(newSection);
        }

        for (let i = 0; i < fourthYearSections.length; i++) {
          let section = fourthYearSections[i];
          let nextSection =
            i === fourthYearSections.length - 1
              ? `1${firstYearSections[0].section}`
              : `4${fourthYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `3${thirdYearSections[thirdYearSections.length - 1].section}`
              : `4${fourthYearSections[i - 1].section}`;

          let newSection = {
            [`4${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedFourthYearSections.push(newSection);
        }

        const allSections = [
          ...transformedFirstYearSections,
          ...transformedSecondYearSections,
          ...transformedThirdYearSections,
          ...transformedFourthYearSections,
        ];
        const combinedSections = allSections.reduce(
          (acc, obj) => merge(acc, obj),
          {}
        );
        setYearSections(combinedSections);

        // console.log("year sections", combinedSections);
      } else {
        console.log("error with fetching data", data);
      }
    };

    fetchYearSectionsData();
  }, []);

  useEffect(() => {
    setCurrentValue({
      label: Object.keys(yearSections)[0],
      specialization:
        yearSections[Object.keys(yearSections)[0]]?.specialization === "none"
          ? ""
          : yearSections[Object.keys(yearSections)[0]]?.specialization,
    });
  }, [yearSections]);

  return (
    <div className="w-full bg-transparent py-4 px-16">
      <div className="flex items-center justify-between">
        {/* Section Code and Label */}
        <div className="flex items-center gap-3">
          <div className="font-CyGrotesk text-primary text-[40px] truncate">
            {/* {currentSection.code} */}
            {currentFilter === "Section"
              ? currentValue.label
              : currentValue.name}
          </div>
          <div className="font-Helvetica-Neue-Heavy bg-custom_yellow px-3 py-1 rounded-3xl">
            {currentValue?.specialization}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center justify-center text-primary"
              onClick={goToPrevious}
              aria-label="Previous section"
            >
              <span aria-hidden="true">
                <SlArrowLeft style={{ strokeWidth: "3" }} />
              </span>
            </button>
            <button
              className="flex items-center justify-center text-primary font-extrabold"
              onClick={goToNext}
              aria-label="Next section"
            >
              <span aria-hidden="true">
                <SlArrowRight style={{ strokeWidth: "3" }} />
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-6 font-Manrope font-bold">
          {/* Filter Tabs */}
          <div className="flex items-center border rounded-lg overflow-hidden bg-primary px-3 py-2">
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                currentFilter === "Section"
                  ? "bg-white text-primary"
                  : "text-white"
              }`}
              onClick={() => setFilter("Section")}
            >
              By Section
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                currentFilter === "Professor"
                  ? "bg-white text-primary"
                  : "text-white"
              }`}
              onClick={() => setFilter("Professor")}
            >
              By Professor
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md  ${
                currentFilter === "Room"
                  ? "bg-white text-primary"
                  : "text-white"
              }`}
              onClick={() => setFilter("Room")}
            >
              By Room
            </button>
          </div>

          {/* Dropdown Selector */}
          <div className="relative inline-block">
            {currentFilter === "Section" && (
              <select
                className="appearance-none w-[250px] px-4 py-2 bg-white border border-primary rounded text-sm"
                value={currentValue.label}
                onChange={(e) =>
                  setCurrentValue({
                    label: e.target.value,
                    specialization: yearSections[e.target.value].specialization,
                  })
                }
              >
                <option value="" disabled>
                  Select a Section
                </option>
                {Object.keys(yearSections).map((section, index) => {
                  return (
                    <option key={index} value={section} className="py-2">
                      {section}
                    </option>
                  );
                })}
              </select>
            )}

            {currentFilter === "Professor" && (
              <select
                className="appearance-none w-[250px] px-4 py-2 bg-white border border-primary rounded text-sm"
                value={currentValue.label}
                onChange={(e: any) =>
                  setCurrentValue({
                    label: e.target.value,
                    specialization: "",
                    name: profDetails[e.target.value],
                  })
                }
              >
                <option value="" disabled>
                  Select a Section
                </option>
                {Object.keys(profDetails).map((tasId, index) => {
                  let tasName = profDetails[tasId];
                  return (
                    <option key={index} value={tasId} className="py-2">
                      {tasName}
                    </option>
                  );
                })}
              </select>
            )}

            {currentFilter === "Room" && (
              <select
                className="appearance-none w-[250px] px-4 py-2 bg-white border border-primary rounded text-sm"
                value={currentValue.label}
                onChange={(e: any) =>
                  setCurrentValue({
                    label: e.target.value,
                    specialization: roomDetails[e.target.value],
                    name: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  Select a Section
                </option>
                {Object.keys(roomDetails).map((roomId, index) => {
                  return (
                    <option key={index} value={roomId} className="py-2">
                      {roomId}
                    </option>
                  );
                })}
              </select>
            )}

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ScheduleView value={currentValue.label} filter={currentFilter} />
      </div>
      <GenerateButton regenerate={true} />
      <button onClick={() => navigate("/")}>
        Save as Draft
      </button>
      <LockButton />
    </div>
  );
};

export default ViewSchedule;
