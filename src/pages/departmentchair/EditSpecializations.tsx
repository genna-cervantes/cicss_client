import { useState, useEffect } from "react";
import add_button_white from "../../assets/add_button_white.png";
import trash_button from "../../assets/trash_button.png";

// Interface for the Program model
interface Program {
  id: number;
  programName: string;
  specializations: string[] | null;
  noYears?: number;
  dcEmail?: string;
}

const EditSpecializations = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // For new specialization inputs
  const [newSpecs, setNewSpecs] = useState<{ [key: number]: string }>({});
  
  // Fetch all programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);
  
  // Function to fetch all programs
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/programs", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            "Content-type": "application/json",
          },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: Program[] = await response.json();
      setPrograms(data);
      
      // Initialize newSpecs state with empty strings for each program
      const initialNewSpecs = data.reduce((acc, program) => {
        acc[program.id] = "";
        return acc;
      }, {} as { [key: number]: string });
      
      setNewSpecs(initialNewSpecs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch programs. Please try again later.");
      console.error("Failed to fetch programs:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to add a specialization
  const handleAddSpecialization = async (programId: number) => {
    const newSpec = newSpecs[programId]?.trim();
    if (!newSpec) return;
    
    try {
      const response = await fetch(`/api/programs/${programId}/specializations`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain", // Changed to text/plain
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          
        },
        body: newSpec, // Send plain text instead of JSON
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const updatedProgram: Program = await response.json();
      
      // Update the programs state with the updated program
      setPrograms(prevPrograms => 
        prevPrograms.map(prog => 
          prog.id === programId ? updatedProgram : prog
        )
      );
      
      // Clear the input field
      setNewSpecs(prev => ({ ...prev, [programId]: "" }));
    } catch (err) {
      setError("Failed to add specialization. Please try again.");
      console.error("Failed to add specialization:", err);
    }
  };
  
  // Function to remove a specialization
  const handleRemoveSpecialization = async (programId: number, specialization: string) => {
    try {
      const response = await fetch(`/api/programs/${programId}/specializations/${encodeURIComponent(specialization)}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            "Content-type": "application/json",
          },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const updatedProgram: Program = await response.json();
      
      // Update the programs state with the updated program
      setPrograms(prevPrograms => 
        prevPrograms.map(prog => 
          prog.id === programId ? updatedProgram : prog
        )
      );
    } catch (err) {
      setError("Failed to remove specialization. Please try again.");
      console.error("Failed to remove specialization:", err);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading programs...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
        <button 
          onClick={fetchPrograms}
          className="ml-4 bg-primary text-white px-4 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full flex items-center justify-center flex-col py-12">
      <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-md p-6 space-y-6 w-[80%]">
        <div className="grid grid-cols-2 gap-3 items-center font-bold text-primary text-lg">
          <div>Program Name</div>
          <div>Specializations</div>
        </div>
        
        {programs.map((program) => (
          <div key={program.id} className="grid grid-cols-2 gap-10 items-start">
            <div className="font-bold text-primary mt-2">{program.programName}</div>
            <div className="flex flex-col gap-2">
              {program.specializations && program.specializations.map((spec, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <span className="bg-white border px-2 py-1 rounded w-full">{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialization(program.id, spec)}
                    className="w-6"
                  >
                    <img src={trash_button} alt="Remove" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newSpecs[program.id] || ""}
                  onChange={(e) =>
                    setNewSpecs((prev) => ({
                      ...prev,
                      [program.id]: e.target.value,
                    }))
                  }
                  placeholder="New specialization"
                  className="border px-2 py-1 rounded w-full"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSpecialization(program.id);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSpecialization(program.id)}
                  className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-90 transition flex items-center gap-2"
                >
                  Add
                  <img src={add_button_white} className="w-4 mr-1" alt="Add" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditSpecializations;