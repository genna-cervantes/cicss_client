import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import cs_locked from "../assets/cs_locked.png";
import cs_unlocked from "../assets/cs_unlocked.png";

const UnlockButton = () => {
  const { department, setIsLocked } = useAppContext();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    const res = await fetch(
      `/schedule-api/schedule/unlock/${department}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data.success) {
        console.log("yeyy");
        setIsLocked(false);
        navigate("/departmentchair/view-schedule");
      } else {
        console.log("oh no may error sa pag unlock");
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <button
        onClick={() => handleClick()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex justify-center items-center transition-all duration-300"
      >
        <img
          src={isHovered ? cs_unlocked : cs_locked}
          alt={isHovered ? "Schedule will be unlocked" : "Unlock schedule"}
          className="w-[600px]"
        />
      </button>
    </div>
  );
};

export default UnlockButton;
