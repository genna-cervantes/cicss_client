import React, { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import ScheduleView from "../../components/ScheduleView";
import GenerateButton from "../../components/GenerateButton";

const sections = [
  { code: "1CSA", next: "1CSB"},
  { code: "1CSB", next: "1CSC"},
  { code: "1CSC", next: "1CSD"},
  { code: "1CSD", next: "1CSD"},
  { code: "1CSE", next: "1CSE"},
  { code: "3CSA", label: "Core Computer Science", next: "3CSB" },
  { code: "3CSB", label: "Game Development" },
  { code: "3CSC", label: "Data Science" },
  { code: "3CSD", label: "Data Science" },
  { code: "3CSE", label: "Data Science" },
  { code: "3CSF", label: "Data Science" },
];

// dynamically toh gagawin based sa section count sa simula
const sectionDirectory: any = {
  '1CSA': {next: '1CSB', prev: '4CSC'},
  '1CSB': {next: '1CSC', prev: '1CSA'},
  '1CSC': {next: '1CSD', prev: '1CSB'},
  '1CSD': {next: '1CSE', prev: '1CSC'},
  '1CSE': {next: '2CSA', prev: '1CSD'},
}

const ViewSchedule = () => {

  // State to track the current section index
  const [currentIndex, setCurrentIndex] = useState(0);
  // State to track the current filter
  const [currentFilter, setCurrentFilter] = useState("Section");
  
  const [currentValue, setCurrentValue] = useState(currentFilter === "Section" ? '1CSA' : currentFilter === "TAS" ? 'TAS1' : currentFilter === "Room" ? 'RM1901' : '');

  // Navigate to the previous section
  const goToPrevious = () => {
    // setCurrentIndex((prevIndex) =>
    //   prevIndex > 0 ? prevIndex - 1 : sections.length - 1
    // );
    if (currentFilter === 'Section'){
      setCurrentValue(sectionDirectory[currentValue].prev)
    }
  };

  // Navigate to the next section
  // const goToNext = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex < sections.length - 1 ? prevIndex + 1 : 0
  //   );
  // };

  const goToNext = () => {
    if (currentFilter === 'Section'){
      setCurrentValue(sectionDirectory[currentValue].next)
    }
  }


  // Change the current filter
  const changeFilter = (filter: string) => {
    setCurrentFilter(filter);
  };

  // Get the current section data
  const currentSection = sections[currentIndex];

  interface SelectOption {
    value: number;
    label: string;
  }

  const selectOptions: SelectOption[] = sections.map((section, index) => ({
    value: index,
    label: section.code,
  }));

  return (
    <div className="w-full bg-transparent py-4 px-16">
      <div className="flex items-center justify-between">
        {/* Section Code and Label */}
        <div className="flex items-center gap-3">
          <div className="font-CyGrotesk text-primary text-[40px]">
            {/* {currentSection.code} */}
          {currentValue}
          </div>
          <div className="font-Helvetica-Neue-Heavy bg-custom_yellow px-3 py-1 rounded-3xl">
            {currentSection.label}
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
              onClick={() => changeFilter("Section")}
            >
              By Section
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                currentFilter === "Professor"
                  ? "bg-white text-primary"
                  : "text-white"
              }`}
              onClick={() => changeFilter("Professor")}
            >
              By Professor
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md  ${
                currentFilter === "Room"
                  ? "bg-white text-primary"
                  : "text-white"
              }`}
              onClick={() => changeFilter("Room")}
            >
              By Room
            </button>
          </div>

          {/* Dropdown Selector */}
          <div className="relative inline-block">
            <select
              className="appearance-none w-[250px] px-4 py-2 bg-white border border-primary rounded text-sm"
              value={currentIndex}
              onChange={(e) => setCurrentIndex(Number(e.target.value))}
            >
              <option value="" disabled>
                Select a Section
              </option>
              {sections.map((section, index) => (
                <option key={index} value={index} className="py-2">
                  {section.code}
                </option>
              ))}
            </select>

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
        <ScheduleView value={currentValue} filter={currentFilter} />
      </div>
      <GenerateButton />
    </div>
  );
};

export default ViewSchedule;
