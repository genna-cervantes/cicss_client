import React from "react";
import Navbar from "../../components/Navbar";

const InputYLT = () => {
  return (
    <div className="h-screen flex flex-col">
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
    </div>
  );
};

export default InputYLT;
