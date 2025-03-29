import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import Navbar from "../../components/Navbar";

import add_button from "../../assets/add_button.png";
import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";
import { getCourseCodesFromInternalRepresentation } from "../../utils/utils";
import { v4 as uuidv4 } from "uuid";
import ScrollButton from "../../components/ScrollButton";

interface TimeEntry {
  start: string;
  end: string;
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
}

interface Option {
  value: string;
  label: string;
  hasLab?: boolean;
}

// gawa ng function to get the courses from the internal representation - nasa utils
// convert ung military time to normal time - util function din
// lipat sa utils ung pag convert from db rep to normal rep

const courseOptions: Option[] = [
  { value: "CS2619", label: "Computer Organization and Architecture" },
  { value: "CS2617", label: "Advanced Statistics and Probability" },
  { value: "CS2615", label: "Design and Analysis of Algorithms" },
  { value: "ICS2608", label: "Applications Development 1" },
  { value: "ICS26010", label: "Software Engineering 1" },
  { value: "ICS26013", label: "Software Engineering 2" },
  { value: "CS2616", label: "Theory of Automata" },
  { value: "CS26112", label: "Thesis 1" },
];

export const dayOptions: Option[] = [
  { value: "M", label: "Monday" },
  { value: "T", label: "Tuesday" },
  { value: "W", label: "Wednesday" },
  { value: "TH", label: "Thursday" },
  { value: "F", label: "Friday" },
  { value: "S", label: "Saturday" },
];

const InputTAS: React.FC = () => {
  // Store an array of TAS
  const [tasList, setTasList] = useState<TasInfo[]>([
    {
      tasId: "1",
      name: "",
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

  useEffect(() => {
    console.log("updated tas ids: ", updatedTAS);
  }, [updatedTAS]);

  useEffect(() => {
    console.log("deleted tas ids: ", deletedTAS);
  }, [deletedTAS]);

  // Function to get available day options (days that haven't been selected yet for this TAS)
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

  // handler for text fields on the TAS level (name)
  const handleTASFieldChange = (
    tasIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // For name field, check if it contains at least two words
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

    // Always update the state to maintain responsiveness
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
          ? selectedOptions.map((option) => option.value)
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
    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = {
        ...updated[tasIndex],
        units: unitsValue,
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
        units: 0,
        courses: [],
        restrictions: [], // Start with empty restrictions array for new TAS
      },
    ]);
    setInsertedTas((prev) => [...prev, tempId]);
  };

  // Handler to delete an entire TAS form - ADD SA DELETE TRACKER
  const handleDeleteTAS = (tasIndex: number) => {
    setTasList((prev) => prev.filter((_, i) => i !== tasIndex));
    setDeletedTAS((prev) => [...prev, tasList[tasIndex].tasId]);
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

  // LOOP THRU HTE TRACKERS AND QUERY NECESSARY ENDPOINT
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    // Check if any TAS has an invalid name (empty or single word)
    const hasInvalidName = tasList.some((tas) => {
      const trimmedName = tas.name.trim();
      return trimmedName === "" || !trimmedName.includes(" ");
    });

    if (hasInvalidName) {
      alert("All TAS entries must have a full name (first and last name)");
      return;
    }

    // UPDATES
    // check if may nagbago b talaga
    console.log("UPDATING");
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

        // console.log(resObj)
      }

      const res = await fetch("http://localhost:8080/tasconstraints", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
      });

      if (res.ok) {
        console.log("yey ok"); // PLS CHANGE THIS TO MESSAGE KAHIT SA BABA NUNG BUTTONS LNG
      } else {
        console.log("nooo", res.body);
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
        email: "sample@email.com", // WALA PANG EMAIL FORM DON SA ANO
      };

      const res = await fetch("http://localhost:8080/tasconstraints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
      });

      if (res.ok) {
        console.log("yey ok"); // PLS CHANGE THIS TO MESSAGE KAHIT SA BABA NUNG BUTTONS LNG
      } else {
        const data = await res.json();
        console.log("nooo", data);
      }
    }

    console.log("DELETING");
    for (let i = 0; i < deletedTAS.length; i++) {
      const res = await fetch("http://localhost:8080/tasconstraints", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasId: deletedTAS[i] }),
      });

      if (res.ok) {
        console.log("yey ok");
      } else {
        const data = await res.json();
        console.log("nooo", data);
      }
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
        `http://localhost:8080/tasconstraints/${department}`,
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
        newTas.courses = getCourseCodesFromInternalRepresentation(
          newTas.courses
        );

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
          <div className="text-primary text-[28px] lg:text-[35px]">
            Teaching Academic Staff
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <div className="flex mx-auto gap-5 font-Manrope font-semibold mt-5">
          <form onSubmit={handleSave}>
            {tasList.map((tas, tasIndex) => (
              <div key={tasIndex} className="mb-7 flex gap-3">
                <div className="gap-5 bg-[#F1FAFF] px-5 py-5 rounded-xl shadow-md border w-full">
                  <div className="flex text-primary font-bold mb-2">
                    <div className="ml-20">Name</div>
                    <div className="ml-24">Units</div>
                    <div className="ml-16">Specialization</div>
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
                          className={`h-[38px] border ${
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
                          className="h-[38px] border border-primary rounded-[5px] px-2 w-[60px]"
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
                          className="w-[200px]"
                          value={courseOptions.filter((opt) =>
                            tas.courses.includes(opt.value)
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
                                              value={time.end}
                                              onChange={(e) =>
                                                handleTASTimeChange(
                                                  tasIndex,
                                                  reqIndex,
                                                  timeIndex,
                                                  e
                                                )
                                              }
                                              className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
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
                                              className="w-7 h-[38px] flex items-center justify-center"
                                            >
                                              <img src={add_button} alt="Add" />
                                            </button>
                                          </div>
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
                                            handleTASAddTime(tasIndex, reqIndex)
                                          }
                                          className="w-7 h-[38px] flex items-center justify-center"
                                        >
                                          <img src={add_button} alt="Add" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-center gap-3 mt-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTASDeleteDay(tasIndex, reqIndex)
                                  }
                                  className="border border-primary text-primary py-1 px-4 text-xs rounded-md"
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
                            className="bg-primary text-white py-2 px-6 text-xs rounded-md"
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
                                className="bg-primary text-white py-2 px-6 text-xs rounded-md"
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
                onClick={handleAddTAS}
                className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm"
              >
                Add
                <img src={add_button_white} className="w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InputTAS;
