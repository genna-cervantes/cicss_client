import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import Navbar from "../../components/Navbar";

import add_button from "../../assets/add_button.png";
import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";

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
  subjectCode?: string;
}

// gawa ng function to get the courses from the internal representation - nasa utils
// convert ung military time to normal time - util function din
// lipat sa utils ung pag convert from db rep to normal rep

const courseOptions: Option[] = [
  {
    value: "coa",
    label: "Computer Organization and Architecture",
    subjectCode: "CS2619",
  },
  {
    value: "stats",
    label: "Advanced Statistics and Probability",
    subjectCode: "CS2617",
  },
  {
    value: "desalgo",
    label: "Design and Analysis of Algorithms",
    subjectCode: "CS2615",
  },
  {
    value: "appdev1",
    label: "Applications Development 1",
    subjectCode: "ICS2608",
  },
  { value: "se1", label: "Software Engineering 1", subjectCode: "ICS26010" },
  { value: "se2", label: "Software Engineering 2", subjectCode: "ICS26013" },
  { value: "automata", label: "Theory of Automata", subjectCode: "CS2616" },
  { value: "thesis1", label: "Thesis 1", subjectCode: "CS26112" },
];

const dayOptions: Option[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
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

  // handler for text fields on the TAS level (name)
  const handleTASFieldChange = (
    tasIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = { ...updated[tasIndex], [name]: value };
      return updated;
    });
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
      const updatedTimes = [...updatedRequests[requestIndex].startEndTimes];
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
  };

  // Handler to delete a day (request) from a specific TAS form
  const handleTASDeleteDay = (tasIndex: number, requestIndex: number) => {
    setTasList((prev) => {
      const updated = [...prev];
      updated[tasIndex] = {
        ...updated[tasIndex],
        restrictions: updated[tasIndex].restrictions.filter(
          (_, i) => i !== requestIndex
        ),
      };
      return updated;
    });
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
      // Only delete if more than one time entry exists
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
  };

  // Handler to add a new TAS form
  const handleAddTAS = (e: FormEvent) => {
    e.preventDefault();
    setTasList((prev) => [
      ...prev,
      {
        tasId: "1",
        name: "",
        units: 0,
        courses: [],
        restrictions: [{ day: "", startEndTimes: [{ start: "", end: "" }] }],
      },
    ]);
  };

  // Handler to delete an entire TAS form
  const handleDeleteTAS = (tasIndex: number) => {
    setTasList((prev) => prev.filter((_, i) => i !== tasIndex));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // Log each TAS details
    tasList.forEach((tas, tasIndex) => {
      console.log(`TAS ${tasIndex + 1}:`);
      console.log("   Name:", tas.name);

      console.log("   Specialties:", tas.courses.join(", "));
      tas.restrictions.forEach((req, reqIndex) => {
        console.log(`   Request ${reqIndex + 1}:`);
        console.log("      Day:", req.day);
        req.startEndTimes.forEach((time, timeIndex) => {
          console.log(
            `      Time ${timeIndex + 1} - Start: ${time.start}, End: ${
              time.end
            }`
          );
        });
      });
    });
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
      const res = await fetch("http://localhost:8080/tasconstraints/CS"); // EDIT THIS TO BE DYNAMIC PERO CS MUNA FOR NOW
      const data = await res.json();

      // const convertedTasList: TasInfo[] = [];

      for (let i = 0; i < data.length; i++) {
        let newTas = data[i];
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
                  start: specRestriction.start,
                  end: specRestriction.end,
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
    <div>
      {/* Mobile/Small screen warning - only shows on screens smaller than lg breakpoint */}
      <div className="sm:hidden flex flex-col items-center justify-center h-screen overflow-hidden m-10">
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

      {/* Main content - hidden on small screens, visible from lg breakpoint and up */}
      <div className="hidden sm:flex flex-col min-h-screen">
        <div className="mx-auto py-10">
          <Navbar />
        </div>
        <section className="px-16 flex items-center justify-center gap-11 font-Helvetica-Neue-Heavy">
          <div className="text-primary lg:text-[35px] md:text-[25px]">
            Teaching Academic Staff
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <div className="flex mx-auto gap-5 font-Manrope font-semibold">
          <form onSubmit={handleSave}>
            {tasList.map((tas, tasIndex) => (
              <div className="flex space-x-4">
                <div
                  key={tasIndex}
                  className="flex flex-col gap-3 bg-[#F1FAFF] lg:px-5 pt-5 rounded-xl shadow-sm mt-8"
                >
                  {/*Label */}
                  <section>
                    <div className="flex font-extrabold text-primary gap-80 row-span-5">
                      <div className="flex gap-20">
                        <div className="flex gap-16">
                          <p>No.</p>
                          <p>TAS Name</p>
                        </div>
                        <p>Units</p>
                        <p>Specialties</p>
                      </div>
                      <p>Day and Time Restriction</p>
                    </div>
                  </section>

                  {/*Form */}
                  <div className="flex lg:gap-5 md:gap-3">
                    {/*Left */}
                    <div className="flex lg:gap-3 md:gap-2">
                      <div>
                        <label className="mr-1">TAS {tasIndex + 1} </label>
                        <input
                          type="text"
                          name="name"
                          value={tas.name}
                          onChange={(e) => handleTASFieldChange(tasIndex, e)}
                          placeholder="Enter"
                          className="lg:h-[38px] md:h-[30px] border border-primary rounded-[5px] px-3 lg:w-[180px] md:w-[150px]"
                        />
                      </div>
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
                          className="lg:h-[38px] md:h-[30px] border border-primary rounded-[5px] px-2 w-[80px]"
                        />
                      </div>
                      <div>
                        <Select
                          options={courseOptions}
                          placeholder="Select"
                          isMulti
                          isClearable={false}
                          closeMenuOnSelect={false}
                          className="w-[200px]"
                          // naka course name toh imbes na subject code - gawing map
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

                    {/*Right */}
                    <div>
                      {tas.restrictions.length > 0 ? (
                        tas.restrictions.map((request, reqIndex) => (
                          <div
                            key={reqIndex}
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
                                {request.startEndTimes.map(
                                  (time, timeIndex) => (
                                    <div key={timeIndex} className="mb-3">
                                      <div className="flex items-center gap-3 justify-center">
                                        <label>Start</label>
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
                                          className="h-[38px] border w-[120px] border-primary rounded-[5px] py-1 px-2"
                                        />
                                        <label>End</label>
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
                                          className="h-[38px] border w-[120px] border-primary rounded-[5px] py-1 px-2"
                                        />
                                        {request.startEndTimes.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleTASDeleteTime(
                                                tasIndex,
                                                reqIndex,
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
                                            handleTASAddTime(tasIndex, reqIndex)
                                          }
                                          className="w-7"
                                        >
                                          <img src={add_button} />
                                        </button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex justify-center gap-3 mt-5">
                              <button
                                onClick={(e) => handleTASAddDay(tasIndex, e)}
                                className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                              >
                                Add Day
                              </button>
                              {tas.restrictions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTASDeleteDay(tasIndex, reqIndex)
                                  }
                                  className="border border-primary text-primary py-1 px-4 text-xs rounded-md"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))
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
                                  handleTASRequestDayChange(
                                    tasIndex,
                                    0, // First restriction
                                    selectedOption
                                  )
                                }
                                styles={selectStyles}
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
                                      handleTASTimeChange(tasIndex, 0, 0, e)
                                    }
                                    className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                  />
                                  <label>End</label>
                                  <input
                                    type="time"
                                    name="end"
                                    value=""
                                    onChange={(e) =>
                                      handleTASTimeChange(tasIndex, 0, 0, e)
                                    }
                                    className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleTASAddTime(tasIndex, 0)
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
                              onClick={(e) => handleTASAddDay(tasIndex, e)}
                              className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                            >
                              Add Day
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
    </div>
  );
};

export default InputTAS;
