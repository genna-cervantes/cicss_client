import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cs_readyy from "../../assets/cs_readyy.png";
import is_readyy from "../../assets/is_readyy.png";
import it_readyy from "../../assets/it_readyy.png";

const ReadyPage = () => {
  const [csReady, setCSReady] = useState(false);
  const [isReady, setISReady] = useState(false);
  const [itReady, setITReady] = useState(false);
  const [readyCount, setReadyCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReadyDepartments = async () => {
      const res = await fetch(
        "/schedule-api/schedule/ready/departments"
      );
      if (res.ok) {
        const data = await res.json();

        setCSReady(data.csReady);
        setISReady(data.isReady);
        setITReady(data.itReady);
      }
    };
    fetchReadyDepartments();
  }, []);

  useEffect(() => {
    // Calculate how many departments are ready
    const count = [csReady, isReady, itReady].filter(Boolean).length;
    setReadyCount(count);

    if (count === 3) {
      // navigate("/departmentchair/manual-edit");
    }
  }, [csReady, isReady, itReady]);

  const handleClick = () => {
    navigate("/departmentchair/manual-edit");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-52 mt-10">
        <div className="font-Helvetica-Neue-Heavy text-4xl text-primary mb-16">
          {readyCount}/3 departments are ready
        </div>
        <div className="flex justify-center">
          {csReady && <img src={cs_readyy} alt="" className="w-1/4" />}
          {itReady && <img src={it_readyy} alt="" className="w-1/4" />}
          {isReady && <img src={is_readyy} alt="" className="w-1/4" />}
        </div>

        {readyCount === 3 && (
          <button
            onClick={handleClick}
            className="bg-primary text-white font-Manrope font-extrabold px-4 py-2 rounded-md mt-16"
          >
            Go to manual editing
          </button>
        )}
      </div>
    </div>
  );
};

export default ReadyPage;
