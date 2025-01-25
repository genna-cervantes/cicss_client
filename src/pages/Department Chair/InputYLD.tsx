import React, { useRef } from "react";
import Navbar from "../../components/Navbar";

const InputYLD: React.FC = () => {
  const formRef = useRef<HTMLDivElement | null>(null);

  const handleSave = () => {
    //get the values here
    if (!formRef.current) return;
    const yearLevels = Array.from(
      formRef.current.querySelectorAll<HTMLDivElement>(".year-level")
    );

    const results = yearLevels.map((level) => {
      const year =
        level.querySelector<HTMLParagraphElement>(".year-label")?.textContent ||
        "Unknown";
      const checkboxes = Array.from(
        level.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      );
      const maxInput = level.querySelector<HTMLInputElement>(
        'input[type="number"]'
      );

      const checkedDays = checkboxes
        .filter((checkbox) => checkbox.checked)
        .map(
          (checkbox) =>
            checkbox.previousElementSibling?.textContent?.trim() || "Unknown"
        );

      const maxValue = maxInput?.value || "Not Set";

      return { year, checkedDays, maxValue };
    });

    console.log("Results:", results);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">
          Year Level - Day Constraints
        </div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
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
      <section ref={formRef} className="flex flex-col mx-auto">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="flex gap-20 items-center bg-[rgba(241,250,255,0.5)] rounded-xl p-9 shadow-lg mb-5 year-level"
          >
            <p className="year-label">Year Level {level}</p>
            <div className="flex">
              <div className="flex gap-5 font-Manrope font-semibold">
                {["M", "T", "W", "TH", "F", "SA"].map((day) => (
                  <div key={day} className="flex gap-2 items-center">
                    <p>{day}</p>
                    <input
                      type="checkbox"
                      className="w-7 h-7 border border-primary"
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
              />
            </div>
          </div>
        ))}
      </section>
      <div className="flex mx-auto">
        <button
          className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-11 mb-24 rounded-sm hover:bg-primary hover:text-white hover:shadow-md"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InputYLD;
