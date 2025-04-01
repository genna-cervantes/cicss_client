import React, { useState, FormEvent, useEffect } from "react";
import Navbar from "../../components/Navbar";
import add_button from "../../assets/add_button.png";

type YearLevels = {
  "First Year": {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
  "Second Year": {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
  "Third Year": {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
  "Fourth Year": {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
};

const InputYLT = () => {
  const [yearLevels, setYearLevels] = useState<YearLevels>({
    "First Year": [
      { day: "", startEndTimes: [{ startTime: "", endTime: "" }] },
    ],
    "Second Year": [
      { day: "", startEndTimes: [{ startTime: "", endTime: "" }] },
    ],
    "Third Year": [
      { day: "", startEndTimes: [{ startTime: "", endTime: "" }] },
    ],
    "Fourth Year": [
      { day: "", startEndTimes: [{ startTime: "", endTime: "" }] },
    ],
  });

  const [updatedYearLevels, setUpdatedYearLevels] = useState<
    {
      [key: string]: {
        day: string;
        startEndTimes: { startTime: string; endTime: string }[];
      }[];
    }[]
  >([]);

  const [timeErrors, setTimeErrors] = useState<{
    [key: string]: { [key: number]: { [key: number]: string } };
  }>({});

  useEffect(() => {
    console.log("updated");
    console.log(updatedYearLevels);
  }, [updatedYearLevels]);

  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };
  //must end with :00 and :30
  const isValidTimeFormat = (timeStr: string): boolean => {
    if (!timeStr) return true;
    const minutes = timeStr.split(":")[1];
    return minutes === "00" || minutes === "30";
  };

  const handleChangeTimeRestriction = (
    name: "startTime" | "endTime",
    value: string,
    year: string,
    yearDataIndex: number,
    timeIndex: number
  ) => {
    // Validate time format (XX:00 or XX:30)
    if (value && !isValidTimeFormat(value)) {
      setTimeErrors((prev) => {
        const updated = { ...prev };
        if (!updated[year]) updated[year] = {};
        if (!updated[year][yearDataIndex]) updated[year][yearDataIndex] = {};
        updated[year][yearDataIndex][timeIndex] =
          "Time must be on the hour (XX:00) or half-hour (XX:30)";
        return updated;
      });
      return;
    }

    let updatedYear: any;
    setYearLevels((prev: any) => {
      updatedYear = prev[year].map((yearData: any, idx: number) =>
        idx === yearDataIndex
          ? {
              ...yearData,
              startEndTimes: yearData.startEndTimes.map(
                (time: any, tIdx: number) =>
                  tIdx === timeIndex ? { ...time, [name]: value } : time
              ),
            }
          : yearData
      );
      return {
        ...prev,
        [year]: updatedYear,
      };
    });

    const currentTimes =
      yearLevels[year as keyof YearLevels][yearDataIndex].startEndTimes[
        timeIndex
      ];
    const startTime = name === "startTime" ? value : currentTimes.startTime;
    const endTime = name === "endTime" ? value : currentTimes.endTime;

    // Validate time range
    if (startTime && endTime) {
      let error = "";
      const startMinutes = convertTimeToMinutes(startTime);
      const endMinutes = convertTimeToMinutes(endTime);

      if (endMinutes <= startMinutes) {
        error = "End time must be after start time";
      } else if (endMinutes - startMinutes < 30) {
        //depende pa
        error = "Time slot must be at least 30 minutes";
      } else if (endMinutes - startMinutes > 300) {
        //depende pa
        error = "Time slot cannot exceed 5 hours";
      }

      // Check for time window (7am-9pm)
      const earliestAllowedTime = 7 * 60; // 7:00 AM
      const latestAllowedTime = 21 * 60; // 9:00 PM

      if (!error) {
        if (startMinutes < earliestAllowedTime) {
          error = "Start time cannot be earlier than 7:00 AM";
        } else if (endMinutes > latestAllowedTime) {
          error = "End time cannot be later than 9:00 PM";
        }
      }

      // Check for overlapping time slots
      if (!error) {
        const currentDayTimes =
          yearLevels[year as keyof YearLevels][yearDataIndex].startEndTimes;
        for (let i = 0; i < currentDayTimes.length; i++) {
          if (i === timeIndex) continue;

          const otherTime = currentDayTimes[i];
          if (!otherTime.startTime || !otherTime.endTime) continue;

          const otherStart = convertTimeToMinutes(otherTime.startTime);
          const otherEnd = convertTimeToMinutes(otherTime.endTime);

          // Check for overlap
          if (
            (startMinutes >= otherStart && startMinutes < otherEnd) ||
            (endMinutes > otherStart && endMinutes <= otherEnd) ||
            (startMinutes <= otherStart && endMinutes >= otherEnd)
          ) {
            error = "Time slots cannot overlap";
            break;
          }
        }
      }

      setTimeErrors((prev) => {
        const updated = { ...prev };

        if (!updated[year]) {
          updated[year] = {};
        }

        if (!updated[year][yearDataIndex]) {
          updated[year][yearDataIndex] = {};
        }

        if (error) {
          updated[year][yearDataIndex][timeIndex] = error;
        } else {
          delete updated[year][yearDataIndex][timeIndex];

          if (Object.keys(updated[year][yearDataIndex]).length === 0) {
            delete updated[year][yearDataIndex];
          }

          if (Object.keys(updated[year]).length === 0) {
            delete updated[year];
          }
        }

        return updated;
      });
    }

    let yearLevel;
    switch (year) {
      case "First Year":
        yearLevel = 1;
        break;
      case "Second Year":
        yearLevel = 2;
        break;
      case "Third Year":
        yearLevel = 3;
        break;
      case "Fourth Year":
        yearLevel = 4;
        break;
      default:
        yearLevel = 0;
    }

    setUpdatedYearLevels((prev) => {
      const existingIndex = prev.findIndex((item) => item[yearLevel]);

      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex ? { [yearLevel]: updatedYear } : item
        );
      } else {
        return [...prev, { [yearLevel]: updatedYear }];
      }
    });
  };

  const handleAddTimeRestriction = (
    year: string,
    yearDataIndex: number,
    timeIndex: number
  ) => {
    const hasExistingErrors = timeErrors[year]?.[yearDataIndex]
      ? Object.keys(timeErrors[year][yearDataIndex]).length > 0
      : false;

    const currentTimes =
      yearLevels[year as keyof YearLevels][yearDataIndex].startEndTimes;
    const hasIncompleteTime = currentTimes.some(
      (time) =>
        (time.startTime && !time.endTime) || (!time.startTime && time.endTime)
    );

    if (hasExistingErrors || hasIncompleteTime) {
      alert("Please fix existing time entries before adding a new one");
      return;
    }

    let updatedYear: any;
    setYearLevels((prev: any) => {
      updatedYear = prev[year].map((yearData: any, idx: number) => {
        if (idx === yearDataIndex) {
          return {
            ...yearData,
            startEndTimes: [
              ...yearData.startEndTimes,
              { startTime: "", endTime: "" },
            ],
          };
        } else return yearData;
      });
      return {
        ...prev,
        [year]: updatedYear,
      };
    });

    let yearLevel;
    switch (year) {
      case "First Year":
        yearLevel = 1;
        break;
      case "Second Year":
        yearLevel = 2;
        break;
      case "Third Year":
        yearLevel = 3;
        break;
      case "Fourth Year":
        yearLevel = 4;
        break;
      default:
        yearLevel = 0;
    }

    setUpdatedYearLevels((prev) => {
      console.log(typeof prev);
      const existingIndex = prev.findIndex((item) => item[yearLevel]);

      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex ? { [yearLevel]: updatedYear } : item
        );
      } else {
        return [...prev, { [yearLevel]: updatedYear }];
      }
    });
  };

  const handleDeleteTimeRestriction = (
    year: string,
    yearDataIndex: number,
    timeIndex: number
  ) => {
    let updatedYear: any;
    setYearLevels((prev: any) => {
      updatedYear = prev[year].map((yearData: any, idx: number) => {
        if (idx === yearDataIndex) {
          return {
            ...yearData,
            startEndTimes: yearData.startEndTimes.filter(
              (_: any, i: number) => i !== timeIndex // Remove the item at timeIndex
            ),
          };
        }
        return yearData;
      });
      return {
        ...prev,
        [year]: updatedYear,
      };
    });

    // Clear any errors for the deleted time entry
    setTimeErrors((prev) => {
      if (
        prev[year] &&
        prev[year][yearDataIndex] &&
        prev[year][yearDataIndex][timeIndex]
      ) {
        const updatedErrors = { ...prev };
        delete updatedErrors[year][yearDataIndex][timeIndex];

        if (Object.keys(updatedErrors[year][yearDataIndex]).length === 0) {
          delete updatedErrors[year][yearDataIndex];
        }

        if (Object.keys(updatedErrors[year]).length === 0) {
          delete updatedErrors[year];
        }

        return updatedErrors;
      }
      return prev;
    });

    let yearLevel;

    switch (year) {
      case "First Year":
        yearLevel = 1;
        break;
      case "Second Year":
        yearLevel = 2;
        break;
      case "Third Year":
        yearLevel = 3;
        break;
      case "Fourth Year":
        yearLevel = 4;
        break;
      default:
        yearLevel = 0;
    }

    setUpdatedYearLevels((prev) => {
      const existingIndex = prev.findIndex((item) => item[yearLevel]);

      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex ? { [yearLevel]: updatedYear } : item
        );
      } else {
        return [...prev, { [yearLevel]: updatedYear }];
      }
    });
  };

  // Function to check if there are any time validation errors
  const hasTimeValidationErrors = (): boolean => {
    return Object.keys(timeErrors).length > 0;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (hasTimeValidationErrors()) {
      alert("Please fix all time validation errors before saving");
      return;
    }

    let hasIncompleteTimeEntries = false;
    for (const year in yearLevels) {
      for (const yearData of yearLevels[year as keyof YearLevels]) {
        for (const time of yearData.startEndTimes) {
          if (
            (time.startTime && !time.endTime) ||
            (!time.startTime && time.endTime)
          ) {
            hasIncompleteTimeEntries = true;
            break;
          }
        }
        if (hasIncompleteTimeEntries) break;
      }
      if (hasIncompleteTimeEntries) break;
    }

    if (hasIncompleteTimeEntries) {
      alert("Please complete all time entries with both start and end times");
      return;
    }

    console.log("saving");
    console.log(updatedYearLevels);

    // Here you would typically send the data to your backend
    for (let i = 0; i < updatedYearLevels.length; i++) {
      let updatedYearLevel = updatedYearLevels[i];
      let yearLevel = Object.keys(updatedYearLevel)[0];

      let transformedRestrictions: any = {
        M: [],
        T: [],
        W: [],
        TH: [],
        F: [],
        S: [],
      };

      updatedYearLevel[yearLevel].forEach((res) => {
        let transformedStartEndTimes = res.startEndTimes.map((set) => {
          return {
            start: `${set.startTime.slice(0, 2)}${set.startTime.slice(3)}`,
            end: `${set.endTime.slice(0, 2)}${set.endTime.slice(3)}`,
          };
        });
        transformedRestrictions[res.day] = [
          ...transformedRestrictions[res.day],
          ...transformedStartEndTimes,
        ];
      });

      const department = localStorage.getItem("department") ?? "CS";
      const res = await fetch(
        `http://localhost:8080/yltconstraints/${department}/${yearLevel}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({ restrictions: transformedRestrictions }),
        }
      );

      if (res.ok) {
        console.log("yeyy okay");
      } else {
        console.log("error");
      }
    }
  };

  const getDayFullName = (shortDay: string): string => {
    switch (shortDay) {
      case "M":
        return "Monday";
      case "T":
        return "Tuesday";
      case "W":
        return "Wednesday";
      case "TH":
        return "Thursday";
      case "F":
        return "Friday";
      case "S":
        return "Saturday";
      default:
        return shortDay;
    }
  };

  //Sinort ko
  const sortDays = (
    days: { day: string; startEndTimes: any }[]
  ): { day: string; startEndTimes: any }[] => {
    const dayOrder: { [key: string]: number } = {
      M: 0,
      T: 1,
      W: 2,
      TH: 3,
      F: 4,
      S: 5,
    };

    return [...days].sort((a, b) => {
      return dayOrder[a.day] - dayOrder[b.day];
    });
  };

  // fetch data
  useEffect(() => {
    const fetchYLTData = async () => {
      const department = localStorage.getItem("department") ?? "CS";
      for (let i = 1; i < 5; i++) {
        const res = await fetch(
          `http://localhost:8080/yltconstraints/${department}/${i}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();

          let transformedYLTConstraints = Object.keys(data.restrictions)
            .map((key: string) => {
              let transformedStartEndTimes = data.restrictions[key].map(
                (time: any) => {
                  let startTime = time?.start
                    ? `${time.start.slice(0, 2)}:${time.start.slice(2)}`
                    : "";
                  let endTime = time?.end
                    ? `${time.end.slice(0, 2)}:${time.end.slice(2)}`
                    : "";

                  return { startTime, endTime };
                }
              );

              return {
                day: key,
                startEndTimes: transformedStartEndTimes,
              };
            })
            .filter(
              (item): item is { day: string; startEndTimes: any } =>
                item !== undefined
            );

          transformedYLTConstraints = sortDays(transformedYLTConstraints);

          console.log("transform", transformedYLTConstraints);

          if (i === 1) {
            setYearLevels((prev) => ({
              ...prev,
              "First Year": transformedYLTConstraints,
            }));
          } else if (i === 2) {
            setYearLevels((prev) => ({
              ...prev,
              "Second Year": transformedYLTConstraints,
            }));
          } else if (i === 3) {
            setYearLevels((prev) => ({
              ...prev,
              "Third Year": transformedYLTConstraints,
            }));
          } else if (i === 4) {
            setYearLevels((prev) => ({
              ...prev,
              "Fourth Year": transformedYLTConstraints,
            }));
          }

          // console.log("data", data);
        } else {
          console.log("may error sa pag fetch");
        }
      }
    };
    fetchYLTData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
        <div className="text-primary text-[35px]">
          Year Level - Time Constraints
        </div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>

      <form onSubmit={handleSave}>
        <section className="flex flex-col gap-5 mt-11">
          {(Object.keys(yearLevels) as Array<keyof YearLevels>).map((year) => {
            return (
              <div className="flex flex-col w-5/12 items-center justify-around gap-5 mx-auto bg-[#F1FAFF] p-5 rounded-xl shadow-md">
                <p className="text-primary font-Manrope font-extrabold">
                  {year}
                </p>
                <div className="w-9/12">
                  <div className="gap-5">
                    {yearLevels[year].map(
                      (
                        yearData,
                        yearDataIndex // Use map instead of forEach
                      ) => {
                        // console.log("year data", yearData);
                        return (
                          <div className="w-full">
                            <div className="w-full">
                              <div className=" gap-3 items-center font-Manrope font-semibold text-sm w-full">
                                <div className="w-[140px] h-[38px] flex items-center  text-primary font-Manrope font-extrabold">
                                  {getDayFullName(yearData.day)}
                                </div>
                                <div className=" bg-[#BFDDF6] rounded-xl px-8 py-4 flex flex-col gap-y-3 w-full">
                                  {yearData.startEndTimes.length > 0 ? (
                                    yearData.startEndTimes.map(
                                      (time, timeIndex) => {
                                        return (
                                          <div className="flex flex-col w-full">
                                            <div className="flex items-center gap-x-4">
                                              <label htmlFor={`${year}-start`}>
                                                Start
                                              </label>
                                              <input
                                                id={`${year}-start`}
                                                type="time"
                                                value={time.startTime}
                                                onChange={(e) =>
                                                  handleChangeTimeRestriction(
                                                    "startTime",
                                                    e.target.value,
                                                    year,
                                                    yearDataIndex,
                                                    timeIndex
                                                  )
                                                }
                                                className={`h-[38px] border w-[130px] ${
                                                  timeErrors[year]?.[
                                                    yearDataIndex
                                                  ]?.[timeIndex]
                                                    ? "border-red-500"
                                                    : "border-primary"
                                                } rounded-[5px] py-1 px-2`}
                                                required
                                                step="1800"
                                              />
                                              <label htmlFor={`${year}-end`}>
                                                End
                                              </label>
                                              <input
                                                id={`${year}-end`}
                                                type="time"
                                                value={time.endTime}
                                                onChange={(e) =>
                                                  handleChangeTimeRestriction(
                                                    "endTime",
                                                    e.target.value,
                                                    year,
                                                    yearDataIndex,
                                                    timeIndex
                                                  )
                                                }
                                                className={`h-[38px] w-[130px] border ${
                                                  timeErrors[year]?.[
                                                    yearDataIndex
                                                  ]?.[timeIndex]
                                                    ? "border-red-500"
                                                    : "border-primary"
                                                } rounded-[5px] py-1 px-2`}
                                                required
                                                step="1800"
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleAddTimeRestriction(
                                                    year,
                                                    yearDataIndex,
                                                    timeIndex
                                                  )
                                                }
                                                className="w-7"
                                              >
                                                <img src={add_button} />
                                              </button>
                                              {yearData.startEndTimes.length >
                                                0 && (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteTimeRestriction(
                                                      year,
                                                      yearDataIndex,
                                                      timeIndex
                                                    )
                                                  }
                                                >
                                                  <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                                                </button>
                                              )}
                                            </div>
                                            {timeErrors[year]?.[
                                              yearDataIndex
                                            ]?.[timeIndex] && (
                                              <div className="text-red-500 text-xs mt-1 ml-12">
                                                {
                                                  timeErrors[year][
                                                    yearDataIndex
                                                  ][timeIndex]
                                                }
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                    )
                                  ) : (
                                    <div className="min-w-full flex justify-center items-center">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAddTimeRestriction(
                                            year,
                                            yearDataIndex,
                                            0
                                          )
                                        }
                                        className="bg-primary text-white py-1 px-4 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                                      >
                                        Add Time Restriction
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div className="flex justify-center">
          <button
            type="submit"
            className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-11 mb-24 rounded-sm hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputYLT;
