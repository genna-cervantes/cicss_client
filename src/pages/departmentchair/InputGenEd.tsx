import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";

import add_button from "../../assets/add_button.png";
import ScrollButton from "../../components/ScrollButton";

interface TimeEntry {
  start: string;
  end: string;
  error?: string;
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

const dayOptions: Option[] = [
  { value: "M", label: "Monday" },
  { value: "T", label: "Tuesday" },
  { value: "W", label: "Wednesday" },
  { value: "TH", label: "Thursday" },
  { value: "F", label: "Friday" },
  { value: "S", label: "Saturday" },
];

const getDayOptions = (
  currentRestriction: string,
  currentDayRestrictions: Restriction[]
) => {
  const availableDays = dayOptions.filter(
    (opt) => !currentDayRestrictions.some((res) => res.day === opt.value)
  );

  const currentDayOption = dayOptions.find(
    (opt) => opt.value === currentRestriction
  );

  return currentDayOption
    ? [...availableDays, currentDayOption]
    : availableDays;
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #02296D",
    borderRadius: "6px",
    width: "170px",
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

  const [updatedGenedConstraints, setUpdatedGenedConstraints] = useState<
    {
      courseCode: string;
      courseRestriction: Restriction[];
    }[]
  >([]);

  const [timeErrors, setTimeErrors] = useState<{
    [key: number]: { [key: number]: { [key: number]: string } };
  }>({});

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Function to validate time entries
  const validateTimeEntry = (
    genEdIndex: number,
    restrictionIndex: number,
    timeIndex: number,
    startTime: string,
    endTime: string
  ): string => {
    if (!startTime || !endTime) return "";

    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return "End time must be after start time";
    }

    if (endMinutes - startMinutes < 30) {
      //depende pa to
      return "Time slot must be at least 30 minutes";
    } else if (endMinutes - startMinutes > 300) {
      //depende pa to
      return "Time slot cannot exceed 5 hours";
    }

    // Check for valid time window (7am-9pm)
    const earliestAllowedTime = 7 * 60; // 7:00 AM
    const latestAllowedTime = 21 * 60; // 9:00 PM

    if (startMinutes < earliestAllowedTime) {
      return "Start time cannot be earlier than 7:00 AM";
    } else if (endMinutes > latestAllowedTime) {
      return "End time cannot be later than 9:00 PM";
    }

    const currentRestriction =
      genEdList[genEdIndex].courseRestriction[restrictionIndex];
    for (let i = 0; i < currentRestriction.startEndTimes.length; i++) {
      if (i === timeIndex) continue;

      const otherStart = convertTimeToMinutes(
        currentRestriction.startEndTimes[i].start
      );
      const otherEnd = convertTimeToMinutes(
        currentRestriction.startEndTimes[i].end
      );

      if (
        otherStart &&
        otherEnd &&
        ((startMinutes >= otherStart && startMinutes < otherEnd) ||
          (endMinutes > otherStart && endMinutes <= otherEnd) ||
          (startMinutes <= otherStart && endMinutes >= otherEnd))
      ) {
        return "Time slots cannot overlap";
      }
    }

    return "";
  };

  const hasTimeValidationErrors = (): boolean => {
    return Object.keys(timeErrors).length > 0;
  };

  const validateBeforeSave = (): boolean => {
    if (hasTimeValidationErrors()) {
      alert("Please fix all time validation errors before saving");
      return false;
    }

    const hasInvalidTimeEntries = genEdList.some((genEd, genEdIndex) =>
      genEd.courseRestriction.some((restriction, reqIndex) =>
        restriction.startEndTimes.some((time, timeIndex) => {
          if (time.start && time.end) {
            const startMinutes = convertTimeToMinutes(time.start);
            const endMinutes = convertTimeToMinutes(time.end);
            return endMinutes <= startMinutes;
          }
          return false;
        })
      )
    );

    if (hasInvalidTimeEntries) {
      alert("End time must be after start time in all time entries");
      return false;
    }

    const hasEmptyDays = genEdList.some((genEd) =>
      genEd.courseRestriction.some(
        (restriction) =>
          restriction.day === "" &&
          restriction.startEndTimes.some((time) => time.start || time.end)
      )
    );

    if (hasEmptyDays) {
      alert("Please select a day for all time restrictions");
      return false;
    }

    const hasEmptyTimes = genEdList.some((genEd) =>
      genEd.courseRestriction.some((restriction) =>
        restriction.startEndTimes.some(
          (time) => (time.start && !time.end) || (!time.start && time.end)
        )
      )
    );

    if (hasEmptyTimes) {
      alert(
        "Please fill in both start and end times for all time restrictions"
      );
      return false;
    }

    return true;
  };

  //Handler for changing a restriction's day for a specific GenEd Course
  const handleGenEdDayRestrictionChange = useCallback(
    (
      courseCode: string,
      selectedOption: Option | null,
      restricitonIndex: number
    ) => {
      if (selectedOption == null) {
        return;
      }

      console.log("getting called");
      console.log(selectedOption);

      setGenEdList((prev) => {
        const index = prev.findIndex(
          (course) => course.courseCode === courseCode
        );
        if (index === -1) return prev; // No change if course not found

        const course = prev[index];
        let resIndex = restricitonIndex;

        console.log("res index", resIndex);

        let updatedRestrictions;

        // Update existing restriction
        updatedRestrictions = course.courseRestriction.map((res, i) =>
          i === resIndex ? { ...res, day: selectedOption.value } : res
        );

        // Update course with new restrictions
        const updatedCourse = {
          ...course,
          courseRestriction: updatedRestrictions,
        };

        handleUpdate({ genedConstraint: updatedCourse });

        const newGenedConstraints = [...prev];
        newGenedConstraints[index] = updatedCourse;

        return newGenedConstraints;
      });
    },
    []
  );

  useEffect(() => {
    console.log("updated gened constraints");
    console.log(updatedGenedConstraints);
  }, [updatedGenedConstraints]);

  // Handler for changing a time field (start or end) for a specific GenEd Course
  const handleGenEdTimeRestrictionChange = useCallback(
    (
      genEdIndex: number,
      restrictionIndex: number,
      timeIndex: number,
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const { name, value } = e.target;

      console.log(value);
      setGenEdList((prev) => {
        const index = genEdIndex;
        if (index === -1) return prev;
        const course = prev[index];
        const resIndex = restrictionIndex;

        let updatedRestrictions;

        updatedRestrictions = course.courseRestriction.map((res, i) => {
          if (i === resIndex) {
            let updatedStartEndTimes = res.startEndTimes.map((set, si) => {
              if (si === timeIndex) {
                return {
                  ...set,
                  [name]: value,
                };
              } else {
                return set;
              }
            });

            return { ...res, startEndTimes: updatedStartEndTimes };
          } else {
            return { ...res };
          }
        });

        // Update course with new restrictions
        const updatedCourse = {
          ...course,
          courseRestriction: updatedRestrictions,
        };

        handleUpdate({ genedConstraint: updatedCourse });

        // Return new list with updated course
        const newGenedConstraints = [...prev];
        newGenedConstraints[genEdIndex] = updatedCourse;

        return newGenedConstraints;
      });

      // Add time validation
      const updatedTime = {
        ...genEdList[genEdIndex].courseRestriction[restrictionIndex]
          .startEndTimes[timeIndex],
        [name]: value,
      };

      const startTime = name === "start" ? value : updatedTime.start;
      const endTime = name === "end" ? value : updatedTime.end;

      if (startTime && endTime) {
        const error = validateTimeEntry(
          genEdIndex,
          restrictionIndex,
          timeIndex,
          startTime,
          endTime
        );

        setTimeErrors((prev) => {
          const updatedErrors = { ...prev };

          if (!updatedErrors[genEdIndex]) {
            updatedErrors[genEdIndex] = {};
          }

          if (!updatedErrors[genEdIndex][restrictionIndex]) {
            updatedErrors[genEdIndex][restrictionIndex] = {};
          }

          if (error) {
            updatedErrors[genEdIndex][restrictionIndex][timeIndex] = error;
          } else {
            delete updatedErrors[genEdIndex][restrictionIndex][timeIndex];

            if (
              Object.keys(updatedErrors[genEdIndex][restrictionIndex])
                .length === 0
            ) {
              delete updatedErrors[genEdIndex][restrictionIndex];
            }

            if (Object.keys(updatedErrors[genEdIndex]).length === 0) {
              delete updatedErrors[genEdIndex];
            }
          }

          return updatedErrors;
        });
      }
    },
    [genEdList]
  );

  // Handler to add a new day restriciton to a specific GenEd Course
  const handleAddDayRestriction = useCallback(
    (courseCode: string, e: FormEvent) => {
      e.preventDefault();

      const genEdIndex = genEdList.findIndex(
        (gened) => gened.courseCode === courseCode
      );

      const hasExistingErrors =
        Object.keys(timeErrors[genEdIndex] || {}).length > 0;

      const hasEmptyDays = genEdList[genEdIndex].courseRestriction.some(
        (restriction) =>
          restriction.day === "" &&
          restriction.startEndTimes.some((time) => time.start || time.end)
      );

      const hasIncompleteTime = genEdList[genEdIndex].courseRestriction.some(
        (restriction) =>
          restriction.startEndTimes.some(
            (time) => (time.start && !time.end) || (!time.start && time.end)
          )
      );

      if (hasExistingErrors || hasEmptyDays || hasIncompleteTime) {
        alert(
          "Please fix existing validation errors before adding a new time restriction"
        );
        return;
      }

      setGenEdList((prev) => {
        let index = prev.findIndex((gened) => gened.courseCode === courseCode);

        let updatedGened = {
          ...prev[index],
          courseRestriction: [
            ...prev[index].courseRestriction,
            { day: "", startEndTimes: [{ start: "", end: "" }] },
          ],
        };

        handleUpdate({ genedConstraint: updatedGened });

        let updatedGenedConstraints = [...prev];
        updatedGenedConstraints[index] = updatedGened;

        return updatedGenedConstraints;
      });
    },
    [genEdList, timeErrors]
  );

  // Handler to delete a day restriction from a specific GenEd Course
  const handleDeleteDayRestriction = useCallback(
    (genEdIndex: number, restrictionIndex: number) => {
      setGenEdList((prev) => {
        const updated = [...prev];
        updated[genEdIndex] = {
          ...updated[genEdIndex],
          courseRestriction: updated[genEdIndex].courseRestriction.filter(
            (_, i) => i !== restrictionIndex
          ),
        };

        handleUpdate({ genedConstraint: updated[genEdIndex] });

        return updated;
      });

      // Clear any errors for the deleted restriction
      setTimeErrors((prev) => {
        if (prev[genEdIndex] && prev[genEdIndex][restrictionIndex]) {
          const updatedErrors = { ...prev };
          delete updatedErrors[genEdIndex][restrictionIndex];

          if (Object.keys(updatedErrors[genEdIndex]).length === 0) {
            delete updatedErrors[genEdIndex];
          }

          return updatedErrors;
        }
        return prev;
      });
    },
    []
  );

  // Handler to add a new time entry to a GenEd Course
  const handleAddTimeRestriction = useCallback(
    (genEdIndex: number, restrictionIndex: number) => {
      const hasExistingErrors =
        Object.keys(timeErrors[genEdIndex]?.[restrictionIndex] || {}).length >
        0;

      const hasIncompleteTime = genEdList[genEdIndex].courseRestriction[
        restrictionIndex
      ].startEndTimes.some(
        (time) => (time.start && !time.end) || (!time.start && time.end)
      );

      if (hasExistingErrors || hasIncompleteTime) {
        alert("Please fix existing time entries before adding a new one");
        return;
      }

      if (!genEdList[genEdIndex].courseRestriction[restrictionIndex].day) {
        alert("Please select a day before adding time slots");
        return;
      }

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

        handleUpdate({ genedConstraint: updated[genEdIndex] });

        return updated;
      });
    },
    [genEdList, timeErrors]
  );

  // Handler to delete a time entry from a GenEd Course
  const handleDeleteTimeRestriction = useCallback(
    (genEdIndex: number, requestIndex: number, timeIndex: number) => {
      setGenEdList((prev) => {
        const updated = [...prev];
        const updatedRequests = [...updated[genEdIndex].courseRestriction];
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

        handleUpdate({ genedConstraint: updated[genEdIndex] });

        return updated;
      });

      setTimeErrors((prev) => {
        if (
          prev[genEdIndex] &&
          prev[genEdIndex][requestIndex] &&
          prev[genEdIndex][requestIndex][timeIndex]
        ) {
          const updatedErrors = { ...prev };
          delete updatedErrors[genEdIndex][requestIndex][timeIndex];

          if (
            Object.keys(updatedErrors[genEdIndex][requestIndex]).length === 0
          ) {
            delete updatedErrors[genEdIndex][requestIndex];
          }

          if (Object.keys(updatedErrors[genEdIndex]).length === 0) {
            delete updatedErrors[genEdIndex];
          }

          return updatedErrors;
        }
        return prev;
      });
    },
    []
  );

  const handleUpdate = ({
    genedConstraint,
  }: {
    genedConstraint: GenEdInfo;
  }) => {
    setUpdatedGenedConstraints((prev) => {
      let newGened = [...prev];
      let index = prev.findIndex(
        (gen) => gen.courseCode === genedConstraint.courseCode
      );
      if (index === -1) {
        newGened.push({
          courseCode: genedConstraint.courseCode,
          courseRestriction: genedConstraint.courseRestriction,
        });
      } else {
        newGened[index] = {
          courseCode: genedConstraint.courseCode,
          courseRestriction: genedConstraint.courseRestriction,
        };
      }
      return newGened;
    });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true")

    // Validate before saving
    if (!validateBeforeSave()) {
      return;
    }

    // handle update
    const updateGenedConstraintData = async () => {
      try {
        let isSuccess = false;
        let apiErrors: string[] = [];

        for (let i = 0; i < updatedGenedConstraints.length; i++) {
          let genedcon = updatedGenedConstraints[i];

          let transformedRestrictions: any = {
            M: [],
            T: [],
            W: [],
            TH: [],
            F: [],
            S: [],
          };
          genedcon.courseRestriction.forEach((res) => {
            if (!res.day) return; // Skip entries with empty days

            let transformedStartEndTimes = res.startEndTimes
              .filter(
                // Filter out incomplete time entries
                (set) => set.start && set.end
              )
              .map((set) => {
                return {
                  start: `${set.start.slice(0, 2)}${set.start.slice(3)}`,
                  end: `${set.end.slice(0, 2)}${set.end.slice(3)}`,
                };
              });

            transformedRestrictions[res.day] = transformedStartEndTimes;
          });

          try {
            const res = await fetch(
              `http://localhost:8080/genedconstraint/${genedcon.courseCode}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${
                    localStorage.getItem("token") ?? ""
                  }`,
                  "Content-type": "application/json",
                },
                body: JSON.stringify(transformedRestrictions),
              }
            );

            if (res.ok) {
              isSuccess = true;
            } else {
              const data = await res.json();
              apiErrors.push(
                `Failed to update ${genedcon.courseCode}: ${
                  data.message || "Unknown error"
                }`
              );
            }
          } catch (error) {
            console.error("Update fetch error:", error);
            apiErrors.push(`Network error updating ${genedcon.courseCode}`);
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
            text: "Gen Ed constraints successfully saved!",
          });
        } else if (updatedGenedConstraints.length === 0) {
          setStatusMessage({
            type: "error",
            text: "No changes to save.",
          });
        }
      } catch (error) {
        console.error("Error saving gen ed constraints:", error);
        setStatusMessage({
          type: "error",
          text: "An error occurred while saving. Please try again.",
        });
      }
    };
    updateGenedConstraintData();
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
                  let transformedStartEndTimes = genedConstraint.restrictions[
                    genedkey
                  ].map((time: any) => {
                    let start = time?.start
                      ? `${time.start.slice(0, 2)}:${time.start.slice(2)}`
                      : "";
                    let end = time?.end
                      ? `${time.end.slice(0, 2)}:${time.end.slice(2)}`
                      : "";

                    return { start, end };
                  });

                  return {
                    day: genedkey,
                    startEndTimes: transformedStartEndTimes,
                  };
                }
                return undefined; // Explicitly return undefined
              })
              .filter(Boolean);
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

  //Main
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

      {/*Main*/}
      <div className="min-h-screen hidden sm:flex flex-col">
        <div className="mx-auto py-10">
          <ScrollButton />
          <Navbar />
        </div>
        <section className="px-4 md:px-16 flex flex-col md:flex-row gap-4 md:gap-11 font-Helvetica-Neue-Heavy items-center justify-center text-center md:text-left">
          <div className="text-primary mt-5 text-[28px] md:text-[35px]">
            Gen Ed Constraints
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <div className="flex mx-auto gap-5 font-Manrope font-semibold mt-2">
          <form onSubmit={handleSave}>
            {genEdList.map((genEdCourse, genEdIndex) => {
              if (genEdIndex === 1) console.log(genEdCourse);
              return (
                <div key={genEdIndex} className="mb-7 flex gap-3">
                  <div className="flex flex-col p-3 rounded-xl shadow-xl w-full bg-[#F1FAFF]">
                    <div className="flex mb-2 font-Manrope font-extrabold text-primary">
                      <div className="ml-20 mr-3">Name</div>
                      <div className="ml-28">Code</div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5">
                      {/*Input Name and Course Code*/}
                      <div className="flex gap-3">
                        <div className="flex justify-center gap-3">
                          <div>
                            <input
                              disabled
                              type="text"
                              name="courseCode"
                              value={genEdCourse.courseTitle}
                              // onChange={(e) => handleCourseCodeChange(genEdIndex, e)}
                              placeholder="Enter"
                              className="h-[38px] border border-primary rounded-[5px] px-2 w-[200px]"
                            />
                          </div>
                        </div>
                        <div>
                          <input
                            disabled
                            type="text"
                            name="courseCode"
                            value={genEdCourse.courseCode}
                            // onChange={(e) => handleCourseCodeChange(genEdIndex, e)}
                            placeholder="Enter"
                            className="h-[38px] border border-primary rounded-[5px] px-2 w-[120px]"
                          />
                        </div>
                      </div>

                      {/*Day and Time Restriction*/}
                      <div className="w-full">
                        {/* kapag wala ndi siya nag mmap */}
                        {genEdCourse.courseRestriction.length > 0 ? (
                          <div>
                            {genEdCourse.courseRestriction.map(
                              (restriction, restrictionIndex) => {
                                return (
                                  <DayRestriction
                                    key={restrictionIndex}
                                    restriction={restriction}
                                    restrictionIndex={restrictionIndex}
                                    genEdCourse={genEdCourse}
                                    genEdIndex={genEdIndex}
                                    handleAddTimeRestriction={
                                      handleAddTimeRestriction
                                    }
                                    handleDeleteTimeRestriction={
                                      handleDeleteTimeRestriction
                                    }
                                    handleGenEdDayRestrictionChange={
                                      handleGenEdDayRestrictionChange
                                    }
                                    handleGenEdTimeRestrictionChange={
                                      handleGenEdTimeRestrictionChange
                                    }
                                    handleDeleteDayRestriction={
                                      handleDeleteDayRestriction
                                    }
                                    timeErrors={timeErrors}
                                  />
                                );
                              }
                            )}
                            <div className="flex justify-center mb-3">
                              {genEdCourse.courseRestriction.length < 6 && (
                                <button
                                  onClick={(e) =>
                                    handleAddDayRestriction(
                                      genEdCourse.courseCode,
                                      e
                                    )
                                  }
                                  className="bg-primary text-white py-2 px-5 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#BFDDF6] p-5 rounded-md mb-5 w-full flex justify-center">
                            {genEdCourse.courseRestriction.length < 6 && (
                              <button
                                onClick={(e) =>
                                  handleAddDayRestriction(
                                    genEdCourse.courseCode,
                                    e
                                  )
                                }
                                className="bg-primary text-white py-2 px-5 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col">
              {statusMessage.type && (
                <div
                  className={`mx-auto mt-6 p-3 rounded-md text-center font-medium flex justify-between items-center ${
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

              <div className="justify-center flex gap-4 font-Manrope font-semibold">
                <button
                  type="submit"
                  className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                >
                  Save
                </button>
                {/* walang add dito kasi lahat ng gened course nakalagay na here */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const DayRestriction = React.memo(
  ({
    genEdCourse,
    restriction,
    genEdIndex,
    restrictionIndex,
    handleGenEdDayRestrictionChange,
    handleGenEdTimeRestrictionChange,
    handleDeleteTimeRestriction,
    handleAddTimeRestriction,
    handleDeleteDayRestriction,
    timeErrors,
  }: {
    genEdCourse: GenEdInfo;
    restriction: Restriction;
    genEdIndex: number;
    restrictionIndex: number;
    handleGenEdDayRestrictionChange: (
      courseCode: string,
      selectedOption: Option | null,
      restricitonIndex: number
    ) => void;
    handleGenEdTimeRestrictionChange: (
      genEdIndex: number,
      restrictionIndex: number,
      timeIndex: number,
      e: ChangeEvent<HTMLInputElement>
    ) => void;
    handleDeleteTimeRestriction: (
      genEdIndex: number,
      requestIndex: number,
      timeIndex: number
    ) => void;
    handleAddTimeRestriction: (
      genEdIndex: number,
      restrictionIndex: number
    ) => void;
    handleDeleteDayRestriction: (
      genEdIndex: number,
      restrictionIndex: number
    ) => void;
    timeErrors: {
      [key: number]: { [key: number]: { [key: number]: string } };
    };
  }) => {
    const dayOptionsMemoized = useMemo(
      () => getDayOptions(restriction.day, genEdCourse.courseRestriction),
      [genEdCourse.courseRestriction]
    );

    const customStylesMemoized = useMemo(() => customStyles, []);

    const onChangeHandler = useCallback(
      (selectedOption: any) =>
        handleGenEdDayRestrictionChange(
          genEdCourse.courseCode,
          selectedOption,
          restrictionIndex
        ),
      [genEdCourse.courseCode, handleGenEdDayRestrictionChange]
    );

    const selectedValue = useMemo(
      () =>
        dayOptionsMemoized.find((opt) => opt.value === restriction.day) || null,
      [dayOptionsMemoized, restriction.day]
    );

    return (
      <div className="bg-[#BFDDF6] p-5 rounded-md mb-5">
        <div>
          <div className="text-center mb-3 font-Manrope font-extrabold text-primary">
            Day and Time Restriction
          </div>
          <div className="flex gap-3 justify-center">
            <div className="flex flex-col mb-3">
              <label className="text-left mb-1">Day</label>
              <MemoizedSelect
                selectedValue={selectedValue}
                onChangeHandler={onChangeHandler}
                customStylesMemoized={customStylesMemoized}
                dayOptionsMemoized={dayOptionsMemoized}
              />
            </div>

            <div className="flex flex-col">
              {restriction.startEndTimes.length > 0 ? (
                restriction.startEndTimes.map((time, timeIndex) => {
                  return (
                    <div
                      key={timeIndex}
                      className="mb-3 flex gap-3 justify-center"
                    >
                      <div className="flex flex-col">
                        <label className="text-left mb-1">Start</label>
                        <input
                          type="time"
                          name="start"
                          value={time.start}
                          onChange={(e) =>
                            handleGenEdTimeRestrictionChange(
                              genEdIndex,
                              restrictionIndex,
                              timeIndex,
                              e
                            )
                          }
                          className={`h-[38px] border w-[130px] ${
                            timeErrors[genEdIndex]?.[restrictionIndex]?.[
                              timeIndex
                            ]
                              ? "border-red-500"
                              : "border-primary"
                          } rounded-[5px] py-1 px-2`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-left mb-1">End</label>
                        <input
                          type="time"
                          name="end"
                          value={time.end}
                          onChange={(e) =>
                            handleGenEdTimeRestrictionChange(
                              genEdIndex,
                              restrictionIndex,
                              timeIndex,
                              e
                            )
                          }
                          className={`h-[38px] border w-[130px] ${
                            timeErrors[genEdIndex]?.[restrictionIndex]?.[
                              timeIndex
                            ]
                              ? "border-red-500"
                              : "border-primary"
                          } rounded-[5px] py-1 px-2`}
                        />
                      </div>
                      <div className="flex items-end gap-1">
                        {restriction.startEndTimes.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteTimeRestriction(
                                genEdIndex,
                                restrictionIndex,
                                timeIndex
                              )
                            }
                            className="mb-[6px]"
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
                          className="w-7 mb-[6px]"
                        >
                          <img src={add_button} />
                        </button>
                      </div>

                      {timeErrors[genEdIndex]?.[restrictionIndex]?.[
                        timeIndex
                      ] && (
                        <div className="text-red-500 text-xs absolute mt-[70px] ml-1">
                          {timeErrors[genEdIndex][restrictionIndex][timeIndex]}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col">
                  <div className="mb-3 flex gap-3 justify-center">
                    <div className="flex flex-col">
                      <label className="text-left mb-1">Start</label>
                      <input
                        type="time"
                        name="start"
                        value=""
                        onChange={(e) =>
                          handleGenEdTimeRestrictionChange(genEdIndex, 0, 0, e)
                        }
                        className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-left mb-1">End</label>
                      <input
                        type="time"
                        name="end"
                        value={
                          genEdCourse?.courseRestriction[0]?.startEndTimes[0]
                            ?.end || ""
                        }
                        onChange={(e) =>
                          handleGenEdTimeRestrictionChange(genEdIndex, 0, 0, e)
                        }
                        className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteTimeRestriction(genEdIndex, 0, 0)
                        }
                        className="mb-[6px]"
                      >
                        <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddTimeRestriction(genEdIndex, 0)}
                        className="w-7 mb-[6px]"
                      >
                        <img src={add_button} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={() =>
              handleDeleteDayRestriction(genEdIndex, restrictionIndex)
            }
            className="border border-primary text-primary py-1 px-4 text-xs rounded-md transition-all duration-300 active:scale-95 active:shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
);

const MemoizedSelect = React.memo(
  ({
    dayOptionsMemoized,
    selectedValue,
    onChangeHandler,
    customStylesMemoized,
  }: {
    dayOptionsMemoized: any;
    selectedValue: any;
    onChangeHandler: any;
    customStylesMemoized: any;
  }) => {
    return (
      <Select
        options={dayOptionsMemoized}
        placeholder="Select"
        value={selectedValue}
        onChange={onChangeHandler}
        styles={customStylesMemoized}
      />
    );
  }
);

export default InputGenEd;
