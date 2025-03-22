import React, { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import GeneratedScheduleCalendar from "./GeneratedScheduleCalendar";

const ManualEdit = () => {
  const navigate = useNavigate();
  const [showDeployModal, setShowDeployModal] = useState(false);

  //Section Info
  const sections = [
    { code: "3CSA", label: "Core Computer Science" },
    { code: "3CSB", label: "Game Development" },
    { code: "3CSC", label: "Data Science" },
    { code: "3CSD", label: "Data Science" },
    { code: "3CSE", label: "Data Science" },
    { code: "3CSF", label: "Data Science" },
  ];

  //Room Info
  const rooms = [
    { roomCode: "1901" },
    { roomCode: "1902" },
    { roomCode: "1903" },
    { roomCode: "1904" },
    { roomCode: "1905" },
    { roomCode: "1906" },
  ];

  const professors = [
    { profName: "Jonathan Cabero" },
    { profName: "Jessie James Suarez" },
    { profName: "Mia Eleazar" },
    { profName: "Lawrence Decamora" },
  ];

  // State to track the current filter
  const [currentFilter] = useState("Section");

  // State to track indices for each category
  const [sectionIndex, setSectionIndex] = useState(0);
  const [roomIndex, setRoomIndex] = useState(0);
  const [professorIndex, setProfessorIndex] = useState(0);

  // Helper function to navigate to previous item based on current filter
  const goToPrevious = () => {
    if (currentFilter === "Section") {
      setSectionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : sections.length - 1
      );
    } else if (currentFilter === "Room") {
      setRoomIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : rooms.length - 1
      );
    } else if (currentFilter === "Professor") {
      setProfessorIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : professors.length - 1
      );
    }
  };

  // Helper function to navigate to next item based on current filter
  const goToNext = () => {
    if (currentFilter === "Section") {
      setSectionIndex((prevIndex) =>
        prevIndex < sections.length - 1 ? prevIndex + 1 : 0
      );
    } else if (currentFilter === "Room") {
      setRoomIndex((prevIndex) =>
        prevIndex < rooms.length - 1 ? prevIndex + 1 : 0
      );
    } else if (currentFilter === "Professor") {
      setProfessorIndex((prevIndex) =>
        prevIndex < professors.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  // Determine what to display based on the current filter
  const getCurrentDisplayInfo = () => {
    if (currentFilter === "Section") {
      return {
        code: sections[sectionIndex].code,
        label: sections[sectionIndex].label,
      };
    } else if (currentFilter === "Room") {
      return {
        code: `Room ${rooms[roomIndex].roomCode}`,
        label: "", // Empty label for Room view
      };
    } else {
      return {
        code: professors[professorIndex].profName,
        label: "", // Empty label for Professor view
      };
    }
  };

  // Get appropriate options for the dropdown based on current filter
  const getDropdownOptions = () => {
    if (currentFilter === "Section") {
      return sections.map((section, index) => ({
        value: index,
        label: section.code,
      }));
    } else if (currentFilter === "Room") {
      return rooms.map((room, index) => ({
        value: index,
        label: `Room ${room.roomCode}`,
      }));
    } else {
      return professors.map((prof, index) => ({
        value: index,
        label: prof.profName,
      }));
    }
  };

  // Handler for dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    if (currentFilter === "Section") {
      setSectionIndex(value);
    } else if (currentFilter === "Room") {
      setRoomIndex(value);
    } else if (currentFilter === "Professor") {
      setProfessorIndex(value);
    }
  };

  // Handle deploy button click
  const handleDeployClick = () => {
    setShowDeployModal(true);
  };

  // Handle confirm deploy
  const handleConfirmDeploy = () => {
    // Close the modal
    setShowDeployModal(false);
    // Navigate to the next page
    navigate("/departmentchair/dashboard");
  };

  const currentDisplayInfo = getCurrentDisplayInfo();
  const dropdownOptions = getDropdownOptions();

  const modalBackgroundStyle = {
    background:
      "linear-gradient(180deg, #F1FAFF 0%, #BFDDF6 50%, #9FCEF5 100%)",
  };

  return (
    <div className="w-full bg-transparent py-4 px-16 ">
      <div className="relative flex items-center justify-between">
        {/* Display Info Based on Current Filter */}
        <div className="relative flex items-center gap-3">
          <div className="font-CyGrotesk text-primary text-[40px]">
            {currentDisplayInfo.code}
          </div>

          {/* Only show label for Section view */}
          {currentFilter === "Section" && (
            <div className="font-Helvetica-Neue-Heavy bg-custom_yellow px-3 py-1 rounded-3xl">
              {currentDisplayInfo.label}
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center justify-center text-primary"
              onClick={goToPrevious}
              aria-label="Previous item"
            >
              <span aria-hidden="true">
                <SlArrowLeft style={{ strokeWidth: "3" }} />
              </span>
            </button>
            <button
              className="flex items-center justify-center text-primary font-extrabold"
              onClick={goToNext}
              aria-label="Next item"
            >
              <span aria-hidden="true">
                <SlArrowRight style={{ strokeWidth: "3" }} />
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-6 font-Manrope font-bold">
          {/* Dropdown Selector - Dynamic based on current filter */}
          <div className="relative inline-block">
            <select
              className="appearance-none w-[250px] px-4 py-2 bg-white border border-primary rounded text-sm"
              value={
                currentFilter === "Section"
                  ? sectionIndex
                  : currentFilter === "Room"
                  ? roomIndex
                  : professorIndex
              }
              onChange={handleDropdownChange}
            >
              <option value="" disabled>
                {`Select a ${currentFilter}`}
              </option>
              {dropdownOptions.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  className="py-2 font-Manrope font-semibold"
                >
                  {option.label}
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
        <GeneratedScheduleCalendar
          initialDragEnabled={true}
          initialShowTerminal={true}
        />
      </div>
      <div className="flex space-x-4 font-Manrope font-semibold justify-center ">
        <button className="bg-primary text-white w-[150px] py-1 rounded-md">
          Save
        </button>

        <button
          onClick={handleDeployClick}
          className="bg-[#FFBA21] text-[#444444] border border-[#444444] w-[150px] py-1 rounded-md"
        >
          Deploy
        </button>
      </div>

      {/* Deploy Confirmation Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-2xl p-8 max-w-md w-full shadow-xl"
            style={modalBackgroundStyle}
          >
            <p className="text-primary mb-4 text-center font-Helvetica-Neue-Heavy italic">
              The schedule you are about to deploy contains{" "}
              <p className="text-red-800">constraint violations</p>
            </p>
            <h3 className="text-primary text-center font-Helvetica-Neue-Heavy text-2xl mb-6">
              Are you sure you want to <br /> proceed with the deployment?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                className="px-5 py-1 border border-primary rounded-md font-Manrope font-semibold text-primary"
                onClick={() => setShowDeployModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md font-Manrope font-semibold"
                onClick={handleConfirmDeploy}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualEdit;
