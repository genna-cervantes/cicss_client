import React, { useState } from "react";
import add_button_white from "../../assets/add_button_white.png";
import trash_button from "../../assets/trash_button.png";

const EditPrograms = () => {
  const [programs, setPrograms] = useState<
    { name: string; years: number; depchair: string }[]
  >([
    {
      name: "Computer Science",
      years: 4,
      depchair: "genna.cervantes.cics@ust.edu.ph",
    },
    {
      name: "Information Technology",
      years: 4,
      depchair: "genna.cervantes.cics@ust.edu.ph",
    },
    {
      name: "Information Systems",
      years: 4,
      depchair: "genna.cervantes.cics@ust.edu.ph",
    },
  ]);

  const handleChange = (
    index: number,
    field: "name" | "years" | "depchair",
    value: string
  ) => {
    const updated = [...programs];
    if (field === "years") {
      updated[index][field] = parseInt(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setPrograms(updated);
  };

  const handleAdd = () => {
    setPrograms((prev) => [
      ...prev,
      { name: "Program Name", years: 4, depchair: "" },
    ]);
  };

  const handleDelete = (index: number) => {
    const updated = [...programs];
    updated.splice(index, 1);
    setPrograms(updated);
  };

  const handleSave = () => {
    console.log("Saved programs:", programs);
    alert("Programs saved!");
  };

  return (
    <div className="w-full flex items-center justify-center h-[600px] flex-col">
      <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-md p-6 space-y-2 w-[80%] overflow-y-auto max-h-[500px]">
        <div className="grid grid-cols-3 gap-3 items-center mb-4 font-bold text-primary text-lg">
          <div>Program Name</div>
          <div>No. of Years</div>
          <div>Department Chair Email</div>
        </div>
        <div className="flex flex-col gap-y-4">
          {programs.map((program, index) => (
            <div className="flex" key={index}>
              <div className="grid grid-cols-3 gap-10 items-center mb-2 flex-1">
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="bg-transparent border px-2 py-1 rounded w-full"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={program.years}
                    onChange={(e) => handleChange(index, "years", e.target.value)}
                    className="w-16 bg-transparent border px-2 py-1 rounded"
                  />
                  <span>Years</span>
                </div>
                <input
                  type="text"
                  value={program.depchair}
                  onChange={(e) => handleChange(index, "depchair", e.target.value)}
                  className="bg-transparent border px-2 py-1 rounded w-full"
                />
              </div>
              <button type="button" className="w-7" onClick={() => handleDelete(index)}>
                <img src={trash_button} alt="Remove" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="justify-center flex gap-4 font-Manrope font-semibold">
        <button
          onClick={handleSave}
          className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
        >
          Save
        </button>
        <button
          onClick={handleAdd}
          className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm transition-all duration-300 active:scale-95"
        >
          Add
          <img src={add_button_white} className="w-4" />
        </button>
      </div>
    </div>
  );
};

export default EditPrograms;
