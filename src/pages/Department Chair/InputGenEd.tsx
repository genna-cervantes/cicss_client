import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import add_button from "../../assets/add_button.png";
import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";

interface GenEdCard {
  id: number;
  days: { id: number; startEndTimes: { start: string; end: string }[] }[];
}

interface Option {
  value: string;
  label: string;
}

const InputGenEd = () => {
  const [genEdCards, setGenEdCards] = useState<GenEdCard[]>([
    {
      id: 1,
      days: [{ id: 1, startEndTimes: [{ start: "", end: "" }] }],
    },
  ]);
  const [profCount, setProfCount] = useState(2);
  const [dayCount, setDayCount] = useState(2);
  const [genEdCourse, setGenEdCourse] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const animatedComponents = makeAnimated();

  const courseOptions = [
    { value: "coa", label: "Computer Organization and Architecture" },
    { value: "stats", label: "Advanced Statistics and Probability" },
    { value: "desalgo", label: "Design and Analysis of Algorithms" },
    { value: "appdev1", label: "Applications Development 1" },
    { value: "se1", label: "Software Engineering 1" },
    { value: "se2", label: "Software Engineering 2" },
    { value: "automata", label: "Theory of Automata" },
    { value: "thesis1", label: "Thesis 1" },
  ];

  const dayOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
  ];

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #02296D",
      borderRadius: "6px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      maxHeight: "160px",
      overflowY: "auto",
    }),
  };

  const handleAddStartEnd = (profId: number, dayId: number) => {
    setGenEdCards((prev) =>
      prev.map((card) =>
        card.id === profId
          ? {
              ...card,
              days: card.days.map((day) =>
                day.id === dayId
                  ? {
                      ...day,
                      startEndTimes: [
                        ...day.startEndTimes,
                        { start: "", end: "" },
                      ],
                    }
                  : day
              ),
            }
          : card
      )
    );
  };

  const handleDeleteStartEnd = (
    profId: number,
    dayId: number,
    index: number
  ) => {
    setGenEdCards((prev) =>
      prev.map((card) =>
        card.id === profId
          ? {
              ...card,
              days: card.days.map((day) =>
                day.id === dayId
                  ? {
                      ...day,
                      startEndTimes: day.startEndTimes.filter(
                        (_, i) => i !== index
                      ),
                    }
                  : day
              ),
            }
          : card
      )
    );
  };

  const handleStartEndChange = (
    profId: number,
    dayId: number,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setGenEdCards((prev) =>
      prev.map((card) =>
        card.id === profId // Find the specific card
          ? {
              ...card,
              days: card.days.map((day) =>
                day.id === dayId // Find the specific day
                  ? {
                      ...day,
                      startEndTimes: day.startEndTimes.map((se, i) =>
                        i === index // Find the specific start-end pair
                          ? { ...se, [field]: value } // Update either start or end
                          : se
                      ),
                    }
                  : day
              ),
            }
          : card
      )
    );
  };

  const handleAddDay = (profId: number) => {
    setGenEdCards((prev) =>
      prev.map((card) =>
        card.id === profId
          ? {
              ...card,
              days: [
                ...card.days,
                { id: dayCount, startEndTimes: [{ start: "", end: "" }] },
              ],
            }
          : card
      )
    );
    setDayCount(dayCount + 1);
  };

  const handleDeleteDay = (profId: number, dayId: number) => {
    setGenEdCards((prev) =>
      prev.map((card) =>
        card.id === profId
          ? { ...card, days: card.days.filter((day) => day.id !== dayId) }
          : card
      )
    );
  };

  const handleAddCard = () => {
    setGenEdCards([
      ...genEdCards,
      {
        id: profCount,
        days: [{ id: dayCount, startEndTimes: [{ start: "", end: "" }] }],
      },
    ]);
    setProfCount(profCount + 1);
    setDayCount(dayCount + 1);
  };

  const handleDeleteCard = (id: number) => {
    const updatedCards = genEdCards
      .filter((card) => card.id !== id)
      .map((card, index) => ({ ...card, id: index + 1 }));

    setGenEdCards(updatedCards);
    setProfCount(updatedCards.length + 1);
  };

  const handleSave = () => {
    genEdCards.forEach((card, cardIndex) => {
      console.log(`Course ID: ${card.id}`);
      // Get course code
      const courseCodeInput = document.querySelector(
        `input[placeholder="Course Code"]:nth-of-type(${cardIndex + 1})`
      ) as HTMLInputElement | null;
      const courseCode = courseCodeInput?.value || "No Course Code Inputted";

      console.log(`Course Code: ${courseCode}`);

      // Get Gen Ed Course
      console.log(`GenEd Course: ${genEdCourse}`);

      // Log days and times
      card.days.forEach((day) => {
        // Get day selected
        console.log("Selected Day: ", selectedDay);

        day.startEndTimes.forEach((time) => {
          const startTime = time.start || "No start time provided";
          const endTime = time.end || "No end time provided";

          console.log(`    Start Time: ${startTime}`);
          console.log(`    End Time: ${endTime}`);
        });
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">Gen Ed Constraints</div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>
      <section className="flex font-Manrope mx-11 my-11 font-extrabold">
        <p className="ml-[160px]">No.</p>
        <p className="ml-[90px]">Course Title</p>
        <p className="ml-[80px]">Course Code</p>
        <p className="ml-[300px]">Time Restriction</p>
      </section>
      {genEdCards.map((card) => (
        <div key={card.id} className="flex items-center mx-auto gap-5 mb-7">
          <div className="flex gap-5 bg-[#F1FAFF] px-5 pt-5 rounded-xl shadow-sm">
            <div>
              <div className="flex gap-5">
                <p>Course {card.id}</p>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isClearable={false}
                  options={courseOptions}
                  styles={customStyles}
                  classNamePrefix="custom-select"
                  className="w-[200px]"
                  placeholder="Select"
                  onChange={(option) => {
                    setGenEdCourse((option as Option)?.value || "");
                  }}
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  className="h-[38px] border border-primary rounded-[5px] px-2 w-[120px]"
                />
              </div>
            </div>
            <div>
              {card.days.map((day) => (
                <div
                  id="input-day"
                  className="bg-[#BFDDF6] p-5 rounded-md mb-5"
                >
                  <div className="flex gap-5">
                    <div className="flex items-center gap-5">
                      <div className="font-Manrope font-semibold text-sm">
                        Day
                      </div>
                      <Select
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={dayOptions}
                        placeholder="Select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: "1px solid #02296D",
                            borderRadius: "6px",
                            height: "38px",
                          }),
                        }}
                        className="w-36"
                        onChange={(option) => {
                          setSelectedDay((option as Option)?.value || "");
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      {day.startEndTimes.map((startEnd, index) => (
                        <div id="input-start-end" key={index}>
                          <div className="flex gap-3 items-center font-Manrope font-semibold text-sm">
                            <div>Start</div>
                            <input
                              type="time"
                              id="start-time"
                              className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                              value={startEnd.start}
                              onChange={(e) =>
                                handleStartEndChange(
                                  card.id,
                                  day.id,
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                            />
                            <div>End</div>
                            <input
                              type="time"
                              id="end-time"
                              className="h-[38px] w-[130px] border border-primary rounded-[5px] py-1 px-2"
                              value={startEnd.end}
                              onChange={(e) =>
                                handleStartEndChange(
                                  card.id,
                                  day.id,
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                            />
                            {day.startEndTimes.length > 1 && (
                              <button
                                onClick={() =>
                                  handleDeleteStartEnd(card.id, day.id, index)
                                }
                                id="remove-start-end"
                              >
                                <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                              </button>
                            )}
                            <button
                              onClick={() => handleAddStartEnd(card.id, day.id)}
                              id="add-start-end"
                              className="w-7"
                            >
                              <img src={add_button} alt="Add" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 flex justify-center gap-3 font-Manrope font-semibold">
                    <button
                      onClick={() => handleAddDay(card.id)}
                      className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                    >
                      Add Day
                    </button>
                    {card.days.length > 1 && (
                      <button
                        id="delete-day"
                        onClick={() => handleDeleteDay(card.id, day.id)}
                        className="border border-primary text-primary py-1 px-4 text-xs rounded-md"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => handleDeleteCard(card.id)}>
            <img src={trash_button} alt="Delete" className="w-9" />
          </button>
        </div>
      ))}
      <div className="mx-auto flex gap-4">
        <button
          className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white"
          onClick={handleSave}
        >
          Save
        </button>

        <button
          onClick={handleAddCard}
          className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm"
        >
          Add
          <img src={add_button_white} className="w-4" />
        </button>
      </div>
    </div>
  );
};

export default InputGenEd;
