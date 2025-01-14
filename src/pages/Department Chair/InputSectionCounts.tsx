import React from "react";
import Navbar from "../../components/Navbar";

const InputSectionCounts = () => {
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
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="0"
              className="border border-primary rounded-md w-20 p-2"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="0"
              className="border border-primary rounded-md w-20 p-2"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="0"
              className="border border-primary rounded-md w-20 p-2"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="0"
              className="border border-primary rounded-md w-20 p-2"
            />
          </div>
        </div>
      </section>
      <button className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mx-auto mt-20 mb-24">
        Save
      </button>
    </div>
  );
};

export default InputSectionCounts;
