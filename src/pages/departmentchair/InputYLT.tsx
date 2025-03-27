import React, { useState, FormEvent } from "react";
import Navbar from "../../components/Navbar";

type YearLevels = {
  firstYear: { startTime: string; endTime: string };
  secondYear: { startTime: string; endTime: string };
  thirdYear: { startTime: string; endTime: string };
  fourthYear: { startTime: string; endTime: string };
};

const yearLevelNames: Record<keyof YearLevels, string> = {
  firstYear: "1st Year",
  secondYear: "2nd Year",
  thirdYear: "3rd Year",
  fourthYear: "4th Year",
};

const InputYLT = () => {
  const [yearLevels, setYearLevels] = useState<YearLevels>({
    firstYear: { startTime: "", endTime: "" },
    secondYear: { startTime: "", endTime: "" },
    thirdYear: { startTime: "", endTime: "" },
    fourthYear: { startTime: "", endTime: "" },
  });

  const handleTimeChange = (
    year: keyof YearLevels,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setYearLevels({
      ...yearLevels,
      [year]: { ...yearLevels[year], [field]: value },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Year Level Times:");
    Object.entries(yearLevels).forEach(([year, times]) => {
      const yearKey = year as keyof YearLevels;
      console.log(
        `${yearLevelNames[yearKey]}: Start Time - ${times.startTime}, End Time - ${times.endTime}`
      );
    });

    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="flex items-center justify-center">
        <div className="px-16 flex gap-10 items-center font-Helvetica-Neue-Heavy">
          <div className="text-primary text-[35px] mb-2">
            Year Level - Time Constraints
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="flex flex-col gap-5 mt-11">
          {(Object.keys(yearLevels) as Array<keyof YearLevels>).map(
            (year, index) => (
              <div
                key={year}
                className="flex items-center gap-11 mx-auto bg-[#F1FAFF] p-5 rounded-xl shadow-md font-Manrope font-bold"
              >
                <p className="w-8">{index + 1}</p>
                <div>
                  <div className="flex gap-3 items-center font-Manrope font-semibold text-sm">
                    <label htmlFor={`${year}-start`}>Class Start</label>
                    <input
                      id={`${year}-start`}
                      type="time"
                      value={yearLevels[year].startTime}
                      onChange={(e) =>
                        handleTimeChange(year, "startTime", e.target.value)
                      }
                      className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                      required
                    />
                    <label htmlFor={`${year}-end`}>Class End</label>
                    <input
                      id={`${year}-end`}
                      type="time"
                      value={yearLevels[year].endTime}
                      onChange={(e) =>
                        handleTimeChange(year, "endTime", e.target.value)
                      }
                      className="h-[38px] w-[130px] border border-primary rounded-[5px] py-1 px-2"
                      required
                    />
                  </div>
                </div>
              </div>
            )
          )}
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
