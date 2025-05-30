import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import Navbar from "../../components/Navbar";

import add_button from "../../assets/add_button.png";
import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";
import {
  fuzzyMatch
} from "../../utils/utils";
import { v4 as uuidv4 } from "uuid";
import ScrollButton from "../../components/ScrollButton";
import { CourseInfo } from "./InputCourseOfferings";

interface TimeEntry {
  start: string;
  end: string;
  error?: string;
}

interface Request {
  day: string;
  startEndTimes: TimeEntry[];
}

interface TasInfo {
  tasId: string;
  name: string;
  units: number;
  courses: string[];
  restrictions: Request[];
  email: string;
}

interface Option {
  value: string;
  label: string;
  _index?: number;
  hasLab?: boolean;
}

// gawa ng function to get the courses from the internal representation - nasa utils
// convert ung military time to normal time - util function din
// lipat sa utils ung pag convert from db rep to normal rep

// export interface CourseInfo {
//   title: string;
//   code: string;
//   unit: string;
//   type: string;
//   category: string;
//   yearLevel: string;
// }

// const courseOptions: Option[] = [
//   { value: "CS2619", label: "Computer Organization and Architecture" },
//   { value: "CS2617", label: "Advanced Statistics and Probability" },
//   { value: "CS2615", label: "Design and Analysis of Algorithms" },
//   { value: "ICS2608", label: "Applications Development 1" },
//   { value: "ICS26010", label: "Software Engineering 1" },
//   { value: "ICS26013", label: "Software Engineering 2" },
//   { value: "CS2616", label: "Theory of Automata" },
//   { value: "CS26112", label: "Thesis 1" },
// ];

export const dayOptions: Option[] = [
  { value: "M", label: "Monday" },
  { value: "T", label: "Tuesday" },
  { value: "W", label: "Wednesday" },
  { value: "TH", label: "Thursday" },
  { value: "F", label: "Friday" },
  { value: "S", label: "Saturday" },
];

const InputTAS: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [searchResults, setSearchResults] = useState<TasInfo[]>([]);
  const [courseOptions, setCourseOptions] = useState<Option[]>([]);

  // Store an array of TAS
  const [tasList, setTasList] = useState<TasInfo[]>([
    {
      tasId: "1",
      name: "",
      email: "",
      units: 0,
      courses: [],
      restrictions: [{ day: "", startEndTimes: [{ start: "", end: "" }] }],
    },
  ]);

  // store changed tas ids
  const [updatedTAS, setUpdatedTAS] = useState<
    { tasId: string; fields: string[] }[]
  >([]);
  const [insertedTAS, setInsertedTas] = useState<string[]>([]);
  const [deletedTAS, setDeletedTAS] = useState<string[]>([]);

  const [timeErrors, setTimeErrors] = useState<{
    [key: number]: { [key: number]: { [key: number]: string } };
  }>({});

  useEffect(() => {
    console.log("updated tas ids: ", updatedTAS);
  }, [updatedTAS]);

  useEffect(() => {
    console.log("deleted tas ids: ", deletedTAS);
  }, [deletedTAS]);

  const getAvailableDayOptions = (
    tasIndex: number,
    currentReqIndex: number
  ) => {
    const selectedDays = tasList[tasIndex].restrictions
      .map((req, idx) => (idx !== currentReqIndex && req.day ? req.day : null))
      .filter(Boolean) as string[];

    return dayOptions.filter((option) => !selectedDays.includes(option.value));
  };

  const [nameErrors, setNameErrors] = useState<{ [key: number]: string }>({});

  // Function to validate time entries
  // const validateTimeEntry = (
  //   tasIndex: number,
  //   requestIndex: number,
  //   timeIndex: number,
  //   startTime: string,
  //   endTime: string
  // ): string => {
  //   if (!startTime || !endTime) return "";

  //   const startMinutes = convertTimeToMinutes(startTime);
  //   const endMinutes = convertTimeToMinutes(endTime);

  //   if (endMinutes <= startMinutes) {
  //     return "End time must be after start time";
  //   }

  //   // Check for overlapping time slots within the same day
  //   const currentRestriction = tasList[tasIndex].restrictions[requestIndex];
  //   for (let i = 0; i < currentRestriction.startEndTimes.length; i++) {
  //     if (i === timeIndex) continue;

  //     const otherStart = convertTimeToMinutes(
  //       currentRestriction.startEndTimes[i].start
  //     );
  //     const otherEnd = convertTimeToMinutes(
  //       currentRestriction.startEndTimes[i].end
  //     );

  //     if (
  //       otherStart &&
  //       otherEnd &&
  //       ((startMinutes >= otherStart && startMinutes < otherEnd) ||
  //         (endMinutes > otherStart && endMinutes <= otherEnd) ||
  //         (startMinutes <= otherStart && endMinutes >= otherEnd))
  //     ) {
  //       return "Time slots cannot overlap";
  //     }
  //   }

  //   return "";
  // };

  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // handler for text fields on the TAS level (name)
  const handleTASFieldChange = (
    tasIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // For name field it should contain at least two words
    if (name === "name") {
      const trimmedValue = value.trim();
      const isValid = trimmedValue.includes(" ");

      if (!isValid && trimmedValue !== "") {
        setNameErrors((prev) => ({
          ...prev,
          [tasIndex]: "Full name required (First & Last name)",
        }));
      } else {
        setNameErrors((prev) => {
          const updated = { ...prev };
          delete updated[tasIndex];
          return updated;
        });
      }
    }

    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = { ...updated[tasIndex], [name]: value };
      return updated;
    });

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? { ...item, fields: [...new Set([...item.fields, "name"])] }
                : item
            )
          : [...prev, { tasId: tasList[tasIndex].tasId, fields: ["name"] }];
      });
    }
  };

  // Handler for specialties change (react-select multi)
  const handleTASSpecialtiesChange = (
    tasIndex: number,
    selectedOptions: MultiValue<Option>
  ) => {
    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = {
        ...updated[tasIndex],
        courses: selectedOptions
          ? selectedOptions.map((option) => `${option.value.split("_")[0]}`)
          : [],
      };
      return updated;
    });
    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? { ...item, fields: [...new Set([...item.fields, "courses"])] }
                : item
            )
          : [...prev, { tasId: tasList[tasIndex].tasId, fields: ["courses"] }];
      });
    }
  };

  const handleUnitsFieldChange = (tasIndex: number, unitsValue: number) => {
    // value must between 0 and 30
    const validValue = Math.min(Math.max(0, unitsValue), 30);

    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = {
        ...updated[tasIndex],
        units: validValue,
      };
      return updated;
    });

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? { ...item, fields: [...new Set([...item.fields, "units"])] }
                : item
            )
          : [...prev, { tasId: tasList[tasIndex].tasId, fields: ["units"] }];
      });
    }
  };

  // Handler for changing a request's day for a specific TAS and request index
  const handleTASRequestDayChange = (
    tasIndex: number,
    requestIndex: number,
    selectedOption: Option | null
  ) => {
    setTasList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[tasIndex].restrictions];
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        day: selectedOption ? selectedOption.value : "",
      };
      updated[tasIndex] = {
        ...updated[tasIndex],
        restrictions: updatedRequests,
      };
      return updated;
    });
    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "restrictions"])],
                  }
                : item
            )
          : [
              ...prev,
              { tasId: tasList[tasIndex].tasId, fields: ["restrictions"] },
            ];
      });
    }
  };

  // Handler for changing a time field (start or end) for a specific TAS, request, and time index
  const handleTASTimeChange = (
    tasIndex: number,
    requestIndex: number,
    timeIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setTasList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[tasIndex].restrictions];
      const updatedTimes = !updatedRequests[requestIndex].startEndTimes
        ? []
        : [...updatedRequests[requestIndex].startEndTimes];

      updatedTimes[timeIndex] = { ...updatedTimes[timeIndex], [name]: value };
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        startEndTimes: updatedTimes,
      };
      updated[tasIndex] = {
        ...updated[tasIndex],
        restrictions: updatedRequests,
      };
      return updated;
    });

    const updatedTime = {
      ...tasList[tasIndex].restrictions[requestIndex].startEndTimes[timeIndex],
      [name]: value,
    };

    const startTime = name === "start" ? value : updatedTime.start;
    const endTime = name === "end" ? value : updatedTime.end;

    if (startTime && endTime) {
      let error = "";
      const startMinutes = convertTimeToMinutes(startTime);
      const endMinutes = convertTimeToMinutes(endTime);

      if (endMinutes <= startMinutes) {
        error = "End time must be after start time";
      } else if (endMinutes - startMinutes < 30) {
        //change depende sa ano dapat
        error = "Time slot must be at least 30 minutes";
      } else if (endMinutes - startMinutes > 840) {
        //change depende sa ano dapat
        error = "Time slot cannot exceed 14 hours";
      }
      if (!error) {
        for (
          let i = 0;
          i < tasList[tasIndex].restrictions[requestIndex].startEndTimes.length;
          i++
        ) {
          if (i === timeIndex) continue;

          const otherTime =
            tasList[tasIndex].restrictions[requestIndex].startEndTimes[i];
          if (!otherTime.start || !otherTime.end) continue;

          const otherStart = convertTimeToMinutes(otherTime.start);
          const otherEnd = convertTimeToMinutes(otherTime.end);

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

      // Check for valid time window (7am-9pm)
      const earliestAllowedTime = 7 * 60; // 7:00 AM (depende pa)
      const latestAllowedTime = 21 * 60; // 9:00 PM (depende pa)

      if (!error) {
        if (startMinutes < earliestAllowedTime) {
          error = "Start time cannot be earlier than 7:00 AM";
        } else if (endMinutes > latestAllowedTime) {
          error = "End time cannot be later than 9:00 PM";
        }
      }
      setTimeErrors((prev) => {
        const updatedErrors = { ...prev };

        if (!updatedErrors[tasIndex]) {
          updatedErrors[tasIndex] = {};
        }

        if (!updatedErrors[tasIndex][requestIndex]) {
          updatedErrors[tasIndex][requestIndex] = {};
        }

        if (error) {
          updatedErrors[tasIndex][requestIndex][timeIndex] = error;
        } else {
          delete updatedErrors[tasIndex][requestIndex][timeIndex];

          if (Object.keys(updatedErrors[tasIndex][requestIndex]).length === 0) {
            delete updatedErrors[tasIndex][requestIndex];
          }

          if (Object.keys(updatedErrors[tasIndex]).length === 0) {
            delete updatedErrors[tasIndex];
          }
        }

        return updatedErrors;
      });
    }

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "restrictions"])],
                  }
                : item
            )
          : [
              ...prev,
              { tasId: tasList[tasIndex].tasId, fields: ["restrictions"] },
            ];
      });
    }
  };

  // Handler to add a new day (request) to a specific TAS form
  const handleTASAddDay = (tasIndex: number, e: FormEvent) => {
    e.preventDefault();

    // Check if there are any existing restrictions with invalid data
    const hasExistingErrors =
      Object.keys(timeErrors[tasIndex] || {}).length > 0;
    const hasEmptyDays = tasList[tasIndex].restrictions.some(
      (restriction) =>
        restriction.day === "" &&
        restriction.startEndTimes.some((time) => time.start || time.end)
    );

    const hasIncompleteTime = tasList[tasIndex].restrictions.some(
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

    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = {
        ...updated[tasIndex],
        restrictions: [
          ...updated[tasIndex].restrictions,
          { day: "", startEndTimes: [{ start: "", end: "" }] },
        ],
      };
      return updated;
    });

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "restrictions"])],
                  }
                : item
            )
          : [
              ...prev,
              { tasId: tasList[tasIndex].tasId, fields: ["restrictions"] },
            ];
      });
    }
  };

  // Handler to delete a day (request) from a specific TAS form
  const handleTASDeleteDay = (tasIndex: number, requestIndex: number) => {
    setTasList((prev) => {
      const updated = [...prev];

      if (updated[tasIndex].restrictions.length === 1) {
        updated[tasIndex] = {
          ...updated[tasIndex],
          restrictions: [],
        };
      } else {
        updated[tasIndex] = {
          ...updated[tasIndex],
          restrictions: updated[tasIndex].restrictions.filter(
            (_, i) => i !== requestIndex
          ),
        };
      }
      return updated;
    });

    // Clear any errors for the deleted restriction
    setTimeErrors((prev) => {
      if (prev[tasIndex] && prev[tasIndex][requestIndex]) {
        const updatedErrors = { ...prev };
        delete updatedErrors[tasIndex][requestIndex];

        if (Object.keys(updatedErrors[tasIndex]).length === 0) {
          delete updatedErrors[tasIndex];
        }

        return updatedErrors;
      }
      return prev;
    });

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "restrictions"])],
                  }
                : item
            )
          : [
              ...prev,
              { tasId: tasList[tasIndex].tasId, fields: ["restrictions"] },
            ];
      });
    }
  };

  // Handler to add a new time entry to a specific TAS request
  const handleTASAddTime = (tasIndex: number, requestIndex: number) => {
    const hasExistingErrors =
      Object.keys(timeErrors[tasIndex]?.[requestIndex] || {}).length > 0;

    const hasIncompleteTime = tasList[tasIndex].restrictions[
      requestIndex
    ].startEndTimes.some(
      (time) => (time.start && !time.end) || (!time.start && time.end)
    );

    if (hasExistingErrors || hasIncompleteTime) {
      alert("Please fix existing time entries before adding a new one");
      return;
    }

    if (!tasList[tasIndex].restrictions[requestIndex].day) {
      alert("Please select a day before adding time slots");
      return;
    }

    setTasList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[tasIndex].restrictions];
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        startEndTimes: [
          ...updatedRequests[requestIndex].startEndTimes,
          { start: "", end: "" },
        ],
      };
      updated[tasIndex] = {
        ...updated[tasIndex],
        restrictions: updatedRequests,
      };
      return updated;
    });

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "restrictions"])],
                  }
                : item
            )
          : [
              ...prev,
              { tasId: tasList[tasIndex].tasId, fields: ["restrictions"] },
            ];
      });
    }
  };

  // Handler to delete a time entry from a specific TAS request
  const handleTASDeleteTime = (
    tasIndex: number,
    requestIndex: number,
    timeIndex: number
  ) => {
    setTasList((prev) => {
      const updated = [...prev];
      const updatedRequests = [...updated[tasIndex].restrictions];
      if (updatedRequests[requestIndex].startEndTimes.length > 1) {
        updatedRequests[requestIndex] = {
          ...updatedRequests[requestIndex],
          startEndTimes: updatedRequests[requestIndex].startEndTimes.filter(
            (_, i) => i !== timeIndex
          ),
        };
      }
      updated[tasIndex] = {
        ...updated[tasIndex],
        restrictions: updatedRequests,
      };
      return updated;
    });

    // Clear any errors for the deleted time entry
    setTimeErrors((prev) => {
      if (
        prev[tasIndex] &&
        prev[tasIndex][requestIndex] &&
        prev[tasIndex][requestIndex][timeIndex]
      ) {
        const updatedErrors = { ...prev };
        delete updatedErrors[tasIndex][requestIndex][timeIndex];

        if (Object.keys(updatedErrors[tasIndex][requestIndex]).length === 0) {
          delete updatedErrors[tasIndex][requestIndex];
        }

        if (Object.keys(updatedErrors[tasIndex]).length === 0) {
          delete updatedErrors[tasIndex];
        }

        return updatedErrors;
      }
      return prev;
    });

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "restrictions"])],
                  }
                : item
            )
          : [
              ...prev,
              { tasId: tasList[tasIndex].tasId, fields: ["restrictions"] },
            ];
      });
    }
  };

  // Handler to add a new TAS form - ADD SA INSERT TRACKER
  const handleAddTAS = (e: FormEvent) => {
    e.preventDefault();
    let tempId = uuidv4();
    setTasList((prev) => [
      ...prev,
      {
        tasId: tempId, // temporary id
        name: "",
        email: "",
        units: 0,
        courses: [],
        restrictions: [],
      },
    ]);
    setInsertedTas((prev) => [...prev, tempId]);
  };

  // Handler to delete an entire TAS form - ADD SA DELETE TRACKER
  const handleDeleteTAS = (tasIndex: number) => {
    setTasList((prev) => prev.filter((_, i) => i !== tasIndex));
    setDeletedTAS((prev) => [...prev, tasList[tasIndex].tasId]);

    // Clear any errors for the deleted TAS
    setTimeErrors((prev) => {
      if (prev[tasIndex]) {
        const updatedErrors = { ...prev };
        delete updatedErrors[tasIndex];
        return updatedErrors;
      }
      return prev;
    });
  };

  // Handler to add the first day/time restriction when none exist
  const handleAddFirstRestriction = (tasIndex: number, e: FormEvent) => {
    e.preventDefault();

    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = {
        ...updated[tasIndex],
        restrictions: [{ day: "", startEndTimes: [{ start: "", end: "" }] }],
      };
      return updated;
    });

    setTimeErrors((prev) => {
      if (prev[tasIndex]) {
        const updatedErrors = { ...prev };
        delete updatedErrors[tasIndex];
        return updatedErrors;
      }
      return prev;
    });

    if (tasList[tasIndex].tasId.startsWith("PF")) {
      setUpdatedTAS((prev) => {
        return prev.some((item) => item.tasId === tasList[tasIndex].tasId)
          ? prev.map((item) =>
              item.tasId === tasList[tasIndex].tasId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "restrictions"])],
                  }
                : item
            )
          : [
              ...prev,
              { tasId: tasList[tasIndex].tasId, fields: ["restrictions"] },
            ];
      });
    }
  };

  // Function to check if there are any time validation errors
  const hasTimeValidationErrors = (): boolean => {
    return Object.keys(timeErrors).length > 0;
  };

  // LOOP THRU HTE TRACKERS AND QUERY NECESSARY ENDPOINT
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true");

    // Clear any previous status messages
    setStatusMessage({ type: null, text: "" });

    // Check if any TAS has an invalid name (empty or single word)
    const hasInvalidName = tasList.some((tas) => {
      const trimmedName = tas.name.trim();
      return trimmedName === "" || !trimmedName.includes(" ");
    });

    if (hasInvalidName) {
      setStatusMessage({
        type: "error",
        text: "All TAS entries must have a full name (first and last name)",
      });
      return;
    }

    // Check if there are any time validation errors
    if (hasTimeValidationErrors()) {
      setStatusMessage({
        type: "error",
        text: "Please fix all time validation errors before saving",
      });
      return;
    }

    // Manual validation check for invalid time entries
    const hasInvalidTimeEntries = tasList.some((tas) =>
      tas.restrictions.some((restriction) =>
        restriction.startEndTimes.some((time) => {
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
      setStatusMessage({
        type: "error",
        text: "End time must be after start time in all time entries",
      });
      return;
    }

    const hasEmptyDays = tasList.some((tas) =>
      tas.restrictions.some(
        (restriction) =>
          restriction.day === "" &&
          restriction.startEndTimes.some((time) => time.start || time.end)
      )
    );

    if (hasEmptyDays) {
      setStatusMessage({
        type: "error",
        text: "Please select a day for all time restrictions",
      });
      return;
    }

    const hasEmptyTimes = tasList.some((tas) =>
      tas.restrictions.some((restriction) =>
        restriction.startEndTimes.some(
          (time) => (time.start && !time.end) || (!time.start && time.end)
        )
      )
    );

    if (hasEmptyTimes) {
      setStatusMessage({
        type: "error",
        text: "Please fill in both start and end times for all time restrictions",
      });
      return;
    }

    // UPDATES
    // check if may nagbago b talaga
    console.log("UPDATING");
    try {
      for (let i = 0; i < updatedTAS.length; i++) {
        let upd = updatedTAS[i];
        let tas: any = tasList.find((item) => item.tasId === upd.tasId);

        let reqObj: any = { tasId: tas?.tasId };
        for (let j = 0; j < upd.fields.length; j++) {
          let field: any = upd.fields[j];

          if (field === "restrictions") {
            let restrictionsObj: any = {
              M: [],
              T: [],
              W: [],
              TH: [],
              F: [],
              S: [],
            };

            tas?.["restrictions"].forEach((res: any) => {
              console.log(res);
              res.startEndTimes.forEach((set: any) => {
                restrictionsObj[res.day].push({
                  start: `${set.start.slice(0, 2)}${set.start.slice(3)}`,
                  end: `${set.end.slice(0, 2)}${set.end.slice(3)}`,
                });
              });
            });

            reqObj["restrictions"] = restrictionsObj;
          } else {
            reqObj[field] = tas?.[field];
          }
        }

        const res = await fetch("/api/tasconstraints", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqObj),
        });

        if (!res.ok) {
          console.log("Error updating", res.body);
          setStatusMessage({
            type: "error",
            text: "Failed to update TAS constraints. Please try again.",
          });
          return;
        }
      }

      // INSERTS
      console.log("INSERTING");
      for (let i = 0; i < insertedTAS.length; i++) {
        let tempId = insertedTAS[i];
        let tas: TasInfo | undefined = tasList.find(
          (item) => item.tasId === tempId
        );
        if (!tas) {
          continue;
        }
        const { tasId, ...rest } = tas;

        let restrictionsObj: any = {
          M: [],
          T: [],
          W: [],
          TH: [],
          F: [],
          S: [],
        };

        tas?.["restrictions"].forEach((res: any) => {
          if (res.day === "") {
            return;
          }
          res.startEndTimes.forEach((set: any) => {
            restrictionsObj[res.day].push({
              start: `${set.start.slice(0, 2)}${set.start.slice(3)}`,
              end: `${set.end.slice(0, 2)}${set.end.slice(3)}`,
            });
          });
        });

        const reqObj = {
          ...rest,
          restrictions: restrictionsObj,
          mainDepartment: "CS", // HARD CODED FOR NOW
          // email: "sample@email.com", // WALA PANG EMAIL FORM DON SA ANO
        };

        const res = await fetch("/api/tasconstraints", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqObj),
        });

        if (!res.ok) {
          const data = await res.json();
          console.log("Error inserting", data);
          setStatusMessage({
            type: "error",
            text: "Failed to add new TAS. Please try again.",
          });
          return;
        }
      }

      // DELETING
      console.log("DELETING");
      for (let i = 0; i < deletedTAS.length; i++) {
        const res = await fetch("/api/tasconstraints", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tasId: deletedTAS[i] }),
        });

        if (!res.ok) {
          const data = await res.json();
          console.log("Error deleting", data);
          setStatusMessage({
            type: "error",
            text: "Failed to delete TAS. Please try again.",
          });
          return;
        }
      }

      // If all operations were successful
      setStatusMessage({
        type: "success",
        text: "TAS constraints successfully saved!",
      });
    } catch (error) {
      console.error("Error saving TAS constraints:", error);
      setStatusMessage({
        type: "error",
        text: "An error occurred while saving. Please check your connection and try again.",
      });
    }
  };

  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #02296D",
      borderRadius: "6px",
      width: "140px",
      height: "38px",
      padding: "0 2px",
    }),
  };

  //for multi select dropdown
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #02296D",
      borderRadius: "6px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      maxHeight: "135px",
      overflowY: "auto",
    }),
  };

  console.log("tas list", tasList);

  // get tapos display
  // dapat may sample sa taas

  // ung save ung pag save sa database

  // CONNECTIONS TO THE DATABASE
  useEffect(() => {
    const getTASConstraints = async () => {
      console.log("getting tas constraints");
      const department = localStorage.getItem("department") ?? "CS";
      const res = await fetch(
        `/api/tasconstraints/${department}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      ); // EDIT THIS TO BE DYNAMIC PERO CS MUNA FOR NOW
      const data = await res.json();

      for (let i = 0; i < data.length; i++) {
        let newTas = data[i];

        // courses
        // newTas.courses = getCourseCodesFromInternalRepresentation(
        //   newTas.courses
        // );

        // restrictions
        let newTasRestrictions = newTas.restrictions;
        let newTasRestricionKeys: any = Object.keys(newTasRestrictions);

        let convertedTasRestrictions = [];

        for (let j = 0; j < newTasRestricionKeys.length; j++) {
          let restrictionsForDay = newTasRestrictions[newTasRestricionKeys[j]];

          for (let k = 0; k < restrictionsForDay.length; k++) {
            let specRestriction = restrictionsForDay[k];

            convertedTasRestrictions.push({
              day: newTasRestricionKeys[j],
              // loop dapat toh pero fuck
              startEndTimes: [
                {
                  start: `${specRestriction.start.slice(
                    0,
                    2
                  )}:${specRestriction.start.slice(2)}`,
                  end: `${specRestriction.end.slice(
                    0,
                    2
                  )}:${specRestriction.end.slice(2)}`,
                },
              ],
            });
          }
        }
        newTas.restrictions = convertedTasRestrictions;
      }

      console.log("converted", data);

      setTasList(data);
      // console.log('converted', tasList)
    };

    getTASConstraints();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      let allCourses: CourseInfo[] = [];
      const department = localStorage.getItem("department") ?? "CS";
      for (let i = 1; i < 5; i++) {
        const res = await fetch(
          `/api/courseofferings/${i}/2/${department}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        ); // sem and department must be dynamic
        const data = await res.json();

        if (res.ok) {
          if (i === 1) {
            let transformedFirstYearCourses: CourseInfo[] = [];
            transformedFirstYearCourses = data.map((course: any) => {
              return {
                title: course.courseName,
                code: course.courseCode,
                unit: course.totalUnits,
                type: course.courseType,
                category: course.courseCategory,
                yearLevel: 1,
              };
            });

            allCourses.push(...transformedFirstYearCourses);
          } else if (i === 2) {
            let transformedSecondYearCourses: CourseInfo[] = [];
            transformedSecondYearCourses = data.map((course: any) => {
              return {
                title: course.courseName,
                code: course.courseCode,
                unit: course.totalUnits,
                type: course.courseType,
                category: course.courseCategory,
                yearLevel: 2,
              };
            });

            allCourses.push(...transformedSecondYearCourses);
          } else if (i === 3) {
            let transformedThirdYearCourses: CourseInfo[] = [];
            transformedThirdYearCourses = data.map((course: any) => {
              return {
                title: course.courseName,
                code: course.courseCode,
                unit: course.totalUnits,
                type: course.courseType,
                category: course.courseCategory,
                yearLevel: 3,
              };
            });

            allCourses.push(...transformedThirdYearCourses);
          } else if (i === 4) {
            let transformedFourthYearCourses: CourseInfo[] = [];
            transformedFourthYearCourses = data.map((course: any) => {
              return {
                title: course.courseName,
                code: course.courseCode,
                unit: course.totalUnits,
                type: course.courseType,
                category: course.courseCategory,
                yearLevel: 4,
              };
            });

            allCourses.push(...transformedFourthYearCourses);
          } else {
            console.log("error yan");
          }
        } else {
          console.log("may error ate ko");
        }
      }

      let allCourseOptions = allCourses
        .filter((course) => course.category !== "gened")
        .map((course, index) => {
          return {
            value: `${course.code}_${index}`,
            label: `${course.title} (${
              course.type.charAt(0).toUpperCase() +
              course.type.slice(1).toLowerCase()
            })`,
          };
        });

      setCourseOptions(allCourseOptions);
    };
    fetchCourses();
  }, []);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const handleSearch = () => {
    if (searchValue.length === 0) {
      setSearchResults([]);
      return;
    }

    let fuzzyMatches = [];
    fuzzyMatches.push(
      ...tasList.filter(
        (tas) =>
          fuzzyMatch(searchValue, tas.name) ||
          fuzzyMatch(searchValue, tas.email)
      )
    );

    setSearchResults(fuzzyMatches);
  };

  // useEffect(() => {
  //   console.log(searchResults);
  // }, [searchResults]);

  const handleFilter = () => {
    if (courseFilter === "") {
      setSearchResults([]);
      return;
    }

    console.log("filtering");
    console.log(courseFilter.split("_")[0]);

    let matches = [];
    matches.push(
      ...tasList.filter((tas) =>
        tas.courses.includes(courseFilter.split("_")[0])
      )
    );

    console.log("matches", matches);

    if (searchValue.length > 0) {
      let fuzzyMatches = matches.filter(
        (tas) =>
          fuzzyMatch(searchValue, tas.name) ||
          fuzzyMatch(searchValue, tas.email)
      );

      setSearchResults(fuzzyMatches);
      return;
    }
    setSearchResults(matches);
  };

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
      <div className="hidden min-h-screen sm:flex flex-col">
        <div className="mx-auto py-10">
          <ScrollButton />
          <Navbar />
        </div>
        <section className="px-4 lg:px-16 flex flex-col lg:flex-row gap-4 lg:gap-11 font-Helvetica-Neue-Heavy items-center justify-center text-center lg:text-left">
          <div className="text-primary mt-5 text-[28px] lg:text-[35px]">
            Teaching Academic Staff
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <div className="w-full flex justify-center my-4">
          <div className="flex w-[60%] justify-between bg-primary/15 px-4 py-3 rounded-xl items-center">
            <div className="flex gap-x-2">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                className="rounded-md text-sm py-1 px-4 w-[18rem]"
                placeholder="Search by Name or Email"
              />
              <button
                className="text-sm bg-primary rounded-md text-white px-4 font-semibold"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            <div className="flex gap-x-2 items-center">
              <h1 className="text-sm">Filter By Course</h1>
              <select
                name="courseFilter"
                id="courseFilter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="rounded-md px-2 text-sm py-1 w-[10rem]"
              >
                <option value="">No Filter</option>
                {courseOptions.map((opt, index) => {
                  return (
                    <option key={index} value={opt.value}>
                      {opt.label}
                    </option>
                  );
                })}
                {/* <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option> */}
              </select>
              <button
                className="text-sm bg-primary rounded-md text-white px-4 font-semibold py-1"
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        {(searchResults.length > 0 || courseFilter.length > 0) && (
          <div className="flex mx-auto gap-5 font-Manrope font-semibold mt-5">
            {/* <div className="flex flex-col"> */}
            <form onSubmit={handleSave}>
              {searchResults.map((tas, tasIndex) => (
                <div key={tasIndex} className="mb-7 flex gap-3">
                  <div className="gap-5 bg-[#F1FAFF] px-5 py-5 rounded-xl shadow-sm border w-full">
                    <div className="flex text-primary font-bold mb-2">
                      <div className="ml-20">Name</div>
                      <div className="ml-24">Units</div>
                      <div className="ml-16">Specialization</div>
                      <div className="ml-32">Email</div>
                    </div>
                    <div className="flex flex-col gap-5 lg:flex-row lg:gap-3">
                      {/* TAS name, units and specialization */}
                      <div className="flex gap-3">
                        {/* TAS name */}
                        <div>
                          <input
                            type="text"
                            name="name"
                            value={tas.name}
                            onChange={(e) => handleTASFieldChange(tasIndex, e)}
                            placeholder="Enter full name"
                            className={`py-1 border text-sm ${
                              nameErrors[tasIndex]
                                ? "border-red-500"
                                : "border-primary"
                            } rounded-[5px] px-2 w-[200px]`}
                          />
                          {nameErrors[tasIndex] && (
                            <div className="text-red-500 text-xs mt-1">
                              {nameErrors[tasIndex]}
                            </div>
                          )}
                        </div>

                        {/* TAS units */}
                        <div>
                          <input
                            type="number"
                            name="units"
                            value={tas.units}
                            onChange={(e) =>
                              handleUnitsFieldChange(
                                tasIndex,
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="Units"
                            className="py-1 text-sm border border-primary rounded-[5px] px-2 w-[60px]"
                          />
                        </div>

                        {/* TAS specialization*/}
                        <div>
                          <Select
                            options={courseOptions}
                            placeholder="Select"
                            isMulti
                            isClearable={false}
                            closeMenuOnSelect={false}
                            className="w-[200px] text-sm py-1"
                            value={courseOptions.filter((opt) =>
                              tas.courses.includes(opt.value.split("_")[0])
                            )}
                            onChange={(selectedOptions) =>
                              handleTASSpecialtiesChange(
                                tasIndex,
                                selectedOptions
                              )
                            }
                            styles={customStyles}
                          />
                        </div>

                        {/* email */}
                        <div>
                          <input
                            type="text"
                            name="email"
                            value={tas.email}
                            onChange={(e) => handleTASFieldChange(tasIndex, e)}
                            placeholder="Enter full name"
                            className={`py-1 border ${
                              nameErrors[tasIndex]
                                ? "border-red-500"
                                : "border-primary"
                            } rounded-[5px] px-2 w-[200px] text-sm`}
                          />
                          {nameErrors[tasIndex] && (
                            <div className="text-red-500 text-xs mt-1">
                              {nameErrors[tasIndex]}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Day and Time Restriction */}
                      <div className="w-full">
                        {tas.restrictions.length > 0 ? (
                          tas.restrictions.map((request, reqIndex) => (
                            <div
                              key={reqIndex}
                              className="bg-[#BFDDF6] p-3 rounded-md mb-5"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-3">
                                  <div className="flex flex-col">
                                    <label className="mb-1 text-sm font-medium">
                                      Day
                                    </label>
                                    <Select
                                      className="text-sm"
                                      options={getAvailableDayOptions(
                                        tasIndex,
                                        reqIndex
                                      )}
                                      placeholder="Select"
                                      value={
                                        dayOptions.find(
                                          (opt) => opt.value === request.day
                                        ) || null
                                      }
                                      onChange={(selectedOption) =>
                                        handleTASRequestDayChange(
                                          tasIndex,
                                          reqIndex,
                                          selectedOption
                                        )
                                      }
                                      styles={selectStyles}
                                    />
                                  </div>

                                  <div className="flex flex-col">
                                    {request.startEndTimes?.length > 0 ? (
                                      request.startEndTimes.map(
                                        (time, timeIndex) => (
                                          <div
                                            key={timeIndex}
                                            className="mb-3 flex gap-3"
                                          >
                                            <div className="flex flex-col">
                                              <label className="mb-1 text-sm font-medium">
                                                Start
                                              </label>
                                              <input
                                                type="time"
                                                name="start"
                                                value={time.start}
                                                onChange={(e) =>
                                                  handleTASTimeChange(
                                                    tasIndex,
                                                    reqIndex,
                                                    timeIndex,
                                                    e
                                                  )
                                                }
                                                className={`text-sm border w-[130px] ${
                                                  timeErrors[tasIndex]?.[
                                                    reqIndex
                                                  ]?.[timeIndex]
                                                    ? "border-red-500"
                                                    : "border-primary"
                                                } rounded-[5px] py-1 px-2`}
                                              />
                                            </div>

                                            <div className="flex flex-col">
                                              <label className="mb-1 text-sm font-medium">
                                                End
                                              </label>
                                              <input
                                                type="time"
                                                name="end"
                                                value={time.end}
                                                onChange={(e) =>
                                                  handleTASTimeChange(
                                                    tasIndex,
                                                    reqIndex,
                                                    timeIndex,
                                                    e
                                                  )
                                                }
                                                className={`border w-[130px] ${
                                                  timeErrors[tasIndex]?.[
                                                    reqIndex
                                                  ]?.[timeIndex]
                                                    ? "border-red-500"
                                                    : "border-primary"
                                                } rounded-[5px] text-sm py-1 px-2`}
                                              />
                                            </div>

                                            <div className="flex items-end gap-2 mb-1">
                                              {request.startEndTimes.length >
                                                1 && (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleTASDeleteTime(
                                                      tasIndex,
                                                      reqIndex,
                                                      timeIndex
                                                    )
                                                  }
                                                  className="h-[38px] flex items-center justify-center"
                                                >
                                                  <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                                                </button>
                                              )}

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleTASAddTime(
                                                    tasIndex,
                                                    reqIndex
                                                  )
                                                }
                                                className="w-7 h-[38px] flex items-center justify-center transition-all duration-300 active:scale-95 active:shadow-lg"
                                              >
                                                <img
                                                  src={add_button}
                                                  alt="Add"
                                                />
                                              </button>
                                            </div>

                                            {timeErrors[tasIndex]?.[reqIndex]?.[
                                              timeIndex
                                            ] && (
                                              <div className="text-red-500 text-xs absolute mt-[70px] ml-1">
                                                {
                                                  timeErrors[tasIndex][
                                                    reqIndex
                                                  ][timeIndex]
                                                }
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <div className="mb-3 flex gap-5">
                                        <div className="flex flex-col">
                                          <label className="mb-1 text-sm font-medium">
                                            Start
                                          </label>
                                          <input
                                            type="time"
                                            name="start"
                                            onChange={(e) =>
                                              handleTASTimeChange(
                                                tasIndex,
                                                reqIndex,
                                                0,
                                                e
                                              )
                                            }
                                            className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                          />
                                        </div>

                                        <div className="flex flex-col">
                                          <label className="mb-1 text-sm font-medium">
                                            End
                                          </label>
                                          <input
                                            type="time"
                                            name="end"
                                            onChange={(e) =>
                                              handleTASTimeChange(
                                                tasIndex,
                                                reqIndex,
                                                0,
                                                e
                                              )
                                            }
                                            className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                          />
                                        </div>

                                        <div className="flex items-end mb-1">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleTASAddTime(
                                                tasIndex,
                                                reqIndex
                                              )
                                            }
                                            className="w-7 h-[38px] flex items-center justify-center transition-all duration-300 active:scale-95 active:shadow-lg"
                                          >
                                            <img src={add_button} alt="Add" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-center gap-3 mt-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleTASDeleteDay(tasIndex, reqIndex)
                                    }
                                    className="border border-primary text-primary py-1 px-4 text-xs rounded-md transition-all duration-300 active:scale-95  active:shadow-lg"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="w-[30.5rem] flex justify-center items-center my-4">
                            <button
                              onClick={(e) =>
                                handleAddFirstRestriction(tasIndex, e)
                              }
                              className="bg-primary text-white py-2 px-6 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                            >
                              Add Day and Time Restriction
                            </button>
                          </div>
                        )}
                        {tas.restrictions.length > 0 &&
                          tas.restrictions.length < 6 && (
                            <div className="w-full flex justify-center pb-4 items-center">
                              <div className="w-full flex justify-center items-center my-4">
                                <button
                                  onClick={(e) => handleTASAddDay(tasIndex, e)}
                                  className="bg-primary text-white py-2 px-6 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                                >
                                  Add Day and Time Restriction
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTAS(tasIndex)}>
                    <img
                      src={trash_button}
                      alt="Delete"
                      className="w-7 transition-all duration-300 active:scale-95 active:shadow-lg"
                    />
                  </button>
                </div>
              ))}
            </form>
            {/* </div> */}
          </div>
        )}

        {/* specialization ndi nag sselect ??? */}
        {searchResults.length === 0 && courseFilter.length === 0 && (
          <div className="flex mx-auto gap-5 font-Manrope font-semibold mt-5">
            <form onSubmit={handleSave}>
              {tasList.map((tas, tasIndex) => {
                // if (tas.email === 'acgernale@ust.edu.ph'){
                //   console.log(tas)
                //   console.log(courseOptions)
                // }
                return (
                  <div key={tasIndex} className="mb-7 flex gap-3">
                    {/* <div className="gap-5 bg-[#F1FAFF] px-5 py-5 rounded-xl shadow-sm border w-full"> */}
                    <div className="gap-5 bg-[#F1FAFF]/60 px-5 py-5 rounded-xl shadow-sm border w-full">
                      <div className="flex text-primary font-bold mb-2">
                        <div className="ml-20">Name</div>
                        <div className="ml-24">Units</div>
                        <div className="ml-16">Specialization</div>
                        <div className="ml-32">Email</div>
                      </div>
                      <div className="flex flex-col gap-5 lg:flex-row lg:gap-3">
                        {/* TAS name, units and specialization */}
                        <div className="flex gap-3">
                          {/* TAS name */}
                          <div>
                            <input
                              type="text"
                              name="name"
                              value={tas.name}
                              onChange={(e) =>
                                handleTASFieldChange(tasIndex, e)
                              }
                              placeholder="Enter full name"
                              className={`py-1 border text-sm ${
                                nameErrors[tasIndex]
                                  ? "border-red-500"
                                  : "border-primary"
                              } rounded-[5px] px-2 w-[200px]`}
                            />
                            {nameErrors[tasIndex] && (
                              <div className="text-red-500 text-xs mt-1">
                                {nameErrors[tasIndex]}
                              </div>
                            )}
                          </div>

                          {/* TAS units */}
                          <div>
                            <input
                              type="number"
                              name="units"
                              value={tas.units}
                              onChange={(e) =>
                                handleUnitsFieldChange(
                                  tasIndex,
                                  parseInt(e.target.value)
                                )
                              }
                              placeholder="Units"
                              className="py-1 text-sm border border-primary rounded-[5px] px-2 w-[60px]"
                            />
                          </div>

                          {/* TAS specialization*/}
                          <div>
                            <Select
                              options={courseOptions}
                              placeholder="Select"
                              isMulti
                              isClearable={false}
                              closeMenuOnSelect={false}
                              className="w-[200px] text-sm py-1"
                              value={courseOptions.filter((opt) =>
                                tas.courses.includes(opt.value.split("_")[0])
                              )}
                              onChange={(selectedOptions) =>
                                handleTASSpecialtiesChange(
                                  tasIndex,
                                  selectedOptions
                                )
                              }
                              styles={customStyles}
                            />
                          </div>

                          {/* email */}
                          <div>
                            <input
                              type="text"
                              name="email"
                              value={tas.email}
                              onChange={(e) =>
                                handleTASFieldChange(tasIndex, e)
                              }
                              placeholder="Enter full name"
                              className={`py-1 border ${
                                nameErrors[tasIndex]
                                  ? "border-red-500"
                                  : "border-primary"
                              } rounded-[5px] px-2 w-[200px] text-sm`}
                            />
                            {nameErrors[tasIndex] && (
                              <div className="text-red-500 text-xs mt-1">
                                {nameErrors[tasIndex]}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Day and Time Restriction */}
                        <div className="w-full">
                          {tas.restrictions.length > 0 ? (
                            tas.restrictions.map((request, reqIndex) => (
                              <div
                                key={reqIndex}
                                // className="bg-[#BFDDF6] p-3 rounded-md mb-5"
                                className="bg-primary/15 p-3 rounded-md mb-5"
                              >
                                <div className="flex flex-col gap-2">
                                  <div className="flex gap-3">
                                    <div className="flex flex-col">
                                      <label className="mb-1 text-sm font-medium">
                                        Day
                                      </label>
                                      <Select
                                        className="text-sm"
                                        options={getAvailableDayOptions(
                                          tasIndex,
                                          reqIndex
                                        )}
                                        placeholder="Select"
                                        value={
                                          dayOptions.find(
                                            (opt) => opt.value === request.day
                                          ) || null
                                        }
                                        onChange={(selectedOption) =>
                                          handleTASRequestDayChange(
                                            tasIndex,
                                            reqIndex,
                                            selectedOption
                                          )
                                        }
                                        styles={selectStyles}
                                      />
                                    </div>

                                    <div className="flex flex-col">
                                      {request.startEndTimes?.length > 0 ? (
                                        request.startEndTimes.map(
                                          (time, timeIndex) => (
                                            <div
                                              key={timeIndex}
                                              className="mb-3 flex gap-3"
                                            >
                                              <div className="flex flex-col">
                                                <label className="mb-1 text-sm font-medium">
                                                  Start
                                                </label>
                                                <input
                                                  type="time"
                                                  name="start"
                                                  value={time.start}
                                                  onChange={(e) =>
                                                    handleTASTimeChange(
                                                      tasIndex,
                                                      reqIndex,
                                                      timeIndex,
                                                      e
                                                    )
                                                  }
                                                  className={`text-sm border w-[130px] ${
                                                    timeErrors[tasIndex]?.[
                                                      reqIndex
                                                    ]?.[timeIndex]
                                                      ? "border-red-500"
                                                      : "border-primary"
                                                  } rounded-[5px] py-1 px-2`}
                                                />
                                              </div>

                                              <div className="flex flex-col">
                                                <label className="mb-1 text-sm font-medium">
                                                  End
                                                </label>
                                                <input
                                                  type="time"
                                                  name="end"
                                                  value={time.end}
                                                  onChange={(e) =>
                                                    handleTASTimeChange(
                                                      tasIndex,
                                                      reqIndex,
                                                      timeIndex,
                                                      e
                                                    )
                                                  }
                                                  className={`border w-[130px] ${
                                                    timeErrors[tasIndex]?.[
                                                      reqIndex
                                                    ]?.[timeIndex]
                                                      ? "border-red-500"
                                                      : "border-primary"
                                                  } rounded-[5px] text-sm py-1 px-2`}
                                                />
                                              </div>

                                              <div className="flex items-end gap-2 mb-1">
                                                {request.startEndTimes.length >
                                                  1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleTASDeleteTime(
                                                        tasIndex,
                                                        reqIndex,
                                                        timeIndex
                                                      )
                                                    }
                                                    className="h-[38px] flex items-center justify-center"
                                                  >
                                                    <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                                                  </button>
                                                )}

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleTASAddTime(
                                                      tasIndex,
                                                      reqIndex
                                                    )
                                                  }
                                                  className="w-7 h-[38px] flex items-center justify-center transition-all duration-300 active:scale-95 active:shadow-lg"
                                                >
                                                  <img
                                                    src={add_button}
                                                    alt="Add"
                                                  />
                                                </button>
                                              </div>

                                              {timeErrors[tasIndex]?.[
                                                reqIndex
                                              ]?.[timeIndex] && (
                                                <div className="text-red-500 text-xs absolute mt-[70px] ml-1">
                                                  {
                                                    timeErrors[tasIndex][
                                                      reqIndex
                                                    ][timeIndex]
                                                  }
                                                </div>
                                              )}
                                            </div>
                                          )
                                        )
                                      ) : (
                                        <div className="mb-3 flex gap-5">
                                          <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-medium">
                                              Start
                                            </label>
                                            <input
                                              type="time"
                                              name="start"
                                              onChange={(e) =>
                                                handleTASTimeChange(
                                                  tasIndex,
                                                  reqIndex,
                                                  0,
                                                  e
                                                )
                                              }
                                              className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                            />
                                          </div>

                                          <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-medium">
                                              End
                                            </label>
                                            <input
                                              type="time"
                                              name="end"
                                              onChange={(e) =>
                                                handleTASTimeChange(
                                                  tasIndex,
                                                  reqIndex,
                                                  0,
                                                  e
                                                )
                                              }
                                              className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                            />
                                          </div>

                                          <div className="flex items-end mb-1">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleTASAddTime(
                                                  tasIndex,
                                                  reqIndex
                                                )
                                              }
                                              className="w-7 h-[38px] flex items-center justify-center transition-all duration-300 active:scale-95 active:shadow-lg"
                                            >
                                              <img src={add_button} alt="Add" />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex justify-center gap-3 mt-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleTASDeleteDay(tasIndex, reqIndex)
                                      }
                                      className="border border-primary text-primary py-1 px-4 text-xs rounded-md transition-all duration-300 active:scale-95  active:shadow-lg"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="w-full flex justify-center items-center my-4">
                              <button
                                onClick={(e) =>
                                  handleAddFirstRestriction(tasIndex, e)
                                }
                                className="bg-primary text-white py-2 px-6 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                              >
                                Add Day and Time Restriction
                              </button>
                            </div>
                          )}
                          {tas.restrictions.length > 0 &&
                            tas.restrictions.length < 6 && (
                              <div className="w-full flex justify-center pb-4 items-center">
                                <div className="w-full flex justify-center items-center my-4">
                                  <button
                                    onClick={(e) =>
                                      handleTASAddDay(tasIndex, e)
                                    }
                                    className="bg-primary text-white py-2 px-6 text-xs rounded-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                                  >
                                    Add Day and Time Restriction
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteTAS(tasIndex)}>
                      <img
                        src={trash_button}
                        alt="Delete"
                        className="w-7 transition-all duration-300 active:scale-95 active:shadow-lg"
                      />
                    </button>
                  </div>
                );
              })}
              <div className="flex flex-col items-center justify-center">
                {statusMessage.type && (
                  <div
                    className={`mx-auto mt-6 p-3 rounded-md text-center font-medium relative ${
                      statusMessage.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                  >
                    {statusMessage.text}
                    <button
                      onClick={clearStatusMessage}
                      className="text-gray-600 hover:text-gray-900 ml-5 items-center"
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
                    className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg "
                  >
                    Save
                  </button>
                  <button
                    onClick={handleAddTAS}
                    className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                  >
                    Add
                    <img src={add_button_white} className="w-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default InputTAS;
