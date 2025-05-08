import React, { useState } from "react";
import add_button_white from "../../assets/add_button_white.png";
import trash_button from "../../assets/trash_button.png";

const programNames = ["Computer Science", "Information Technology", "Information Systems"];

const initialSpecializations: { [key: string]: string[] } = {
  "Computer Science": ["Core Computer Science", "Game Development", "Data Science"],
  "Information Technology": ["Web Dev", "Network and Security", "IT Automation"],
  "Information Systems": ["Business Analytics", "Service Management"],
};

const EditSpecializations = () => {
    const [specializations, setSpecializations] = useState(initialSpecializations);
  
    const [newSpecs, setNewSpecs] = useState<{ [key: string]: string }>(() =>
      programNames.reduce((acc, name) => {
        acc[name] = "";
        return acc;
      }, {} as { [key: string]: string })
    );
  
    const handleAddSpecialization = (program: string) => {
      const newSpec = newSpecs[program].trim();
      if (!newSpec) return;
      setSpecializations((prev) => ({
        ...prev,
        [program]: [...prev[program], newSpec],
      }));
      setNewSpecs((prev) => ({ ...prev, [program]: "" }));
    };
  
    const handleRemoveSpecialization = (program: string, index: number) => {
      setSpecializations((prev) => {
        const updated = [...prev[program]];
        updated.splice(index, 1);
        return { ...prev, [program]: updated };
      });
    };
  
    const handleSave = () => {
      console.log("Saved specializations:", specializations);
      alert("Specializations saved!");
    };
  
    return (
      <div className="w-full flex items-center justify-center flex-col py-12">
        <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-md p-6 space-y-6 w-[80%]">
          <div className="grid grid-cols-2 gap-3 items-center font-bold text-primary text-lg">
            <div>Program Name</div>
            <div>Specializations</div>
          </div>
  
          {programNames.map((program) => (
            <div key={program} className="grid grid-cols-2 gap-10 items-start">
              <div className="font-bold text-primary mt-2">{program}</div>
              <div className="flex flex-col gap-2">
                {specializations[program]?.map((spec, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <span className="bg-white border px-2 py-1 rounded w-full">{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(program, index)}
                      className="w-6"
                    >
                      <img src={trash_button} alt="Remove" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newSpecs[program]}
                    onChange={(e) =>
                      setNewSpecs((prev) => ({
                        ...prev,
                        [program]: e.target.value,
                      }))
                    }
                    placeholder="New specialization"
                    className="border px-2 py-1 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSpecialization(program)}
                    className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-90 transition flex items-center gap-2"
                  >
                    Add
                    <img src={add_button_white} className="w-4 mr-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <button
          onClick={handleSave}
          className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-10 mb-8 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
        >
          Save
        </button>
      </div>
    );
  };
  
  export default EditSpecializations;