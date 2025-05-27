import React, { useState, FormEvent, useEffect } from "react";
import Navbar from "../../components/Navbar";

interface YearLevelData {
  year: number;
  allowedDays: {
    M: boolean;
    T: boolean;
    W: boolean;
    TH: boolean;
    F: boolean;
    SA: boolean;
  };
  maxDays: string;
}
// Array of day labels
const days: Array<keyof YearLevelData["allowedDays"]> = [
  "M",
  "T",
  "W",
  "TH",
  "F",
  "SA",
];

const InputYLD: React.FC = () => {
  // Initialize form state
  const [yearLevels, setYearLevels] = useState<YearLevelData[]>([
    {
      year: 1,
      allowedDays: {
        M: false,
        T: false,
        W: false,
        TH: false,
        F: false,
        SA: false,
      },
      maxDays: "",
    },
    {
      year: 2,
      allowedDays: {
        M: false,
        T: false,
        W: false,
        TH: false,
        F: false,
        SA: false,
      },
      maxDays: "",
    },
    {
      year: 3,
      allowedDays: {
        M: false,
        T: false,
        W: false,
        TH: false,
        F: false,
        SA: false,
      },
      maxDays: "",
    },
    {
      year: 4,
      allowedDays: {
        M: false,
        T: false,
        W: false,
        TH: false,
        F: false,
        SA: false,
      },
      maxDays: "",
    },
  ]);
  const [updatedYearLevels, setUpdatedYearLevels] = useState<YearLevelData[]>(
    []
  );
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const handleUpdate = ({ updatedYld }: { updatedYld: YearLevelData }) => {
    setUpdatedYearLevels((prev) => {
      let newYearLevels = [...prev];
      let index = prev.findIndex((yld) => yld.year === updatedYld.year);
      if (index === -1) {
        newYearLevels.push({ ...updatedYld });
      } else {
        newYearLevels[index] = { ...updatedYld };
      }

      return newYearLevels;
    });
  };

  useEffect(() => {
    console.log("updated ylds");
    console.log(updatedYearLevels);
  }, [updatedYearLevels]);

  // Handle checkbox change
  const handleDayChange = (
    yearIndex: number,
    day: keyof YearLevelData["allowedDays"]
  ) => {
    setYearLevels((prevState) => {
      const newState = [...prevState];
      newState[yearIndex] = {
        ...newState[yearIndex],
        allowedDays: {
          ...newState[yearIndex].allowedDays,
          [day]: !newState[yearIndex].allowedDays[day],
        },
      };

      handleUpdate({ updatedYld: newState[yearIndex] });

      return newState;
    });
  };

  // Handle max days input change with proper validation
  const handleMaxDaysChange = (yearIndex: number, value: string) => {
    let numValue = parseInt(value);

    let validatedValue =
      value === ""
        ? ""
        : isNaN(numValue)
        ? "1"
        : numValue < 1
        ? "1"
        : numValue > 6
        ? "6"
        : value;

    setYearLevels((prevState) => {
      const newState = [...prevState];
      newState[yearIndex] = {
        ...newState[yearIndex],
        maxDays: validatedValue,
      };

      handleUpdate({ updatedYld: newState[yearIndex] });

      return newState;
    });
  };

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  // Handle form submission
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true");

    const hasInvalidMaxDays = yearLevels.some(
      (level) =>
        level.maxDays === "" ||
        level.maxDays === null ||
        level.maxDays === undefined ||
        level.maxDays === "0"
    );

    if (hasInvalidMaxDays) {
      setStatusMessage({
        type: "error",
        text: "Please specify Maximum Days for all year levels. Values must be between 1 and 6.",
      });
      return;
    }

    const yearLevelsWithNoDaysSelected = yearLevels.filter((level) =>
      Object.values(level.allowedDays).every((day) => !day)
    );

    if (yearLevelsWithNoDaysSelected.length > 0) {
      const yearNumbers = yearLevelsWithNoDaysSelected
        .map((level) => level.year)
        .join(", ");
      setStatusMessage({
        type: "error",
        text: `Please select Allowed Days for Year Level${
          yearLevelsWithNoDaysSelected.length > 1 ? "s" : ""
        } ${yearNumbers}.`,
      });
      return;
    }

    // handle updates
    const updateYLDData = async () => {
      let isSuccess = false;
      let apiErrors: string[] = [];

      for (let i = 0; i < updatedYearLevels.length; i++) {
        let updYearLevel: any = updatedYearLevels[i];

        let allowedDaysKeys = Object.keys(updYearLevel.allowedDays);
        let transformedAllowedDays: any = allowedDaysKeys.filter(
          (key) => updYearLevel.allowedDays[key]
        );
        transformedAllowedDays = transformedAllowedDays.map((ad: string) =>
          ad === "SA" ? "S" : ad
        );

        let transformedUpdYearLevel = {
          availableDays: transformedAllowedDays,
          maxDays: updYearLevel.maxDays,
        };

        const department = localStorage.getItem("department") ?? "CS";

        try {
          const res = await fetch(
            `/api/yldconstraint/${department}/${updYearLevel.year}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(transformedUpdYearLevel),
            }
          );

          if (res.ok) {
            isSuccess = true;
            console.log("yey updated");
          } else {
            const data = await res.json();
            console.log("may error sis");
            apiErrors.push(
              `Failed to update Year Level ${updYearLevel.year}: ${
                data.message || "Unknown error"
              }`
            );
          }
        } catch (error) {
          console.error("Update fetch error:", error);
          apiErrors.push(
            `Network error updating Year Level ${updYearLevel.year}`
          );
        }
      }

      if (apiErrors.length > 0) {
        setStatusMessage({
          type: "error",
          text: apiErrors[0],
        });
      } else if (isSuccess) {
        setStatusMessage({
          type: "success",
          text: "Year Level - Day constraints successfully saved!",
        });
      } else if (updatedYearLevels.length === 0) {
        setStatusMessage({
          type: "error",
          text: "No changes to save.",
        });
      }
    };
    updateYLDData();
  };

  // fetch data
  useEffect(() => {
    const fetchYLDData = async () => {
      const department = localStorage.getItem("department") ?? "CS";
      for (let i = 1; i < 5; i++) {
        const res = await fetch(
          `/api/yldconstraint/${department}/${i}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setYearLevels((prev) => {
            let newYearLevels = [...prev];
            let index = prev.findIndex((yld) => yld.year === i);
            let newYld = {
              year: i,
              allowedDays: {
                M: data.availableDays.includes("M"),
                T: data.availableDays.includes("T"),
                W: data.availableDays.includes("W"),
                TH: data.availableDays.includes("TH"),
                F: data.availableDays.includes("F"),
                SA: data.availableDays.includes("S"),
              },
              maxDays: data.maxDays.toString(),
            };
            newYearLevels[index] = newYld;
            return newYearLevels;
          });

          console.log(data);
        } else {
          console.log("error with fetching data");
        }
      }
    };

    fetchYLDData();
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
        <section className="px-4 md:px-16 flex flex-col lg:flex-row gap-4 md:gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
          <div className="text-primary mt-5 text-2xl md:text-[35px]">
            Year Level - Day Constraints
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <form onSubmit={handleSave} className="flex flex-col mx-auto">
          <section>
            {yearLevels.map((level, index) => (
              <div
                key={index}
                className="flex flex-col bg-[rgba(241,250,255,0.5)] rounded-xl p-8 shadow-lg mb-5 mt-7"
              >
                <div className="flex font-Manrope font-extrabold text-primary mb-5">
                  <div className="ml-64 mr-5">Allowed Days</div>
                  <div className="ml-52">Max Days</div>
                </div>
                <div className="flex gap-12 items-center ">
                  <p className="year-label">Year Level {level.year}</p>
                  <div className="flex">
                    <div className="flex gap-3 font-Manrope font-semibold">
                      {days.map((day) => (
                        <div key={day} className="flex gap-2 items-center">
                          <p>{day}</p>
                          <input
                            type="checkbox"
                            className="w-7 h-7 border border-primary"
                            checked={level.allowedDays[day]}
                            onChange={() => handleDayChange(index, day)}
                            id={`checkbox-${level.year}-${day}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p>Max</p>
                    <input
                      type="number"
                      className="w-24 h-7 border border-primary rounded-sm p-2"
                      value={level.maxDays}
                      onChange={(e) =>
                        handleMaxDaysChange(index, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          (e.key === "0" &&
                            (e.target as HTMLInputElement).value === "")
                        ) {
                          e.preventDefault();
                        }
                      }}
                      min="1"
                      max="6"
                      step="1"
                      placeholder="1-6"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

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

            <div className="flex mx-auto">
              <button
                type="submit"
                className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-11 mb-24 rounded-sm hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default InputYLD;
