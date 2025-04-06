import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cs_thumbnail from "../assets/cs_schedule_card.png";
import { cn } from "../utils/utils";

function GenerateButton({
  hasChanges = false,
  newSemester = false,
  regenerate = false,
  className = "",
}: {
  hasChanges?: boolean;
  newSemester?: boolean;
  regenerate?: boolean;
  className?: string;
}) {
  const [scheduleExists, setScheduleExists] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);

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

  const getButtonClassName = () => {
    if (regenerate) {
      return "bg-primary text-white font-Manrope font-extrabold px-4 py-2 rounded-md";
    } else if (scheduleExists && !regenerate) {
      return "w-full px-8 py-2.5 rounded-md font-Manrope font-bold flex items-center justify-center";
    } else {
      return "w-full px-56 py-2.5 bg-secondary rounded-md font-Manrope font-bold text-[30px] text-white shadow-md hover:bg-primary";
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleClick} className={getButtonClassName()}>
          {regenerate ? (
            <div className="flex items-center justify-center">
              <span>Regenerate Schedule</span>
            </div>
          ) : scheduleExists ? (
            <div className="flex items-center">
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src={cs_thumbnail}
                  alt="CS Schedule"
                  className={`h-72 w-[1000px] transition duration-300 ${
                    isHovered ? "opacity-75" : ""
                  }`}
                />

                {isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-white bg-primary p-4 rounded-md font-Manrope">
                      View Schedule
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            "Generate Schedule"
          )}
        </button>
      </div>
    </div>
  );
}

export default GenerateButton;
