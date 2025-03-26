import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";

import add_button from "../../assets/add_button.png";
import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";

interface TimeEntry {
  start: string;
  end: string;
}

interface Restriction {
  day: string;
  startEndTimes: TimeEntry[];
}

interface GenEdInfo {
  courseTitle: string;
  courseCode: string;
  courseRestriction: Restriction[];
}

interface Option {
  value: string;
  label: string;
}

const courseOptions: Option[] = [
  { value: "coa", label: "Computer Organization and Architecture" },
  { value: "stats", label: "Advanced Statistics and Probability" },
  { value: "desalgo", label: "Design and Analysis of Algorithms" },
  { value: "appdev1", label: "Applications Development 1" },
  { value: "se1", label: "Software Engineering 1" },
  { value: "se2", label: "Software Engineering 2" },
  { value: "automata", label: "Theory of Automata" },
  { value: "thesis1", label: "Thesis 1" },
];

const dayOptions: Option[] = [
  { value: "M", label: "Monday" },
  { value: "T", label: "Tuesday" },
  { value: "W", label: "Wednesday" },
  { value: "TH", label: "Thursday" },
  { value: "F", label: "Friday" },
  { value: "S", label: "Saturday" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #02296D",
    borderRadius: "6px",
    width: "200px",
    height: "38px",
    padding: "0 2px",
  }),
};

const InputGenEd = () => {
  // Store an array of GenED with constraints
  const [genEdList, setGenEdList] = useState<GenEdInfo[]>([
    {
      courseTitle: "",
      courseCode: "",
      courseRestriction: [{ day: "", startEndTimes: [{ start: "", end: "" }] }],
    },
  ]);

  //Handler for Course Title Select Change
  const handleCourseTitleChange = (
    genEdIndex: number,
    selectedOption: Option | null
  ) => {
    setGenEdList((prev) => {
      const updated = [...prev];
      updated[genEdIndex] = {
        ...updated[genEdIndex],
        courseTitle: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  //Handler for Course Code Text Input
  const handleCourseCodeChange = (
    genEdIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGenEdList((prev) => {
      const updated = [...prev];
      updated[genEdIndex] = { ...updated[genEdIndex], [name]: value };
      return updated;
    });
  };

  //Handler for changing a restriction's day for a specific GenEd Course
  const handleGenEdDayRestrictionChange = (
    genEdIndex: number,
    restrictionIndex: number,
    selectedOption: Option | null
  ) => {
    setGenEdList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[genEdIndex].courseRestriction];
      updatedRequests[restrictionIndex] = {
        ...updatedRequests[restrictionIndex],
        day: selectedOption ? selectedOption.value : "",
      };
      updated[genEdIndex] = {
        ...updated[genEdIndex],
        courseRestriction: updatedRequests,
      };
      return updated;
    });
  };

  // Handler for changing a time field (start or end) for a specific GenEd Course
  const handleGenEdTimeRestrictionChange = (
    genEdIndex: number,
    restrictionIndex: number,
    timeIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setGenEdList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[genEdIndex].courseRestriction];
      const updatedTimes = [...updatedRequests[restrictionIndex].startEndTimes];
      updatedTimes[timeIndex] = { ...updatedTimes[timeIndex], [name]: value };
      updatedRequests[restrictionIndex] = {
        ...updatedRequests[restrictionIndex],
        startEndTimes: updatedTimes,
      };
      updated[genEdIndex] = {
        ...updated[genEdIndex],
        courseRestriction: updatedRequests,
      };
      return updated;
    });
  };

  // Handler to add a new day restriciton to a specific GenEd Course
  const handleAddDayRestriction = (genEdIndex: number, e: FormEvent) => {
    e.preventDefault();
    setGenEdList((prev) => {
      const updated = [...prev];
      updated[genEdIndex] = {
        ...updated[genEdIndex],
        courseRestriction: [
          ...updated[genEdIndex].courseRestriction,
          { day: "", startEndTimes: [{ start: "", end: "" }] },
        ],
      };
      return updated;
    });
  };

  // Handler to delete a day restriction from a specific GenEd Course
  const handleDeleteDayRestriction = (
    genEdIndex: number,
    restrictionIndex: number
  ) => {
    setGenEdList((prev) => {
      const updated = [...prev];
      updated[genEdIndex] = {
        ...updated[genEdIndex],
        courseRestriction: updated[genEdIndex].courseRestriction.filter(
          (_, i) => i !== restrictionIndex
        ),
      };
      return updated;
    });
  };

  // Handler to add a new time entry to a GenEd Course
  const handleAddTimeRestriction = (
    genEdIndex: number,
    restrictionIndex: number
  ) => {
    setGenEdList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[genEdIndex].courseRestriction];
      updatedRequests[restrictionIndex] = {
        ...updatedRequests[restrictionIndex],
        startEndTimes: [
          ...updatedRequests[restrictionIndex].startEndTimes,
          { start: "", end: "" },
        ],
      };
      updated[genEdIndex] = {
        ...updated[genEdIndex],
        courseRestriction: updatedRequests,
      };
      return updated;
    });
  };

  // Handler to delete a time entry from a GenEd Course
  const handleDeleteTimeRestriction = (
    genEdIndex: number,
    requestIndex: number,
    timeIndex: number
  ) => {
    setGenEdList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[genEdIndex].courseRestriction];
      // Only delete if more than one time entry exists
      if (updatedRequests[requestIndex].startEndTimes.length > 1) {
        updatedRequests[requestIndex] = {
          ...updatedRequests[requestIndex],
          startEndTimes: updatedRequests[requestIndex].startEndTimes.filter(
            (_, i) => i !== timeIndex
          ),
        };
      }
      updated[genEdIndex] = {
        ...updated[genEdIndex],
        courseRestriction: updatedRequests,
      };
      return updated;
    });
  };

  // Handler to add a new form
  const handleAddGenEdCourse = (e: FormEvent) => {
    e.preventDefault();
    setGenEdList((prev) => [
      ...prev,
      {
        courseTitle: "",
        courseCode: "",
        courseRestriction: [
          { day: "", startEndTimes: [{ start: "", end: "" }] },
        ],
      },
    ]);
  };

  // Handler to delete an entire form
  const handleDeleteGenEdCourse = (genEdIndex: number) => {
    setGenEdList((prev) => prev.filter((_, i) => i !== genEdIndex));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // Log each TAS details
    genEdList.forEach((genEdCourse, genEdIndex) => {
      console.log(`GenEd Course ${genEdIndex + 1}:`);
      console.log("   Title:", genEdCourse.courseTitle);
      console.log("   Code:", genEdCourse.courseCode);

      genEdCourse.courseRestriction.forEach((restriciton, restrictionIndex) => {
        console.log(`   Restriction ${restrictionIndex + 1}:`);
        console.log("      Day:", restriciton.day);
        restriciton.startEndTimes.forEach((time, timeIndex) => {
          console.log(
            `      Time ${timeIndex + 1} - Start: ${time.start}, End: ${
              time.end
            }`
          );
        });
      });
    });
  };

  // fetch data
  useEffect(() => {
    const getGenedCourseConstraintData = async () => {
      const res = await fetch("http://localhost:8080/genedconstraint", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // courseTitle courseCode restrictions
        // [{ day: "", startEndTimes: [{ start: "", end: "" }] }]
        let transformedGenedConstraints = [];
        transformedGenedConstraints = data.map((genedConstraint: any) => {
          let genedConstraintRestrictionKeys = Object.keys(
            genedConstraint.restrictions
          );

          let transformedGenedConstraintRestrictions =
            genedConstraintRestrictionKeys
              .map((genedkey: string) => {
                if (genedConstraint.restrictions[genedkey].length > 0) {
                  return {
                    day: genedkey,
                    startEndTimes: genedConstraint.restrictions[genedkey],
                  };
                }
                return undefined; // Explicitly return undefined
              })
              .filter(Boolean); // Removes all falsy values (undefined)

          return {
            courseTitle: genedConstraint.courseName,
            courseCode: genedConstraint.courseCode,
            courseRestriction: transformedGenedConstraintRestrictions,
          };
        });

        console.log(transformedGenedConstraints);
        setGenEdList(transformedGenedConstraints);

        console.log(data);
      } else {
        console.log("error in fetching");
      }
    };

    getGenedCourseConstraintData();
  }, []);

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

      <div className="flex mx-auto gap-5 font-Manrope font-semibold">
        <form onSubmit={handleSave}>
          {genEdList.map((genEdCourse, genEdIndex) => (
            <div key={genEdIndex} className="mb-7 flex gap-3">
              <div className="flex gap-5 bg-[#F1FAFF] px-5 pt-5 rounded-xl shadow-sm">
                <div className="flex gap-3">
                  <div className="flex justify-center gap-3">
                    <label className="mr-2">Course {genEdIndex + 1} </label>
                    <div>
                      <Select
                        options={courseOptions}
                        placeholder="Select"
                        value={
                          courseOptions.find(
                            (opt) => opt.value === genEdCourse.courseTitle
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          handleCourseTitleChange(genEdIndex, selectedOption)
                        }
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="courseCode"
                      value={genEdCourse.courseCode}
                      onChange={(e) => handleCourseCodeChange(genEdIndex, e)}
                      placeholder="Enter"
                      className="h-[38px] border border-primary rounded-[5px] px-2 w-[200px]"
                    />
                  </div>
                </div>

                <div>
                  {/* kapag wala ndi siya nag mmap */}
                  {genEdCourse.courseRestriction.length > 0 ? (
                    genEdCourse.courseRestriction.map(
                      (restriction, restrictionIndex) => {
                        console.log(restriction);
                        return (
                          <div
                            key={restrictionIndex}
                            className="bg-[#BFDDF6] p-5 rounded-md mb-5"
                          >
                            <div className="flex gap-3 justify-center">
                              <div className="flex gap-3 items-center mb-3">
                                <label>Day</label>
                                <Select
                                  options={dayOptions}
                                  placeholder="Select"
                                  value={
                                    dayOptions.find(
                                      (opt) => opt.value === restriction.day
                                    ) || null
                                  }
                                  onChange={(selectedOption) =>
                                    handleGenEdDayRestrictionChange(
                                      genEdIndex,
                                      restrictionIndex,
                                      selectedOption
                                    )
                                  }
                                  styles={customStyles}
                                />
                              </div>

                              <div className="flex flex-col">
                                {restriction.startEndTimes.length > 0 ? (
                                  restriction.startEndTimes.map(
                                    (time, timeIndex) => {
                                      let start = time?.start
                                        ? `${time.start.slice(0, 2)}:${time.start.slice(2)}`
                                        : "";
                                      let end = time?.end
                                        ? `${time.end.slice(0, 2)}:${time.end.slice(2)}`
                                        : "";
                                      return (
                                        <div key={timeIndex} className="mb-3">
                                          <div className="flex items-center gap-3 justify-center">
                                            <label>Start</label>
                                            <input
                                              type="time"
                                              name="start"
                                              value={start}
                                              onChange={(e) =>
                                                handleGenEdTimeRestrictionChange(
                                                  genEdIndex,
                                                  restrictionIndex,
                                                  timeIndex,
                                                  e
                                                )
                                              }
                                              className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                            />
                                            <label>End</label>
                                            <input
                                              type="time"
                                              name="end"
                                              value={end}
                                              onChange={(e) =>
                                                handleGenEdTimeRestrictionChange(
                                                  genEdIndex,
                                                  restrictionIndex,
                                                  timeIndex,
                                                  e
                                                )
                                              }
                                              className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                            />
                                            {restriction.startEndTimes.length >
                                              1 && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleDeleteTimeRestriction(
                                                    genEdIndex,
                                                    restrictionIndex,
                                                    timeIndex
                                                  )
                                                }
                                              >
                                                <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                                              </button>
                                            )}

                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleAddTimeRestriction(
                                                  genEdIndex,
                                                  restrictionIndex
                                                )
                                              }
                                              className="w-7"
                                            >
                                              <img src={add_button} />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )
                                ) : (
                                  <div className="flex flex-col">
                                    <div className="mb-3">
                                      <div className="flex items-center gap-3 justify-center">
                                        <label>Start</label>
                                        <input
                                          type="time"
                                          name="start"
                                          value=""
                                          onChange={(e) =>
                                            handleGenEdTimeRestrictionChange(
                                              genEdIndex,
                                              0,
                                              0,
                                              e
                                            )
                                          }
                                          className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                        />
                                        <label>End</label>
                                        <input
                                          type="time"
                                          name="end"
                                          value=""
                                          onChange={(e) =>
                                            handleGenEdTimeRestrictionChange(
                                              genEdIndex,
                                              0,
                                              0,
                                              e
                                            )
                                          }
                                          className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                        />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteTimeRestriction(
                                              genEdIndex,
                                              0,
                                              0
                                            )
                                          }
                                        >
                                          <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleAddTimeRestriction(
                                              genEdIndex,
                                              0
                                            )
                                          }
                                          className="w-7"
                                        >
                                          <img src={add_button} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-center gap-3 mt-5">
                              <button
                                onClick={(e) =>
                                  handleAddDayRestriction(genEdIndex, e)
                                }
                                className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                              >
                                Add Day
                              </button>
                              {genEdCourse.courseRestriction.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteDayRestriction(
                                      genEdIndex,
                                      restrictionIndex
                                    )
                                  }
                                  className="border border-primary text-primary py-1 px-4 text-xs rounded-md"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="bg-[#BFDDF6] p-5 rounded-md mb-5">
                      <div className="flex gap-3 justify-center">
                        <div className="flex gap-3 items-center mb-3">
                          <label>Day</label>
                          <Select
                            options={dayOptions}
                            placeholder="Select"
                            value={null}
                            onChange={(selectedOption) =>
                              handleGenEdDayRestrictionChange(
                                genEdIndex,
                                0,
                                selectedOption
                              )
                            }
                            styles={customStyles}
                          />
                        </div>

                        <div className="flex flex-col">
                          <div className="mb-3">
                            <div className="flex items-center gap-3 justify-center">
                              <label>Start</label>
                              <input
                                type="time"
                                name="start"
                                value=""
                                onChange={(e) =>
                                  handleGenEdTimeRestrictionChange(
                                    genEdIndex,
                                    0,
                                    0,
                                    e
                                  )
                                }
                                className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                              />
                              <label>End</label>
                              <input
                                type="time"
                                name="end"
                                value=""
                                onChange={(e) =>
                                  handleGenEdTimeRestrictionChange(
                                    genEdIndex,
                                    0,
                                    0,
                                    e
                                  )
                                }
                                className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteTimeRestriction(genEdIndex, 0, 0)
                                }
                              >
                                <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAddTimeRestriction(genEdIndex, 0)
                                }
                                className="w-7"
                              >
                                <img src={add_button} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-3 mt-5">
                        <button
                          onClick={(e) =>
                            handleAddDayRestriction(genEdIndex, e)
                          }
                          className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                        >
                          Add Day
                        </button>
                        {genEdCourse.courseRestriction.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteDayRestriction(genEdIndex, 0)
                            }
                            className="border border-primary text-primary py-1 px-4 text-xs rounded-md"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => handleDeleteGenEdCourse(genEdIndex)}>
                <img src={trash_button} alt="Delete" className="w-9" />
              </button>
            </div>
          ))}
          <div className="justify-center flex gap-4 font-Manrope font-semibold">
            <button
              type="submit"
              className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white"
            >
              Save
            </button>
            <button
              onClick={handleAddGenEdCourse}
              className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm"
            >
              Add
              <img src={add_button_white} className="w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputGenEd;
