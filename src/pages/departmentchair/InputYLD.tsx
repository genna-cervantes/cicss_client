import React, { useState, FormEvent } from "react";
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
      return newState;
    });
  };

  // Handle form submission
  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    const results = yearLevels.map((level) => {
      const checkedDays = Object.entries(level.allowedDays)
        .filter(([_, isChecked]) => isChecked)
        .map(([day]) => day);

      return {
        year: `Year Level ${level.year}`,
        checkedDays,
        maxValue: level.maxDays || "Not Set",
      };
    });

    console.log("Year Level 1: ");
    console.log(
      "   Checked Days: ",
      results[0].checkedDays.join(", ") || "None"
    );
    console.log("   Max Days: ", results[0].maxValue);

    console.log("Year Level 2: ");
    console.log(
      "   Checked Days: ",
      results[1].checkedDays.join(", ") || "None"
    );
    console.log("   Max Days: ", results[1].maxValue);

    console.log("Year Level 3: ");
    console.log(
      "   Checked Days: ",
      results[2].checkedDays.join(", ") || "None"
    );
    console.log("   Max Days: ", results[2].maxValue);

    console.log("Year Level 4: ");
    console.log(
      "   Checked Days: ",
      results[3].checkedDays.join(", ") || "None"
    );
    console.log("   Max Days: ", results[3].maxValue);
  };
  // Array of day labels
  const days: Array<keyof YearLevelData["allowedDays"]> = [
    "M",
    "T",
    "W",
    "TH",
    "F",
    "SA",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="flex items-center justify-center">
        <div className="px-16 flex gap-10 items-center font-Helvetica-Neue-Heavy">
          <div className="text-primary text-[35px] mb-2">
            Year Level - Day Constraints
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </div>
      </section>
      <div className="flex text-center font-Manrope font-extrabold ml-[660px] mt-11 mb-7">
        <p>
          Allowed Days <p className="text-xs">(Check All That Applies)</p>
        </p>
        <p className="ml-[220px]">
          Maximum Days Of <br /> Recurrence
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col mx-auto">
        <section>
          {yearLevels.map((level, index) => (
            <div
              key={index}
              className="flex gap-20 items-center bg-[rgba(241,250,255,0.5)] rounded-xl p-9 shadow-lg mb-5 year-level"
            >
              <p className="year-label">Year Level {level.year}</p>
              <div className="flex">
                <div className="flex gap-5 font-Manrope font-semibold">
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
