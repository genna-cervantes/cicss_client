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
      // Initial structure, will be overwritten by fetched data if available
    ],
    "Second Year": [],
    "Third Year": [],
    "Fourth Year": [],
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

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    year: string;
    yearDataIndex: number;
    timeIndex: number;
  } | null>(null);

  useEffect(() => {
    console.log("updatedYearLevels changed:", updatedYearLevels);
  }, [updatedYearLevels]);

  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

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
    if (value && !isValidTimeFormat(value)) {
      setTimeErrors((prev) => {
        const updated = { ...prev };
        if (!updated[year]) updated[year] = {};
        if (!updated[year][yearDataIndex]) updated[year][yearDataIndex] = {};
        updated[year][yearDataIndex][timeIndex] =
          "Time must be on the hour (XX:00) or half-hour (XX:30)";
        return updated;
      });
      // Do not update yearLevels if format is invalid, but allow the input to reflect the change temporarily
      // The value will be in the input, but the error will show. Saving will be blocked.
    }

    let updatedYearForState: any;
    setYearLevels((prev: any) => {
      updatedYearForState = prev[year as keyof YearLevels].map(
        (yearData: any, idx: number) =>
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
        [year]: updatedYearForState,
      };
    });

    // Perform validations after state update to use the latest values
    // We need to access the potentially updated value directly for validation
    // or use a useEffect to validate after yearLevels has been set.
    // For immediate feedback, let's use the new value for the changed field
    // and the existing state for the other field.

    // Re-access the specific time entry from the *next* state (conceptually, or use the new value)
    const currentTimesEntry =
      yearLevels[year as keyof YearLevels][yearDataIndex].startEndTimes[
        timeIndex
      ];
    let tempStartTime = currentTimesEntry.startTime;
    let tempEndTime = currentTimesEntry.endTime;

    if (name === "startTime") {
      tempStartTime = value;
    } else {
      tempEndTime = value;
    }

    // Format validation (again, to clear or set)
    if (value && !isValidTimeFormat(value)) {
      // Error already set above, just ensure it stays if condition met
    } else if (
      timeErrors[year]?.[yearDataIndex]?.[timeIndex]?.includes(
        "Time must be on the hour"
      )
    ) {
      // Clear format error if now valid
      setTimeErrors((prev) => {
        const updated = { ...prev };
        if (updated[year]?.[yearDataIndex]?.[timeIndex]) {
          delete updated[year][yearDataIndex][timeIndex];
          if (Object.keys(updated[year][yearDataIndex]).length === 0)
            delete updated[year][yearDataIndex];
          if (Object.keys(updated[year]).length === 0) delete updated[year];
        }
        return updated;
      });
    }

    // Proceed with other validations if format is okay or field is empty
    if (
      tempStartTime &&
      tempEndTime &&
      isValidTimeFormat(tempStartTime) &&
      isValidTimeFormat(tempEndTime)
    ) {
      let error = "";
      const startMinutes = convertTimeToMinutes(tempStartTime);
      const endMinutes = convertTimeToMinutes(tempEndTime);

      if (endMinutes <= startMinutes) {
        error = "End time must be after start time";
      } else if (endMinutes - startMinutes < 30) {
        error = "Time slot must be at least 30 minutes";
      } else if (endMinutes - startMinutes > 840) {
        error = "Time slot cannot exceed 14 hours";
      }

      const earliestAllowedTime = 7 * 60; // 7:00 AM
      const latestAllowedTime = 21 * 60; // 9:00 PM

      if (!error) {
        if (startMinutes < earliestAllowedTime) {
          error = "Start time cannot be earlier than 7:00 AM";
        } else if (endMinutes > latestAllowedTime) {
          error = "End time cannot be later than 9:00 PM";
        }
      }

      if (!error) {
        const currentDayTimes =
          yearLevels[year as keyof YearLevels][yearDataIndex].startEndTimes;
        for (let i = 0; i < currentDayTimes.length; i++) {
          if (i === timeIndex) continue;

          const otherTime = currentDayTimes[i];
          if (
            !otherTime.startTime ||
            !otherTime.endTime ||
            !isValidTimeFormat(otherTime.startTime) ||
            !isValidTimeFormat(otherTime.endTime)
          )
            continue;

          const otherStart = convertTimeToMinutes(otherTime.startTime);
          const otherEnd = convertTimeToMinutes(otherTime.endTime);

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
        if (!updated[year]) updated[year] = {};
        if (!updated[year][yearDataIndex]) updated[year][yearDataIndex] = {};

        if (error) {
          updated[year][yearDataIndex][timeIndex] = error;
        } else {
          if (updated[year][yearDataIndex]?.[timeIndex]) {
            delete updated[year][yearDataIndex][timeIndex];
            if (Object.keys(updated[year][yearDataIndex]).length === 0)
              delete updated[year][yearDataIndex];
            if (Object.keys(updated[year]).length === 0) delete updated[year];
          }
        }
        return updated;
      });
    } else if (!tempStartTime && !tempEndTime) {
      // If both are cleared, clear errors
      setTimeErrors((prev) => {
        const updated = { ...prev };
        if (updated[year]?.[yearDataIndex]?.[timeIndex]) {
          delete updated[year][yearDataIndex][timeIndex];
          if (Object.keys(updated[year][yearDataIndex]).length === 0)
            delete updated[year][yearDataIndex];
          if (Object.keys(updated[year]).length === 0) delete updated[year];
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

    // Use updatedYearForState which reflects the change for setUpdatedYearLevels
    setUpdatedYearLevels((prev) => {
      const existingIndex = prev.findIndex((item) => item[yearLevel]);
      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex ? { [yearLevel]: updatedYearForState } : item
        );
      } else {
        return [...prev, { [yearLevel]: updatedYearForState }];
      }
    });
  };

  const handleAddTimeRestriction = (
    year: string,
    yearDataIndex: number,
    _timeIndex: number // timeIndex is not strictly needed here but kept for signature consistency if ever
  ) => {
    const hasExistingErrors = timeErrors[year]?.[yearDataIndex]
      ? Object.values(timeErrors[year][yearDataIndex]).some(
          (err) => err !== undefined && err !== ""
        )
      : false;

    const currentDayTimes =
      yearLevels[year as keyof YearLevels][yearDataIndex].startEndTimes;
    const hasIncompleteTime = currentDayTimes.some(
      (time) =>
        (time.startTime && !time.endTime) ||
        (!time.startTime && time.endTime) ||
        !isValidTimeFormat(time.startTime) ||
        !isValidTimeFormat(time.endTime)
    );

    const hasAnyErrorsForDay =
      Object.values(timeErrors[year]?.[yearDataIndex] || {}).length > 0;

    if (hasAnyErrorsForDay || hasIncompleteTime) {
      setStatusMessage({
        type: "error",
        text: "Please fix or complete existing time entries for this day before adding a new one.",
      });
      setTimeout(clearStatusMessage, 3000);
      return;
    }

    let updatedYearWithNewSlot: any;
    setYearLevels((prev: any) => {
      updatedYearWithNewSlot = prev[year as keyof YearLevels].map(
        (yearData: any, idx: number) => {
          if (idx === yearDataIndex) {
            return {
              ...yearData,
              startEndTimes: [
                ...yearData.startEndTimes,
                { startTime: "", endTime: "" },
              ],
            };
          }
          return yearData;
        }
      );
      return {
        ...prev,
        [year]: updatedYearWithNewSlot,
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
      const existingIndex = prev.findIndex((item) => item[yearLevel]);
      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex
            ? { [yearLevel]: updatedYearWithNewSlot }
            : item
        );
      } else {
        return [...prev, { [yearLevel]: updatedYearWithNewSlot }];
      }
    });
  };

  // Opens the delete confirmation modal
  const handleDeleteTimeRestriction = (
    year: string,
    yearDataIndex: number,
    timeIndex: number
  ) => {
    setDeleteTarget({ year, yearDataIndex, timeIndex });
    setShowDeleteModal(true);
  };

  // Closes the modal without deleting
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Performs the actual deletion
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const { year, yearDataIndex, timeIndex } = deleteTarget;

    let updatedYearAfterDeletion: any;
    setYearLevels((prev: any) => {
      updatedYearAfterDeletion = prev[year as keyof YearLevels].map(
        (yearData: any, idx: number) => {
          if (idx === yearDataIndex) {
            return {
              ...yearData,
              startEndTimes: yearData.startEndTimes.filter(
                (_: any, i: number) => i !== timeIndex
              ),
            };
          }
          return yearData;
        }
      );
      return {
        ...prev,
        [year]: updatedYearAfterDeletion,
      };
    });

    setTimeErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[year]?.[yearDataIndex]?.[timeIndex]) {
        delete newErrors[year][yearDataIndex][timeIndex];
        if (Object.keys(newErrors[year][yearDataIndex]).length === 0) {
          delete newErrors[year][yearDataIndex];
        }
        if (Object.keys(newErrors[year]).length === 0) {
          delete newErrors[year];
        }
      }
      return newErrors;
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
          index === existingIndex
            ? { [yearLevel]: updatedYearAfterDeletion }
            : item
        );
      } else {
        // If the year level wasn't in updatedYearLevels, add it with the new state
        return [...prev, { [yearLevel]: updatedYearAfterDeletion }];
      }
    });

    setShowDeleteModal(false);
    setDeleteTarget(null);
    localStorage.setItem("hasChanges", "true"); // Mark changes on successful delete
  };

  const hasTimeValidationErrors = (): boolean => {
    return Object.values(timeErrors).some((yearError) =>
      Object.values(yearError).some((dayError) =>
        Object.values(dayError).some((msg) => msg && msg !== "")
      )
    );
  };

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (hasTimeValidationErrors()) {
      setStatusMessage({
        type: "error",
        text: "Please fix all time validation errors before saving.",
      });
      setTimeout(clearStatusMessage, 3000);
      return;
    }

    let hasIncompleteTimeEntries = false;
    for (const yearKey in yearLevels) {
      const yearKeyTyped = yearKey as keyof YearLevels;
      for (const yearData of yearLevels[yearKeyTyped]) {
        for (const time of yearData.startEndTimes) {
          if (
            (time.startTime && !time.endTime) ||
            (!time.startTime && time.endTime) ||
            (time.startTime && !isValidTimeFormat(time.startTime)) ||
            (time.endTime && !isValidTimeFormat(time.endTime))
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
        text: "Please complete all time entries with valid start and end times (XX:00 or XX:30).",
      });
      setTimeout(clearStatusMessage, 3000);
      return;
    }

    const changesToSave = updatedYearLevels.filter((yearEntry) => {
      const key = Object.keys(yearEntry)[0];
      // Ensure there's actual data to save, not just empty structures if all were deleted
      return yearEntry[key].some(
        (dayData) =>
          dayData.startEndTimes.length > 0 ||
          (yearLevels[
            this.getYearNameFromLevel(parseInt(key)) as keyof YearLevels
          ].find((d) => d.day === dayData.day)?.startEndTimes.length ?? 0) > 0
      );
    });

    if (
      updatedYearLevels.length === 0 &&
      localStorage.getItem("hasChanges") !== "true"
    ) {
      setStatusMessage({
        type: "error",
        text: "No changes to save.",
      });
      setTimeout(clearStatusMessage, 3000);
      return;
    }
    if (localStorage.getItem("hasChanges") !== "true") {
      let noActualChanges = true;
      // A more robust check might be needed here if initial state vs current state needs comparison
      // For now, if updatedYearLevels is populated, we assume a change.
      if (updatedYearLevels.length === 0) {
        setStatusMessage({ type: "error", text: "No changes to save." });
        setTimeout(clearStatusMessage, 3000);
        return;
      }
    }

    console.log(
      "Saving updatedYearLevels:",
      JSON.stringify(updatedYearLevels, null, 2)
    );
    setStatusMessage({ type: null, text: "" }); // Clear previous messages

    try {
      let allRequestsSuccessful = true;
      let errors: string[] = [];

      const department = localStorage.getItem("department") ?? "CS";

      // Determine which year levels actually have changes to be sent
      const yearLevelsToSend = updatedYearLevels.map(
        (item) => Object.keys(item)[0]
      );

      // If updatedYearLevels is empty, but hasChanges was true (e.g. all deleted), we might need to send empty restrictions for all.
      // For now, let's assume updatedYearLevels tracks what needs to be PUT.
      // If all items for a year are deleted, its entry in updatedYearLevels should reflect that (empty startEndTimes arrays).

      const operations = updatedYearLevels.map(async (yearDataEntry) => {
        const yearLevelStr = Object.keys(yearDataEntry)[0];
        const yearLevelData = yearDataEntry[yearLevelStr];

        const transformedRestrictions: {
          [key: string]: { start: string; end: string }[];
        } = {
          M: [],
          T: [],
          W: [],
          TH: [],
          F: [],
          S: [],
        };

        yearLevelData.forEach((dayEntry) => {
          if (dayEntry.day && dayEntry.startEndTimes.length > 0) {
            const validTimes = dayEntry.startEndTimes
              .filter((t) => t.startTime && t.endTime) // Ensure both exist
              .map((set) => ({
                start: `${set.startTime.slice(0, 2)}${set.startTime.slice(3)}`,
                end: `${set.endTime.slice(0, 2)}${set.endTime.slice(3)}`,
              }));
            if (validTimes.length > 0) {
              transformedRestrictions[dayEntry.day] = [
                ...(transformedRestrictions[dayEntry.day] || []),
                ...validTimes,
              ];
            }
          }
        });

        // Remove days with no restrictions to match backend expectation if needed
        Object.keys(transformedRestrictions).forEach((dayKey) => {
          if (transformedRestrictions[dayKey].length === 0) {
            delete transformedRestrictions[dayKey];
          }
        });

        try {
          const res = await fetch(
            `/api/yltconstraints/${department}/${yearLevelStr}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify({ restrictions: transformedRestrictions }),
            }
          );

          if (!res.ok) {
            allRequestsSuccessful = false;
            const errorData = await res
              .json()
              .catch(() => ({ message: "Unknown error" }));
            errors.push(
              `Year ${yearLevelStr}: ${errorData.message || res.statusText}`
            );
          }
        } catch (fetchError) {
          allRequestsSuccessful = false;
          errors.push(
            `Year ${yearLevelStr}: Network error or unable to parse server response.`
          );
          console.error(
            `Update fetch error for Year ${yearLevelStr}:`,
            fetchError
          );
        }
      });

      await Promise.all(operations);

      if (allRequestsSuccessful) {
        setStatusMessage({
          type: "success",
          text: "Year Level Time constraints successfully saved!",
        });
        setUpdatedYearLevels([]); // Clear pending changes
        localStorage.removeItem("hasChanges");
      } else {
        setStatusMessage({
          type: "error",
          text: `Some updates failed: ${errors.join(
            "; "
          )}. Please check and try again.`,
        });
      }
    } catch (error) {
      console.error("Error saving year level time constraints:", error);
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred while saving. Please try again.",
      });
    }
    setTimeout(clearStatusMessage, 5000);
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

  const getYearNameFromLevel = (level: number): string => {
    switch (level) {
      case 1:
        return "First Year";
      case 2:
        return "Second Year";
      case 3:
        return "Third Year";
      case 4:
        return "Fourth Year";
      default:
        return "";
    }
  };

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
    return [...days].sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
  };

  useEffect(() => {
    const fetchYLTData = async () => {
      const department = localStorage.getItem("department") ?? "CS";
      const yearLevelsToFetch = [
        { name: "First Year", level: 1 },
        { name: "Second Year", level: 2 },
        { name: "Third Year", level: 3 },
        { name: "Fourth Year", level: 4 },
      ];

      const newYearLevelsState: YearLevels = {
        "First Year": [],
        "Second Year": [],
        "Third Year": [],
        "Fourth Year": [],
      };

      for (const { name, level } of yearLevelsToFetch) {
        try {
          const res = await fetch(
            `/api/yltconstraints/${department}/${level}`,
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
                if (
                  !data.restrictions[key] ||
                  data.restrictions[key].length === 0
                ) {
                  // Ensure day exists even if no restrictions, to show "Add" button
                  return { day: key, startEndTimes: [] };
                }
                const transformedStartEndTimes = data.restrictions[key].map(
                  (time: any) => ({
                    startTime: time?.start
                      ? `${time.start.slice(0, 2)}:${time.start.slice(2)}`
                      : "",
                    endTime: time?.end
                      ? `${time.end.slice(0, 2)}:${time.end.slice(2)}`
                      : "",
                  })
                );
                return { day: key, startEndTimes: transformedStartEndTimes };
              })
              .filter(Boolean) as { day: string; startEndTimes: any }[];

            // Ensure all standard days are present for UI consistency
            const standardDays = ["M", "T", "W", "TH", "F", "S"];
            standardDays.forEach((stdDay) => {
              if (!transformedYLTConstraints.find((d) => d.day === stdDay)) {
                transformedYLTConstraints.push({
                  day: stdDay,
                  startEndTimes: [],
                });
              }
            });

            newYearLevelsState[name as keyof YearLevels] = sortDays(
              transformedYLTConstraints
            );
          } else {
            console.error(`Error fetching YLT data for ${name}: ${res.status}`);
            // Set default empty structure for all days if fetch fails, so UI renders consistently
            const standardDays = ["M", "T", "W", "TH", "F", "S"];
            newYearLevelsState[name as keyof YearLevels] = sortDays(
              standardDays.map((d) => ({ day: d, startEndTimes: [] }))
            );
          }
        } catch (error) {
          console.error(`Network error fetching YLT data for ${name}:`, error);
          const standardDays = ["M", "T", "W", "TH", "F", "S"];
          newYearLevelsState[name as keyof YearLevels] = sortDays(
            standardDays.map((d) => ({ day: d, startEndTimes: [] }))
          );
        }
      }
      setYearLevels(newYearLevelsState);
      localStorage.removeItem("hasChanges"); // Clear flag on initial load
    };
    fetchYLTData();
  }, []);

  return (
    <>
      {/* Mobile/Small screen warning */}
      <div className="sm:hidden flex flex-col items-center justify-center h-screen mx-5">
        {/* ... (no changes here) ... */}
      </div>

      {/* Main */}
      <div className="min-h-screen hidden sm:flex flex-col">
        <div className="mx-auto py-10">
          <Navbar />
        </div>
        <section className="px-4 md:px-8 lg:px-16 flex flex-col md:flex-row gap-4 md:gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
          {/* ... (no changes here) ... */}
        </section>

        <form onSubmit={handleSave}>
          <section className="flex flex-col gap-5 mt-8 md:mt-11 px-4 md:px-8">
            {(Object.keys(yearLevels) as Array<keyof YearLevels>).map(
              (year) => (
                <div
                  key={year}
                  className="flex flex-col items-center gap-5 mx-auto bg-[#F1FAFF] p-4 md:p-5 rounded-xl shadow-md w-full max-w-3xl"
                >
                  <p className="text-primary font-Manrope font-extrabold">
                    {year}
                  </p>
                  <div className="w-full">
                    <div className="flex flex-col gap-4 w-full">
                      {yearLevels[year] &&
                        yearLevels[year].map((yearData, yearDataIndex) => (
                          <div
                            key={`${year}-${yearData.day}-${yearDataIndex}`}
                            className="flex items-start gap-3 font-Manrope font-semibold text-sm w-full"
                          >
                            <div className="h-[38px] flex items-center text-primary font-Manrope font-extrabold w-24 justify-end pr-2 shrink-0">
                              {getDayFullName(yearData.day)}
                            </div>
                            <div className="bg-[#BFDDF6] rounded-xl px-3 sm:px-4 md:px-6 py-4 flex flex-col gap-y-3 w-full">
                              {yearData.startEndTimes.length > 0 ? (
                                yearData.startEndTimes.map(
                                  (time, timeIndex) => (
                                    <div
                                      key={timeIndex}
                                      className="flex flex-col w-full"
                                    >
                                      <div className="flex flex-wrap md:flex-nowrap items-center gap-x-2 md:gap-x-4 gap-y-2">
                                        <label
                                          htmlFor={`${year}-${yearData.day}-start-${timeIndex}`}
                                          className="text-xs sm:text-sm"
                                        >
                                          Start
                                        </label>
                                        <input
                                          id={`${year}-${yearData.day}-start-${timeIndex}`}
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
                                          className={`h-[38px] border w-[100px] sm:w-[120px] ${
                                            timeErrors[year]?.[yearDataIndex]?.[
                                              timeIndex
                                            ]
                                              ? "border-red-500"
                                              : "border-primary"
                                          } rounded-[5px] py-1 px-2 text-xs sm:text-sm`}
                                          step="1800" // 30 minutes
                                        />
                                        <label
                                          htmlFor={`${year}-${yearData.day}-end-${timeIndex}`}
                                          className="text-xs sm:text-sm"
                                        >
                                          End
                                        </label>
                                        <input
                                          id={`${year}-${yearData.day}-end-${timeIndex}`}
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
                                          className={`h-[38px] w-[100px] sm:w-[120px] border ${
                                            timeErrors[year]?.[yearDataIndex]?.[
                                              timeIndex
                                            ]
                                              ? "border-red-500"
                                              : "border-primary"
                                          } rounded-[5px] py-1 px-2 text-xs sm:text-sm`}
                                          step="1800" // 30 minutes
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
                                            <img
                                              src={add_button}
                                              alt="Add time slot"
                                            />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteTimeRestriction(
                                                year,
                                                yearDataIndex,
                                                timeIndex
                                              )
                                            }
                                            className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 " // Added size for consistency
                                          >
                                            <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                                          </button>
                                        </div>
                                      </div>
                                      {timeErrors[year]?.[yearDataIndex]?.[
                                        timeIndex
                                      ] && (
                                        <div className="text-red-500 text-xs mt-1 ml-0 md:ml-12">
                                          {
                                            timeErrors[year][yearDataIndex][
                                              timeIndex
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="flex justify-center my-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddTimeRestriction(
                                        year,
                                        yearDataIndex,
                                        0 // timeIndex for adding when list is empty
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
                        ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </section>

          {statusMessage.type && (
            <div
              className={`fixed bottom-5 right-5 max-w-md p-4 rounded-md shadow-lg text-sm z-50 flex justify-between items-center ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              <span>{statusMessage.text}</span>
              <button
                onClick={clearStatusMessage}
                className="ml-4 text-gray-500 hover:text-gray-700"
                type="button"
                aria-label="Close message"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this time slot?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputYLT;
