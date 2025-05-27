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
// Assuming you have a trash icon for a more explicit delete button if needed
// import trash_button_red from "../../assets/trash_button_red.png"; // Example
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

// For Delete Confirmation Modal
interface DeleteActionPayload {
  type: "dayRestriction" | "timeRestriction";
  genEdIndex: number;
  restrictionIndex: number;
  timeIndex?: number; // Only for time restriction
  displayText: string; // User-friendly message for the modal
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
  currentRestrictionDayValue: string, // Renamed for clarity
  currentDayRestrictions: Restriction[]
) => {
  // Available options are those not already used, OR the current day itself
  const availableDays = dayOptions.filter(
    (opt) =>
      !currentDayRestrictions.some(
        (res) => res.day === opt.value && res.day !== currentRestrictionDayValue
      )
  );
  return availableDays; // Simplified: react-select handles displaying the current value
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

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteActionPayload | null>(
    null
  );

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

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

    if (endMinutes <= startMinutes) return "End time must be after start time";
    if (endMinutes - startMinutes < 30)
      return "Time slot must be at least 30 minutes";
    if (endMinutes - startMinutes > 300)
      return "Time slot cannot exceed 5 hours";

    const earliestAllowedTime = 7 * 60;
    const latestAllowedTime = 21 * 60;
    if (startMinutes < earliestAllowedTime)
      return "Start time cannot be earlier than 7:00 AM";
    if (endMinutes > latestAllowedTime)
      return "End time cannot be later than 9:00 PM";

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
    return Object.values(timeErrors).some((level1) =>
      Object.values(level1).some((level2) => Object.keys(level2).length > 0)
    );
  };

  const validateBeforeSave = (): boolean => {
    if (hasTimeValidationErrors()) {
      setStatusMessage({
        type: "error",
        text: "Please fix all time validation errors before saving.",
      });
      return false;
    }
    const hasInvalidTimeEntries = genEdList.some((genEd) =>
      genEd.courseRestriction.some((restriction) =>
        restriction.startEndTimes.some((time) => {
          if (time.start && time.end) {
            return (
              convertTimeToMinutes(time.end) <= convertTimeToMinutes(time.start)
            );
          }
          return false;
        })
      )
    );
    if (hasInvalidTimeEntries) {
      setStatusMessage({
        type: "error",
        text: "End time must be after start time in all time entries.",
      });
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
      setStatusMessage({
        type: "error",
        text: "Please select a day for all time restrictions that have time entries.",
      });
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
      setStatusMessage({
        type: "error",
        text: "Please fill in both start and end times for all time restrictions.",
      });
      return false;
    }
    return true;
  };

  const handleGenEdDayRestrictionChange = useCallback(
    (
      courseCode: string,
      selectedOption: Option | null,
      restrictionIndex: number // Corrected typo from restricitonIndex
    ) => {
      if (selectedOption == null) return;

      setGenEdList((prev) => {
        const genEdIndex = prev.findIndex(
          (course) => course.courseCode === courseCode
        );
        if (genEdIndex === -1) return prev;

        const course = prev[genEdIndex];
        const updatedRestrictions = course.courseRestriction.map((res, i) =>
          i === restrictionIndex ? { ...res, day: selectedOption.value } : res
        );
        const updatedCourse = {
          ...course,
          courseRestriction: updatedRestrictions,
        };
        handleUpdate({ genedConstraint: updatedCourse });
        const newGenedList = [...prev];
        newGenedList[genEdIndex] = updatedCourse;
        return newGenedList;
      });
    },
    [] // handleUpdate should be a dependency if it's not stable
  );

  const handleGenEdTimeRestrictionChange = useCallback(
    (
      genEdIndex: number,
      restrictionIndex: number,
      timeIndex: number,
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const { name, value } = e.target;

      setGenEdList((prev) => {
        const updatedCourse = { ...prev[genEdIndex] };
        const updatedRestrictions = [...updatedCourse.courseRestriction];
        const updatedStartEndTimes = [
          ...updatedRestrictions[restrictionIndex].startEndTimes,
        ];

        updatedStartEndTimes[timeIndex] = {
          ...updatedStartEndTimes[timeIndex],
          [name]: value,
        };
        updatedRestrictions[restrictionIndex] = {
          ...updatedRestrictions[restrictionIndex],
          startEndTimes: updatedStartEndTimes,
        };
        updatedCourse.courseRestriction = updatedRestrictions;

        handleUpdate({ genedConstraint: updatedCourse });
        const newGenedList = [...prev];
        newGenedList[genEdIndex] = updatedCourse;
        return newGenedList;
      });

      // Perform validation after state update (useEffect might be better for this if complex)
      // For simplicity, direct call here. Ensure genEdList used in validateTimeEntry is the latest.
      // The validation below uses the genEdList *before* the setState has fully committed.
      // This can be tricky. It's often better to validate based on the 'value' and 'name' directly.

      // Re-evaluate based on current values after potential state update
      const listAfterPotentialUpdate = [...genEdList]; // This is still the old list
      const currentCourse = listAfterPotentialUpdate[genEdIndex];
      if (!currentCourse) return;
      const currentRestriction =
        currentCourse.courseRestriction[restrictionIndex];
      if (!currentRestriction) return;
      const currentTimeEntry = {
        ...currentRestriction.startEndTimes[timeIndex],
        [name]: value,
      };

      const startTime = name === "start" ? value : currentTimeEntry.start;
      const endTime = name === "end" ? value : currentTimeEntry.end;

      if (startTime && endTime) {
        const error = validateTimeEntry(
          genEdIndex,
          restrictionIndex,
          timeIndex,
          startTime,
          endTime
        );
        setTimeErrors((prevErrors) => {
          const newErrors = JSON.parse(JSON.stringify(prevErrors)); // Deep clone
          if (!newErrors[genEdIndex]) newErrors[genEdIndex] = {};
          if (!newErrors[genEdIndex][restrictionIndex])
            newErrors[genEdIndex][restrictionIndex] = {};
          if (error) {
            newErrors[genEdIndex][restrictionIndex][timeIndex] = error;
          } else {
            delete newErrors[genEdIndex][restrictionIndex][timeIndex];
            if (
              Object.keys(newErrors[genEdIndex][restrictionIndex]).length === 0
            )
              delete newErrors[genEdIndex][restrictionIndex];
            if (Object.keys(newErrors[genEdIndex]).length === 0)
              delete newErrors[genEdIndex];
          }
          return newErrors;
        });
      }
    },
    [genEdList] // genEdList is a dependency, handleUpdate should be too if not stable
  );

  const handleAddDayRestriction = useCallback(
    (courseCode: string, e: FormEvent) => {
      e.preventDefault();
      const genEdIndex = genEdList.findIndex(
        (gened) => gened.courseCode === courseCode
      );
      if (genEdIndex === -1) return;

      const course = genEdList[genEdIndex];
      const hasExistingErrors = Object.values(
        timeErrors[genEdIndex] || {}
      ).some((level1) => Object.keys(level1).length > 0);
      const hasEmptyDays = course.courseRestriction.some(
        (r) => r.day === "" && r.startEndTimes.some((t) => t.start || t.end)
      );
      const hasIncompleteTime = course.courseRestriction.some((r) =>
        r.startEndTimes.some((t) => (t.start && !t.end) || (!t.start && t.end))
      );

      if (hasExistingErrors || hasEmptyDays || hasIncompleteTime) {
        setStatusMessage({
          type: "error",
          text: "Please fix existing validation errors or incomplete entries before adding a new day restriction.",
        });
        return;
      }
      if (course.courseRestriction.length >= dayOptions.length) {
        setStatusMessage({
          type: "error",
          text: "Cannot add more day restrictions than available days.",
        });
        return;
      }

      setGenEdList((prev) => {
        const idx = prev.findIndex((g) => g.courseCode === courseCode);
        if (idx === -1) return prev;
        const updatedGened = {
          ...prev[idx],
          courseRestriction: [
            ...prev[idx].courseRestriction,
            { day: "", startEndTimes: [{ start: "", end: "" }] },
          ],
        };
        handleUpdate({ genedConstraint: updatedGened });
        const newGenedList = [...prev];
        newGenedList[idx] = updatedGened;
        return newGenedList;
      });
    },
    [genEdList, timeErrors] // handleUpdate
  );

  const _handleDeleteDayRestrictionInternal = useCallback(
    (genEdIndex: number, restrictionIndex: number) => {
      setGenEdList((prev) => {
        const updated = [...prev];
        const courseToUpdate = { ...updated[genEdIndex] };
        courseToUpdate.courseRestriction =
          courseToUpdate.courseRestriction.filter(
            (_, i) => i !== restrictionIndex
          );
        updated[genEdIndex] = courseToUpdate;
        handleUpdate({ genedConstraint: courseToUpdate });
        return updated;
      });

      setTimeErrors((prevErrors) => {
        if (
          prevErrors[genEdIndex] &&
          prevErrors[genEdIndex][restrictionIndex]
        ) {
          const newErrors = JSON.parse(JSON.stringify(prevErrors)); // Deep clone
          delete newErrors[genEdIndex][restrictionIndex];
          if (Object.keys(newErrors[genEdIndex]).length === 0)
            delete newErrors[genEdIndex];
          return newErrors;
        }
        return prevErrors;
      });
    },
    [] // handleUpdate
  );

  const handleAddTimeRestriction = useCallback(
    (genEdIndex: number, restrictionIndex: number) => {
      const course = genEdList[genEdIndex];
      if (!course) return;
      const restriction = course.courseRestriction[restrictionIndex];
      if (!restriction) return;

      const hasExistingErrors =
        Object.keys(timeErrors[genEdIndex]?.[restrictionIndex] || {}).length >
        0;
      const hasIncompleteTime = restriction.startEndTimes.some(
        (t) => (t.start && !t.end) || (!t.start && t.end)
      );

      if (hasExistingErrors || hasIncompleteTime) {
        setStatusMessage({
          type: "error",
          text: "Please fix existing time entries or complete current ones before adding a new one.",
        });
        return;
      }
      if (!restriction.day) {
        setStatusMessage({
          type: "error",
          text: "Please select a day before adding time slots.",
        });
        return;
      }

      setGenEdList((prev) => {
        const updated = [...prev];
        const courseToUpdate = { ...updated[genEdIndex] };
        const updatedRestrictions = [...courseToUpdate.courseRestriction];
        updatedRestrictions[restrictionIndex] = {
          ...updatedRestrictions[restrictionIndex],
          startEndTimes: [
            ...updatedRestrictions[restrictionIndex].startEndTimes,
            { start: "", end: "" },
          ],
        };
        courseToUpdate.courseRestriction = updatedRestrictions;
        updated[genEdIndex] = courseToUpdate;
        handleUpdate({ genedConstraint: courseToUpdate });
        return updated;
      });
    },
    [genEdList, timeErrors] // handleUpdate
  );

  const _handleDeleteTimeRestrictionInternal = useCallback(
    (genEdIndex: number, restrictionIndex: number, timeIndex: number) => {
      setGenEdList((prev) => {
        const updated = [...prev];
        const courseToUpdate = { ...updated[genEdIndex] };
        const updatedRestrictions = [...courseToUpdate.courseRestriction];
        // Only allow deletion if there's more than one time slot, otherwise, the day restriction should be deleted.
        // This logic is usually handled by UI disabling the button.
        if (updatedRestrictions[restrictionIndex].startEndTimes.length > 1) {
          updatedRestrictions[restrictionIndex] = {
            ...updatedRestrictions[restrictionIndex],
            startEndTimes: updatedRestrictions[
              restrictionIndex
            ].startEndTimes.filter((_, i) => i !== timeIndex),
          };
          courseToUpdate.courseRestriction = updatedRestrictions;
          updated[genEdIndex] = courseToUpdate;
          handleUpdate({ genedConstraint: courseToUpdate });
        } else {
          // If it's the last one, we can't delete it directly this way. User should delete the day.
          // Or, we could clear it:
          // updatedRestrictions[restrictionIndex].startEndTimes = [{ start: "", end: "" }];
          // For now, this function assumes UI prevents deleting the last slot if it's the only one.
        }
        return updated;
      });

      setTimeErrors((prevErrors) => {
        if (prevErrors[genEdIndex]?.[restrictionIndex]?.[timeIndex]) {
          const newErrors = JSON.parse(JSON.stringify(prevErrors)); // Deep clone
          delete newErrors[genEdIndex][restrictionIndex][timeIndex];
          if (Object.keys(newErrors[genEdIndex][restrictionIndex]).length === 0)
            delete newErrors[genEdIndex][restrictionIndex];
          if (Object.keys(newErrors[genEdIndex]).length === 0)
            delete newErrors[genEdIndex];
          return newErrors;
        }
        return prevErrors;
      });
    },
    [] // handleUpdate
  );

  // Modal Deletion Logic
  const requestDeleteDayRestriction = useCallback(
    (genEdIndex: number, restrictionIndex: number) => {
      const course = genEdList[genEdIndex];
      const restriction = course?.courseRestriction[restrictionIndex];
      if (!course || !restriction) return;

      const dayLabel =
        dayOptions.find((d) => d.value === restriction.day)?.label ||
        restriction.day ||
        "this day";
      setItemToDelete({
        type: "dayRestriction",
        genEdIndex,
        restrictionIndex,
        displayText: `Are you sure you want to delete all time restrictions for ${dayLabel} for course ${course.courseCode} (${course.courseTitle})?`,
      });
      setIsDeleteModalOpen(true);
    },
    [genEdList]
  );

  const requestDeleteTimeRestriction = useCallback(
    (genEdIndex: number, restrictionIndex: number, timeIndex: number) => {
      const course = genEdList[genEdIndex];
      const restriction = course?.courseRestriction[restrictionIndex];
      const timeEntry = restriction?.startEndTimes[timeIndex];
      if (!course || !restriction || !timeEntry) return;

      // Ensure we don't request deletion for the last time entry if it's the only one.
      // The UI should prevent this, but a safeguard here is good.
      if (restriction.startEndTimes.length <= 1) {
        setStatusMessage({
          type: "error",
          text: "To remove the last time slot, please delete the entire day restriction.",
        });
        return;
      }

      const dayLabel =
        dayOptions.find((d) => d.value === restriction.day)?.label ||
        restriction.day ||
        "selected day";
      let timeText = "this time slot";
      if (timeEntry.start || timeEntry.end) {
        timeText = `the time slot ${timeEntry.start || "N/A"} - ${
          timeEntry.end || "N/A"
        }`;
      }

      setItemToDelete({
        type: "timeRestriction",
        genEdIndex,
        restrictionIndex,
        timeIndex,
        displayText: `Are you sure you want to delete ${timeText} on ${dayLabel} for course ${course.courseCode} (${course.courseTitle})?`,
      });
      setIsDeleteModalOpen(true);
    },
    [genEdList]
  );

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "dayRestriction") {
      _handleDeleteDayRestrictionInternal(
        itemToDelete.genEdIndex,
        itemToDelete.restrictionIndex
      );
    } else if (
      itemToDelete.type === "timeRestriction" &&
      itemToDelete.timeIndex !== undefined
    ) {
      _handleDeleteTimeRestrictionInternal(
        itemToDelete.genEdIndex,
        itemToDelete.restrictionIndex,
        itemToDelete.timeIndex
      );
    }

    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleUpdate = useCallback(
    ({ genedConstraint }: { genedConstraint: GenEdInfo }) => {
      setUpdatedGenedConstraints((prev) => {
        const existingIndex = prev.findIndex(
          (gen) => gen.courseCode === genedConstraint.courseCode
        );
        if (existingIndex > -1) {
          const newGened = [...prev];
          newGened[existingIndex] = {
            courseCode: genedConstraint.courseCode,
            courseRestriction: genedConstraint.courseRestriction,
          };
          return newGened;
        }
        return [
          ...prev,
          {
            courseCode: genedConstraint.courseCode,
            courseRestriction: genedConstraint.courseRestriction,
          },
        ];
      });
    },
    []
  );

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    clearStatusMessage();
    if (!validateBeforeSave()) {
      return;
    }
    localStorage.setItem("hasChanges", "true");

    try {
      let isSuccess = false;
      let apiErrors: string[] = [];

      if (updatedGenedConstraints.length === 0) {
        setStatusMessage({ type: "error", text: "No changes to save." });
        return;
      }

      for (const genedcon of updatedGenedConstraints) {
        const transformedRestrictions: {
          [key: string]: { start: string; end: string }[];
        } = {};
        dayOptions.forEach((d) => (transformedRestrictions[d.value] = [])); // Initialize all days

        genedcon.courseRestriction.forEach((res) => {
          if (!res.day) return;
          const validTimes = res.startEndTimes
            .filter(
              (set) =>
                set.start &&
                set.end &&
                convertTimeToMinutes(set.end) > convertTimeToMinutes(set.start)
            )
            .map((set) => ({
              start: `${set.start.slice(0, 2)}${set.start.slice(3)}`,
              end: `${set.end.slice(0, 2)}${set.end.slice(3)}`,
            }));
          if (validTimes.length > 0) {
            transformedRestrictions[res.day] = validTimes;
          }
        });

        try {
          const res = await fetch(
            `/api/genedconstraint/${genedcon.courseCode}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(transformedRestrictions),
            }
          );
          if (res.ok) isSuccess = true;
          else {
            const data = await res.json();
            apiErrors.push(
              `Failed to update ${genedcon.courseCode}: ${
                data.message || res.statusText || "Unknown error"
              }`
            );
          }
        } catch (fetchError: any) {
          console.error("Update fetch error:", fetchError);
          apiErrors.push(
            `Network error updating ${genedcon.courseCode}: ${fetchError.message}`
          );
        }
      }

      if (apiErrors.length > 0) {
        setStatusMessage({ type: "error", text: apiErrors.join("\n") });
      } else if (isSuccess) {
        setStatusMessage({
          type: "success",
          text: "Gen Ed constraints successfully saved!",
        });
        setUpdatedGenedConstraints([]); // Clear pending updates on success
      } else {
        // This case should ideally be caught by "No changes to save" earlier
        setStatusMessage({
          type: "error",
          text: "No changes were made or an unknown error occurred.",
        });
      }
    } catch (error: any) {
      console.error("Error saving gen ed constraints:", error);
      setStatusMessage({
        type: "error",
        text: `An error occurred while saving: ${error.message}. Please try again.`,
      });
    }
  };

  useEffect(() => {
    const getGenedCourseConstraintData = async () => {
      try {
        const res = await fetch("/api/genedconstraint", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });
        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: res.statusText }));
          throw new Error(
            `Failed to fetch GenEd constraints: ${
              errorData.message || res.status
            }`
          );
        }
        const data = await res.json();
        const transformedGenedConstraints = data.map((genedConstraint: any) => {
          const courseRestrictions: Restriction[] = [];
          if (genedConstraint.restrictions) {
            Object.keys(genedConstraint.restrictions).forEach(
              (dayKey: string) => {
                const times = genedConstraint.restrictions[dayKey];
                if (Array.isArray(times) && times.length > 0) {
                  courseRestrictions.push({
                    day: dayKey,
                    startEndTimes: times.map((time: any) => ({
                      start: time?.start
                        ? `${time.start.slice(0, 2)}:${time.start.slice(2)}`
                        : "",
                      end: time?.end
                        ? `${time.end.slice(0, 2)}:${time.end.slice(2)}`
                        : "",
                    })),
                  });
                }
              }
            );
          }
          return {
            courseTitle: genedConstraint.courseName,
            courseCode: genedConstraint.courseCode,
            courseRestriction:
              courseRestrictions.length > 0
                ? courseRestrictions
                : [{ day: "", startEndTimes: [{ start: "", end: "" }] }], // Ensure at least one empty restriction if none fetched
          };
        });
        setGenEdList(transformedGenedConstraints);
      } catch (error: any) {
        console.error("Error fetching GenEd constraints:", error);
        setStatusMessage({
          type: "error",
          text: `Failed to load GenEd constraints: ${error.message}`,
        });
        // Set a default structure if fetch fails, to prevent UI errors
        setGenEdList([
          {
            courseTitle: "Error Loading",
            courseCode: "ERROR",
            courseRestriction: [
              { day: "", startEndTimes: [{ start: "", end: "" }] },
            ],
          },
        ]);
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

        <div className="flex mx-auto gap-5 font-Manrope font-semibold mt-2 w-full max-w-5xl px-4">
          {" "}
          {/* Added max-width and padding */}
          <form onSubmit={handleSave} className="w-full">
            {genEdList.map((genEdCourse, genEdIndex) => (
              <div
                key={genEdCourse.courseCode || genEdIndex}
                className="mb-7 flex gap-3"
              >
                {" "}
                {/* Use courseCode for key if available */}
                <div className="flex flex-col p-3 rounded-xl shadow-xl w-full bg-[#F1FAFF]">
                  <div className="flex mb-2 font-Manrope font-extrabold text-primary">
                    <div className="ml-5 md:ml-20 mr-3 w-[200px]">Name</div>{" "}
                    {/* Adjusted for responsiveness */}
                    <div className="ml-0 md:ml-10 w-[120px]">Code</div>{" "}
                    {/* Adjusted for responsiveness */}
                  </div>

                  <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {" "}
                      {/* Name and Code inputs */}
                      <div>
                        <input
                          disabled
                          type="text"
                          value={genEdCourse.courseTitle}
                          placeholder="Course Title"
                          className="h-[38px] border border-primary rounded-[5px] px-2 w-full sm:w-[200px]"
                        />
                      </div>
                      <div>
                        <input
                          disabled
                          type="text"
                          value={genEdCourse.courseCode}
                          placeholder="Course Code"
                          className="h-[38px] border border-primary rounded-[5px] px-2 w-full sm:w-[120px]"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      {genEdCourse.courseRestriction.length > 0 ? (
                        <div>
                          {genEdCourse.courseRestriction.map(
                            (restriction, restrictionIndex) => (
                              <DayRestriction
                                key={`${genEdCourse.courseCode}-res-${restrictionIndex}`}
                                restriction={restriction}
                                restrictionIndex={restrictionIndex}
                                genEdCourse={genEdCourse}
                                genEdIndex={genEdIndex}
                                handleAddTimeRestriction={
                                  handleAddTimeRestriction
                                }
                                requestDeleteTimeRestriction={
                                  requestDeleteTimeRestriction
                                } // Pass request function
                                handleGenEdDayRestrictionChange={
                                  handleGenEdDayRestrictionChange
                                }
                                handleGenEdTimeRestrictionChange={
                                  handleGenEdTimeRestrictionChange
                                }
                                requestDeleteDayRestriction={
                                  requestDeleteDayRestriction
                                } // Pass request function
                                timeErrors={timeErrors}
                              />
                            )
                          )}
                          <div className="flex justify-center mb-3">
                            {genEdCourse.courseRestriction.length <
                              dayOptions.length && (
                              <button
                                type="button" // Ensure it's type button
                                onClick={(e) =>
                                  handleAddDayRestriction(
                                    genEdCourse.courseCode,
                                    e
                                  )
                                }
                                className="bg-primary text-white py-2 px-5 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                              >
                                Add Day Restriction
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#BFDDF6] p-5 rounded-md mb-5 w-full flex justify-center">
                          <button
                            type="button" // Ensure it's type button
                            onClick={(e) =>
                              handleAddDayRestriction(genEdCourse.courseCode, e)
                            }
                            className="bg-primary text-white py-2 px-5 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                          >
                            Add Day Restriction
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col items-center">
              {" "}
              {/* Centering status message and save button */}
              {statusMessage.type && (
                <div
                  className={`mx-auto mt-6 p-3 rounded-md text-center font-medium flex justify-between items-start w-full max-w-lg ${
                    // Max width for message
                    statusMessage.type === "success"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  <span className="flex-grow text-left">
                    {statusMessage.text}
                  </span>
                  <button
                    onClick={clearStatusMessage}
                    className="text-gray-600 hover:text-gray-900 ml-5 flex items-center self-start"
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
                      {" "}
                      <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
                      <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
                    </svg>
                  </button>
                </div>
              )}
              <div className="justify-center flex gap-4 font-Manrope font-semibold mt-5">
                {" "}
                {/* Adjusted margin */}
                <button
                  type="submit"
                  className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-10 mb-24 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-700 whitespace-pre-line">
              {itemToDelete.displayText}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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

const DayRestriction = React.memo(
  ({
    genEdCourse,
    restriction,
    genEdIndex,
    restrictionIndex,
    handleGenEdDayRestrictionChange,
    handleGenEdTimeRestrictionChange,
    requestDeleteTimeRestriction, // Changed from handleDeleteTimeRestriction
    handleAddTimeRestriction,
    requestDeleteDayRestriction, // Changed from handleDeleteDayRestriction
    timeErrors,
  }: {
    genEdCourse: GenEdInfo;
    restriction: Restriction;
    genEdIndex: number;
    restrictionIndex: number;
    handleGenEdDayRestrictionChange: (
      courseCode: string,
      selectedOption: Option | null,
      restrictionIndex: number
    ) => void;
    handleGenEdTimeRestrictionChange: (
      genEdIndex: number,
      restrictionIndex: number,
      timeIndex: number,
      e: ChangeEvent<HTMLInputElement>
    ) => void;
    requestDeleteTimeRestriction: (
      genEdIndex: number,
      restrictionIndex: number,
      timeIndex: number
    ) => void; // New prop
    handleAddTimeRestriction: (
      genEdIndex: number,
      restrictionIndex: number
    ) => void;
    requestDeleteDayRestriction: (
      genEdIndex: number,
      restrictionIndex: number
    ) => void; // New prop
    timeErrors: { [key: number]: { [key: number]: { [key: number]: string } } };
  }) => {
    const dayOptionsMemoized = useMemo(
      () => getDayOptions(restriction.day, genEdCourse.courseRestriction),
      [restriction.day, genEdCourse.courseRestriction]
    );
    const customStylesMemoized = useMemo(() => customStyles, []);
    const onChangeHandler = useCallback(
      (selectedOption: any) =>
        handleGenEdDayRestrictionChange(
          genEdCourse.courseCode,
          selectedOption,
          restrictionIndex
        ),
      [
        genEdCourse.courseCode,
        restrictionIndex,
        handleGenEdDayRestrictionChange,
      ]
    );
    const selectedValue = useMemo(
      () =>
        dayOptionsMemoized.find((opt) => opt.value === restriction.day) || null,
      [dayOptionsMemoized, restriction.day]
    );

    return (
      <div className="bg-[#BFDDF6] p-3 md:p-5 rounded-md mb-5">
        <div>
          <div className="text-center mb-3 font-Manrope font-extrabold text-primary">
            Day and Time Restriction
          </div>
          <div className="flex flex-col md:flex-row gap-3 justify-center items-start">
            {" "}
            {/* Adjusted for alignment */}
            <div className="flex flex-col mb-3">
              <label className="text-left mb-1 text-sm">Day</label>
              <MemoizedSelect
                selectedValue={selectedValue}
                onChangeHandler={onChangeHandler}
                customStylesMemoized={customStylesMemoized}
                dayOptionsMemoized={dayOptionsMemoized}
              />
            </div>
            <div className="flex flex-col w-full md:w-auto">
              {restriction.startEndTimes.map((time, timeIndex) => (
                <div
                  key={timeIndex}
                  className="relative mb-3 flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center"
                >
                  {" "}
                  {/* Adjusted for responsiveness and error positioning */}
                  <div className="flex flex-col">
                    <label className="text-left mb-1 text-sm">Start</label>
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
                      className={`h-[38px] border w-full sm:w-[130px] ${
                        timeErrors[genEdIndex]?.[restrictionIndex]?.[timeIndex]
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-[5px] py-1 px-2 text-sm`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-left mb-1 text-sm">End</label>
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
                      className={`h-[38px] border w-full sm:w-[130px] ${
                        timeErrors[genEdIndex]?.[restrictionIndex]?.[timeIndex]
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-[5px] py-1 px-2 text-sm`}
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-5">
                    {" "}
                    {/* Adjusted margin */}
                    {restriction.startEndTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          requestDeleteTimeRestriction(
                            genEdIndex,
                            restrictionIndex,
                            timeIndex
                          )
                        }
                        className="h-[38px] w-[28px] flex justify-center items-center text-primary hover:text-red-600" // Styling for minus button
                        title="Remove time slot"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    )}
                    {/* Render add button only for the last time entry in this restriction */}
                    {timeIndex === restriction.startEndTimes.length - 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleAddTimeRestriction(genEdIndex, restrictionIndex)
                        }
                        className="w-7 h-[38px] flex justify-center items-center"
                        title="Add new time slot for this day"
                      >
                        <img
                          src={add_button}
                          alt="Add time slot"
                          className="w-5 h-5"
                        />
                      </button>
                    )}
                  </div>
                  {timeErrors[genEdIndex]?.[restrictionIndex]?.[timeIndex] && (
                    <div className="text-red-500 text-xs mt-1 w-full sm:w-auto sm:absolute sm:mt-[68px] sm:ml-1">
                      {" "}
                      {/* Adjusted for error message positioning */}
                      {timeErrors[genEdIndex][restrictionIndex][timeIndex]}
                    </div>
                  )}
                </div>
              ))}
              {/* This was the logic for adding when no time entries existed, which is now handled by map returning nothing or add button appearing after last entry */}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={() =>
              requestDeleteDayRestriction(genEdIndex, restrictionIndex)
            }
            className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 px-4 text-xs rounded-md transition-all duration-300 active:scale-95 active:shadow-lg"
          >
            Delete Day Restriction
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
    dayOptionsMemoized: Option[]; // Type corrected
    selectedValue: Option | null; // Type corrected
    onChangeHandler: (selectedOption: Option | null) => void; // Type corrected
    customStylesMemoized: any;
  }) => {
    return (
      <Select
        options={dayOptionsMemoized}
        placeholder="Select"
        value={selectedValue}
        onChange={onChangeHandler}
        styles={customStylesMemoized}
        isClearable={false} // Or true if you want to allow clearing
      />
    );
  }
);

export default InputGenEd;
