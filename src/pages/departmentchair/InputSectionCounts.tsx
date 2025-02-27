import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Navbar from "../../components/Navbar";

interface SectionCounts {
  firstSC: number | "";
  secondSC: number | "";
  thirdSC: number | "";
  fourthSC: number | "";
}

const InputSectionCounts: React.FC = () => {
  const [sectionCounts, setSectionCounts] = useState<SectionCounts>({
    firstSC: "",
    secondSC: "",
    thirdSC: "",
    fourthSC: "",
  });

  const handleSectionCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSectionCounts((prevCounts) => ({
      ...prevCounts,
      [name]: value ? parseInt(value, 10) : "",
    }));
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get the data here
    console.log("Submitted section counts:", sectionCounts);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col">
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
      <section className="flex justify-center font-Manrope font-semibold">
        <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)]">
          <div className="p-6 flex gap-32">
            <div>
              <input
                type="number"
                id="firstSC"
                name="firstSC"
                value={sectionCounts.firstSC}
                onChange={handleSectionCountChange}
                className="border border-primary rounded-md w-20 p-2"
                placeholder="0"
              />
            </div>
            <div>
              <input
                type="number"
                id="secondSC"
                name="secondSC"
                value={sectionCounts.secondSC}
                onChange={handleSectionCountChange}
                className="border border-primary rounded-md w-20 p-2"
                placeholder="0"
              />
            </div>
            <div>
              <input
                type="number"
                id="thirdSC"
                name="thirdSC"
                value={sectionCounts.thirdSC}
                onChange={handleSectionCountChange}
                className="border border-primary rounded-md w-20 p-2"
                placeholder="0"
              />
            </div>
            <div>
              <input
                type="number"
                id="fourthSC"
                name="fourthSC"
                value={sectionCounts.fourthSC}
                onChange={handleSectionCountChange}
                className="border border-primary rounded-md w-20 p-2"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </section>
      <button
        type="submit"
        className="border-2 border-primary py-1 px-1 w-36 text-primary mx-auto mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white font-Manrope font-semibold"
      >
        Save
      </button>
    </form>
  );
};

export default InputSectionCounts;
