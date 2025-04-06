import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/utils";

function GenerateViewButton({ hasChanges = false, newSemester = false, regenerate = false, className = "" }: { hasChanges?: boolean, newSemester?: boolean, regenerate?: boolean, className?: string }) {
  const [scheduleExists, setScheduleExists] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // calls the generate function
  const handleClick = async () => {
    if (scheduleExists && !newSemester && !hasChanges) {
      console.log("schedule exists");
      navigate("/departmentchair/waiting?exists=true", {
        state: { fromButton: true, regenerate },
      });
    } else {
      console.log("schedule not exists");

      navigate("/departmentchair/waiting", {
        state: { fromButton: true, regenerate },
      });
    }
  };

  useEffect(() => {
    const checkIfScheduleExists = async () => {
      const res = await fetch("http://localhost:3000/schedule/class/CS/1/CSA", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          "Content-type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        setScheduleExists(true);
      }
    };

    checkIfScheduleExists();
  }, []);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <button
      onClick={handleClick}
      className={cn("w-full bg-secondary rounded-md font-Manrope font-bold text-white shadow-md hover:bg-primary", className)}
    >
      {regenerate
        ? "Regenerate Schedule"
        : scheduleExists && !newSemester && !hasChanges
          ? "View Schedule"
          : "Generate Schedule"}
    </button>
  );
}

export default GenerateViewButton;
