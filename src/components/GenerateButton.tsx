import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
function GenerateButton() {

  const navigate = useNavigate()
  const [error, setError] = useState('');

  // calls the generate function
  const handleClick = async () => {
    navigate("/departmentchair/waiting", {state: {fromButton: true}})
  }

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <div>
      <div>
        <button
          onClick={handleClick}
          className="px-56 py-2.5 bg-secondary rounded-md font-Manrope font-bold text-[30px] text-white shadow-md hover:bg-primary"
        >
          Generate Schedule
        </button>
      </div>
    </div>
  );
}

export default GenerateButton;
