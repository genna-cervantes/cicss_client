import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
function GenerateViewButton({regenerate = false}: {regenerate?: boolean}) {

  const [scheduleExists, setScheduleExists] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // calls the generate function
  const handleClick = async () => {

    if (scheduleExists){
      navigate("/departmentchair/waiting?exists=true", {state: {fromButton: true, regenerate}})
    }else{
      navigate("/departmentchair/waiting", {state: {fromButton: true, regenerate}})

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
    <div>
      <div>
        <button
          onClick={handleClick}
          className="w-full px-56 py-2.5 bg-secondary rounded-md font-Manrope font-bold text-[30px] text-white shadow-md hover:bg-primary"
        >
          {regenerate ? "Regenerate Schedule" : scheduleExists ? "View Schedule" : "Generate Schedule"}
        </button>
      </div>
    </div>
  );
}

export default GenerateViewButton;
