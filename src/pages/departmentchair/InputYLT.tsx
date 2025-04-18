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

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

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
      } else if (endMinutes - startMinutes > 840) {
        //depende pa
        error = "Time slot cannot exceed 14 hours";
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

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true");

    if (hasTimeValidationErrors()) {
      setStatusMessage({
        type: "error",
        text: "Please fix all time validation errors before saving",
      });
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
      setStatusMessage({
        type: "error",
        text: "Please complete all time entries with both start and end times",
      });
      return;
    }

    console.log("saving");
    console.log(updatedYearLevels);

    if (updatedYearLevels.length === 0) {
      setStatusMessage({
        type: "error",
        text: "No changes to save.",
      });
      return;
    }

    try {
      let isSuccess = false;
      let apiErrors: string[] = [];

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
        try {
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
            isSuccess = true;
            console.log("yeyy okay");
          } else {
            const data = await res.json();
            console.log("error", data);
            apiErrors.push(
              `Failed to update Year ${yearLevel}: ${
                data.message || "Unknown error"
              }`
            );
          }
        } catch (error) {
          console.error("Update fetch error:", error);
          apiErrors.push(`Network error updating Year ${yearLevel}`);
        }
      }

      // Set final status message
      if (apiErrors.length > 0) {
        setStatusMessage({
          type: "error",
          text: apiErrors[0], // Show first error
        });
      } else if (isSuccess) {
        setStatusMessage({
          type: "success",
          text: "Year Level Time constraints successfully saved!",
        });
      }
    } catch (error) {
      console.error("Error saving year level time constraints:", error);
      setStatusMessage({
        type: "error",
        text: "An error occurred while saving. Please try again.",
      });
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
    <>
      {/* Mobile/Small screen warning */}
      <div className="sm:hidden flex flex-col items-center justify-center h-screen mx-5">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Limited Access
          </h2>
          <p className="text-gray-600 mb-6">
            This page is optimized for laptop or desktop use. Please open it
            <br />
            on a larger screen for the best experience.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="min-h-screen hidden sm:flex flex-col">
        <div className="mx-auto py-10">
          <Navbar />
        </div>
        <section className="px-4 md:px-8 lg:px-16 flex flex-col md:flex-row gap-4 md:gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
          <div className="text-primary mt-5 text-2xl md:text-[35px] text-center md:text-left">
            Year Level - Time Constraints
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <form onSubmit={handleSave}>
          <section className="flex flex-col gap-5 mt-8 md:mt-11 px-4 md:px-8">
            {(Object.keys(yearLevels) as Array<keyof YearLevels>).map(
              (year) => {
                return (
                  <div className="flex flex-col items-center  gap-5 mx-auto bg-[#F1FAFF] p-4 md:p-5 rounded-xl shadow-md">
                    <p className="text-primary font-Manrope font-extrabold">
                      {year}
                    </p>
                    <div className="items-center">
                      <div className="gap-5">
                        {yearLevels[year].map(
                          (
                            yearData,
                            yearDataIndex // Use map instead of forEach
                          ) => {
                            // console.log("year data", yearData);
                            return (
                              <div className="">
                                <div className="">
                                  <div className="gap-3 items-center justify-center font-Manrope font-semibold text-sm">
                                    <div className="h-[38px] flex items-center text-primary font-Manrope font-extrabold">
                                      {getDayFullName(yearData.day)}
                                    </div>
                                    <div className="bg-[#BFDDF6] rounded-xl px-3 sm:px-4 md:px-8 py-4 flex flex-col gap-y-3 w-full ">
                                      {yearData.startEndTimes.length > 0 ? (
                                        yearData.startEndTimes.map(
                                          (time, timeIndex) => {
                                            return (
                                              <div className="flex flex-col w-full">
                                                <div className="flex flex-wrap md:flex-nowrap items-center gap-x-2 md:gap-x-4 gap-y-2">
                                                  <label
                                                    htmlFor={`${year}-start`}
                                                    className="text-xs sm:text-sm"
                                                  >
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
                                                    className={`h-[38px] border w-[100px] sm:w-[130px] ${
                                                      timeErrors[year]?.[
                                                        yearDataIndex
                                                      ]?.[timeIndex]
                                                        ? "border-red-500"
                                                        : "border-primary"
                                                    } rounded-[5px] py-1 px-2 text-xs sm:text-sm`}
                                                    required
                                                    step="1800"
                                                  />
                                                  <label
                                                    htmlFor={`${year}-end`}
                                                    className="text-xs sm:text-sm"
                                                  >
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
                                                    className={`h-[38px] w-[100px] sm:w-[130px] border ${
                                                      timeErrors[year]?.[
                                                        yearDataIndex
                                                      ]?.[timeIndex]
                                                        ? "border-red-500"
                                                        : "border-primary"
                                                    } rounded-[5px] py-1 px-2 text-xs sm:text-sm`}
                                                    required
                                                    step="1800"
                                                  />
                                                  <div className="flex gap-x-2 ml-auto">
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        handleAddTimeRestriction(
                                                          year,
                                                          yearDataIndex,
                                                          timeIndex
                                                        )
                                                      }
                                                      className="w-6 sm:w-7"
                                                    >
                                                      <img src={add_button} />
                                                    </button>
                                                    {yearData.startEndTimes
                                                      .length > 0 && (
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
                                                </div>
                                                {timeErrors[year]?.[
                                                  yearDataIndex
                                                ]?.[timeIndex] && (
                                                  <div className="text-red-500 text-xs mt-1 ml-0 md:ml-12">
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
                                        <div className="flex justify-center mx-36 my-1">
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
              }
            )}
          </section>

          {statusMessage.type && (
            <div
              className={`mx-auto max-w-lg mt-6 p-3 rounded-md text-center font-medium flex justify-between items-center ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              <span className="flex-grow">{statusMessage.text}</span>
              <button
                onClick={clearStatusMessage}
                className="text-gray-600 hover:text-gray-900 ml-5 flex items-center"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-8 md:mt-11 mb-16 md:mb-24 rounded-sm hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InputYLT;
