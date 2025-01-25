import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

const InputSectionCounts: React.FC = () => {
  const [inputValues, setInputValues] = useState<(number | "")[]>(() => {
    const storedValues = localStorage.getItem("inputValues");
    return storedValues ? JSON.parse(storedValues) : ["", "", "", ""];
  });

  useEffect(() => {
    localStorage.setItem("inputValues", JSON.stringify(inputValues));
  }, [inputValues]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value === "" ? "" : parseInt(value, 10);
    setInputValues(newValues);
  };

  const handleSave = () => {
    console.log("First Year:", inputValues[0] || "Not Set");
    console.log("Second Year:", inputValues[1] || "Not Set");
    console.log("Third Year:", inputValues[2] || "Not Set");
    console.log("Fourth Year:", inputValues[3] || "Not Set");
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">Section Counts</div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>
      <section className="mx-auto my-11">
        <div className="flex gap-36 font-Manrope font-extrabold">
          <p>1st Year</p>
          <p>2nd Year</p>
          <p>3rd Year</p>
          <p>4th Year</p>
        </div>
      </section>
      <section className="flex justify-center">
        <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)]">
          <div className="p-6 flex gap-32">
            {inputValues.map((value, index) => (
              <input
                key={index}
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="0"
                className="border border-primary rounded-md w-20 p-2"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </section>
      <button
        onClick={handleSave}
        className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mx-auto mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white"
      >
        Save
      </button>
    </div>
  );
};

export default InputSectionCounts;
