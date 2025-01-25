import React, { useState } from "react";
import Navbar from "../../components/Navbar";

type YearLevels = {
  firstYear: { startTime: string; endTime: string };
  secondYear: { startTime: string; endTime: string };
  thirdYear: { startTime: string; endTime: string };
  fourthYear: { startTime: string; endTime: string };
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

  const handleSave = () => {
    //get the values here
    console.log("Year Level Times:");
    Object.keys(yearLevels).forEach((year) => {
      const yearKey = year as keyof YearLevels; // Cast to keyof YearLevels
      console.log(
        `${yearKey}: Start Time - ${yearLevels[yearKey].startTime}, End Time - ${yearLevels[yearKey].endTime}`
      );
    });
  };

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
      <section className="flex flex-col gap-5 mt-11">
        {["firstYear", "secondYear", "thirdYear", "fourthYear"].map(
          (year, index) => (
            <div
              key={index}
              className="flex items-center gap-11 mx-auto bg-[#F1FAFF] p-5 rounded-xl shadow-md font-Manrope font-bold"
            >
              <p>{`${index + 1}st Year`}</p>
              <div>
                <div className="flex gap-3 items-center font-Manrope font-semibold text-sm">
                  <div>Class Start</div>
                  <input
                    type="time"
                    value={yearLevels[year as keyof YearLevels].startTime}
                    onChange={(e) =>
                      handleTimeChange(
                        year as keyof YearLevels,
                        "startTime",
                        e.target.value
                      )
                    }
                    className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                  />
                  <div>Class End</div>
                  <input
                    type="time"
                    value={yearLevels[year as keyof YearLevels].endTime}
                    onChange={(e) =>
                      handleTimeChange(
                        year as keyof YearLevels,
                        "endTime",
                        e.target.value
                      )
                    }
                    className="h-[38px] w-[130px] border border-primary rounded-[5px] py-1 px-2"
                  />
                </div>
              </div>
            </div>
          )
        )}
      </section>

      <div className="flex mx-auto">
        <button
          onClick={handleSave}
          className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-11 mb-24 rounded-sm hover:bg-primary hover:text-white hover:shadow-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InputYLT;
