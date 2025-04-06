import React from "react";
import { useNavigate } from "react-router-dom";
import cs_schedule_card from "../../assets/cs_schedule_card.png";
import wave from "../../assets/wave.png";

const TASDashboard = () => {
  const userName = "Chappel Roan";

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/tas/view");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center mt-10 md:mt-20 space-y-8 md:space-y-10">
        <div className="flex items-center gap-3 md:gap-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-Helvetica-Neue-Heavy">
            <span className="text-primary">Hello, </span>
            <span className="text-secondary">{userName}</span>
          </h1>
          <img
            src={wave}
            alt="Wave emoji"
            className="w-10 h-10 md:w-12 md:h-12"
          />
        </div>

        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl">
          <button
            onClick={handleCardClick}
            className="w-full transition-transform hover:scale-105 focus:outline-none"
          >
            <img
              src={cs_schedule_card}
              alt="CS Schedule Card"
              className="w-full h-auto"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TASDashboard;
