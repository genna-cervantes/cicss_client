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

  // Handle max days input change
  const handleMaxDaysChange = (yearIndex: number, value: string) => {
    setYearLevels((prevState) => {
      const newState = [...prevState];
      newState[yearIndex] = {
        ...newState[yearIndex],
        maxDays: value,
      };

      handleUpdate({ updatedYld: newState[yearIndex] });

      return newState;
    });
  };

  // Handle form submission
  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    // handle updates
    const updateYLDData = async () => {
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
        const res = await fetch(
          `http://localhost:8080/yldconstraint/${department}/${updYearLevel.year}`,
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
          console.log("yey updated");
        } else {
          console.log("may error sis");
        }
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
          `http://localhost:8080/yldconstraint/${department}/${i}`,
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
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
        <div className="text-primary text-[35px]">
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
                    onChange={(e) => handleMaxDaysChange(index, e.target.value)}
                    min="0"
                    max="7"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="flex mx-auto">
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

export default InputYLD;
