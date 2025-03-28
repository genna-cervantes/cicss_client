import React, { useState, FormEvent, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import Navbar from "../../components/Navbar";
import { dayOptions } from "./InputTAS";
import add_button from "../../assets/add_button.png";

type YearLevels = {
  firstYear: {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
  secondYear: {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
  thirdYear: {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
  fourthYear: {
    day: string;
    startEndTimes: { startTime: string; endTime: string }[];
  }[];
};

const yearLevelNames: Record<keyof YearLevels, string> = {
  firstYear: "1st Year",
  secondYear: "2nd Year",
  thirdYear: "3rd Year",
  fourthYear: "4th Year",
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

const InputYLT = () => {
  const [yearLevels, setYearLevels] = useState<YearLevels>({
    firstYear: [{ day: "", startEndTimes: [{ startTime: "", endTime: "" }] }],
    secondYear: [{ day: "", startEndTimes: [{ startTime: "", endTime: "" }] }],
    thirdYear: [{ day: "", startEndTimes: [{ startTime: "", endTime: "" }] }],
    fourthYear: [{ day: "", startEndTimes: [{ startTime: "", endTime: "" }] }],
  });

  const [updatedYearLevels, setUpdatedYearLevels] = useState<{
    [key: string]: {
      day: string;
      startEndTimes: { startTime: string; endTime: string }[];
    }[];
  }[]>([]);

  useEffect(() => {
    console.log("updated");
    console.log(updatedYearLevels);
  }, [updatedYearLevels]);

  const handleChangeTimeRestriction = (
    name: "startTime" | "endTime",
    value: string,
    year: string,
    yearDataIndex: number,
    timeIndex: number
  ) => {
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
        ...prev, // Preserve previous state
        [year]: updatedYear,
      };
    });

    let yearLevel;
    switch (year) {
      case "firstYear":
        yearLevel = 1;
        break;
      case "secondYear":
        yearLevel = 2;
        break;
      case "thirdYear":
        yearLevel = 3;
        break;
      case "fourthYear":
        yearLevel = 4;
        break;
      default:
        yearLevel = 0;
    }    

    setUpdatedYearLevels((prev) => {
      // Check if the yearLevel already exists in the array
      const existingIndex = prev.findIndex((item) => item[yearLevel]);
    
      if (existingIndex !== -1) {
        // If the year level exists, update it
        return prev.map((item, index) =>
          index === existingIndex ? { [yearLevel]: updatedYear } : item
        );
      } else {
        // If the year level doesn't exist, add it
        return [...prev, { [yearLevel]: updatedYear }];
      }
    });
  };

  const handleAddTimeRestriction = (
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
      case "firstYear":
        yearLevel = 1;
        break;
      case "secondYear":
        yearLevel = 2;
        break;
      case "thirdYear":
        yearLevel = 3;
        break;
      case "fourthYear":
        yearLevel = 4;
        break;
      default:
        yearLevel = 0;
    }    

    setUpdatedYearLevels((prev) => {
      // Check if the yearLevel already exists in the array
      console.log(typeof prev)
      const existingIndex = prev.findIndex((item) => item[yearLevel]);
    
      if (existingIndex !== -1) {
        // If the year level exists, update it
        return prev.map((item, index) =>
          index === existingIndex ? { [yearLevel]: updatedYear } : item
        );
      } else {
        // If the year level doesn't exist, add it
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
    let yearLevel;

    switch (year) {
      case "firstYear":
        yearLevel = 1;
        break;
      case "secondYear":
        yearLevel = 2;
        break;
      case "thirdYear":
        yearLevel = 3;
        break;
      case "fourthYear":
        yearLevel = 4;
        break;
      default:
        yearLevel = 0;
    }    

    setUpdatedYearLevels((prev) => {
      // Check if the yearLevel already exists in the array
      const existingIndex = prev.findIndex((item) => item[yearLevel]);
    
      if (existingIndex !== -1) {
        // If the year level exists, update it
        return prev.map((item, index) =>
          index === existingIndex ? { [yearLevel]: updatedYear } : item
        );
      } else {
        // If the year level doesn't exist, add it
        return [...prev, { [yearLevel]: updatedYear }];
      }
    });
    
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    console.log('saving')
    console.log(updatedYearLevels)

    // Here you would typically send the data to your backend
    for (let i = 0; i < updatedYearLevels.length; i++){
      let updatedYearLevel = updatedYearLevels[i];
      let yearLevel = Object.keys(updatedYearLevel)[0]

      let transformedRestrictions: any = {
        M: [],
        T: [],
        W: [],
        TH: [],
        F: [],
        S: []
      }

      updatedYearLevel[yearLevel].forEach((res) => {
        let transformedStartEndTimes = res.startEndTimes.map((set) => {
          return {
            start: `${set.startTime.slice(0,2)}${set.startTime.slice(3)}`,
            end: `${set.endTime.slice(0,2)}${set.endTime.slice(3)}`,
          }
        })
        transformedRestrictions[res.day] = [...transformedRestrictions[res.day], ...transformedStartEndTimes]
      })

      const res = await fetch(`http://localhost:8080/yltconstraints/CS/${yearLevel}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(("token")) ?? ''}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({restrictions: transformedRestrictions})
      })

      if (res.ok){
        console.log('yeyy okay')
      }else{
        console.log('error')
      }
    }
  };

  // fetch data
  useEffect(() => {
    const fetchYLTData = async () => {
      for (let i = 1; i < 5; i++) {
        const res = await fetch(
          `http://localhost:8080/yltconstraints/CS/${i}`,
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
                startEndTimes: transformedStartEndTimes, // genedConstraint.restrictions[genedkey],
              };

              // return undefined; // Explicitly return undefined
            })
            .filter(
              (item): item is { day: string; startEndTimes: any } =>
                item !== undefined
            );

          console.log("transform", transformedYLTConstraints);

          if (i === 1) {
            setYearLevels((prev) => ({
              ...prev, // Spread the previous state properly
              firstYear: transformedYLTConstraints, // Update only firstYear
            }));
          } else if (i === 2) {
            setYearLevels((prev) => ({
              ...prev, // Spread the previous state properly
              secondYear: transformedYLTConstraints, // Update only firstYear
            }));
          } else if (i === 3) {
            setYearLevels((prev) => ({
              ...prev, // Spread the previous state properly
              thirdYear: transformedYLTConstraints, // Update only firstYear
            }));
          } else if (i === 4) {
            setYearLevels((prev) => ({
              ...prev, // Spread the previous state properly
              fourthYear: transformedYLTConstraints, // Update only firstYear
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
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">
          Year Level - Time Constraints
        </div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>

      <form onSubmit={handleSave}>
        <section className="flex flex-col gap-5 mt-11">
          {/* <div
            // key={`${year}-${index}`} // Use a unique key combining year and index
            className="flex flex-col items-center gap-11 mx-auto bg-[#F1FAFF] p-5 rounded-xl shadow-md font-Manrope font-bold"
          > */}
          {(Object.keys(yearLevels) as Array<keyof YearLevels>).map((year) => {
            return (
              <div className="flex w-[70%] justify-around items-center gap-11 mx-auto bg-[#F1FAFF] p-5 rounded-xl shadow-md font-Manrope font-bold">
                <p>{year}</p>
                <div className="flex flex-col gap-y-5 items-center">
                  {yearLevels[year].map(
                    (
                      yearData,
                      yearDataIndex // Use map instead of forEach
                    ) => {
                      // console.log("year data", yearData);
                      return (
                        <div className="w-full">
                          <div className="w-full">
                            <div className="flex gap-3 items-center font-Manrope font-semibold text-sm w-full">
                              <Select
                                isDisabled={true}
                                options={dayOptions}
                                placeholder="Select"
                                value={
                                  dayOptions.find(
                                    (opt) => opt.value === yearData.day
                                  ) || null
                                }
                                styles={selectStyles}
                              />
                              <div className=" bg-[#BFDDF6] rounded-xl px-8 py-4 flex flex-col gap-y-3 w-full">
                                {yearData.startEndTimes.length > 0 ? (
                                  yearData.startEndTimes.map(
                                    (time, timeIndex) => {
                                      return (
                                        <div className="flex items-center gap-x-4">
                                          <label htmlFor={`${year}-start`}>
                                            Start
                                          </label>
                                          <input
                                            id={`${year}-start`}
                                            type="time"
                                            value={time.startTime} // Use yearData instead of yearLevels[year]
                                            onChange={(e) =>
                                              handleChangeTimeRestriction(
                                                "startTime",
                                                e.target.value,
                                                year,
                                                yearDataIndex,
                                                timeIndex
                                              )
                                            }
                                            className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                                            required
                                          />
                                          <label htmlFor={`${year}-end`}>
                                            End
                                          </label>
                                          <input
                                            id={`${year}-end`}
                                            type="time"
                                            value={time.endTime} // Use yearData instead of yearLevels[year]
                                            onChange={(e) =>
                                              handleChangeTimeRestriction(
                                                "endTime",
                                                e.target.value,
                                                year,
                                                yearDataIndex,
                                                timeIndex
                                              )
                                            }
                                            className="h-[38px] w-[130px] border border-primary rounded-[5px] py-1 px-2"
                                            required
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
                                      className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                                    >
                                      Add Time
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
            );
          })}
          {/* </div> */}
        </section>

        <div className="flex justify-center">
          <button
            type="submit"
            className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-11 mb-24 rounded-sm hover:bg-primary hover:text-white hover:shadow-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputYLT;
