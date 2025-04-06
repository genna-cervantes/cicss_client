import React, { useState } from "react";
import ViewSchedule from "../departmentchair/ViewSchedule";
import { generateRandomString } from "../../utils/utils";

const View = ({role}: {role: string}) => {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("3CSA");
  const [rating, setRating] = useState(3); // default 3 star rating
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const openFirstModal = () => {
    setIsFirstModalOpen(true);
    setIsSecondModalOpen(false);
    setIsRatingModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  const closeFirstModal = () => {
    setIsFirstModalOpen(false);
  };

  const openSecondModal = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
    setIsRatingModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  const openRatingModal = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setIsRatingModalOpen(true);
    setIsSuccessModalOpen(false);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const openSuccessModal = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setIsRatingModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleSectionChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedSection(e.target.value);
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmitRating = async () => {
    // get the data here

    console.log(rating)
    const reqObj = 
      {
        ratingId: generateRandomString(10),
        rating: rating,
        raterName: localStorage.getItem("email") ?? "No Name",
        raterSection: selectedSection,
        raterType: role
    }
    
    const res = await fetch('http://localhost:8080/ratings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token") ?? ""}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(reqObj)
    })

    if (res.ok){
      openSuccessModal();
      closeRatingModal();
    }else{
      console.log('error')
    }

  };

  const handleButtonMouseDown = () => {
    setIsButtonPressed(true);
  };

  const handleButtonMouseUp = () => {
    setIsButtonPressed(false);
  };

  const handleButtonClick = () => {
    setIsButtonPressed(true);

    setTimeout(() => {
      setIsButtonPressed(false);
      openFirstModal();
    }, 150);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
      {/*Put the schedule and the filter component here */}
      <ViewSchedule role={role} />

      <button
        type="button"
        onClick={handleButtonClick}
        onMouseDown={handleButtonMouseDown}
        onMouseUp={handleButtonMouseUp}
        onMouseLeave={() => setIsButtonPressed(false)}
        className={`bg-yellow-400 border-2 border-gray-700 text-gray-700 px-5 py-1 text-lg font-bold rounded-sm
                   transition-all duration-200 ease-in-out
                   hover:bg-yellow-500 hover:shadow-lg hover:scale-105
                   active:scale-95 active:shadow-inner
                   ${
                     isButtonPressed
                       ? "transform scale-95 shadow-inner"
                       : "transform scale-100"
                   }`}
      >
        Rate
      </button>

      {/* First Modal */}
      {isFirstModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 p-4 sm:p-8 rounded-2xl w-full max-w-md relative">
            <button
              onClick={closeFirstModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-700 text-2xl
                         transition-all duration-150 ease-in-out
                         hover:text-gray-900 hover:scale-110
                         active:scale-90"
            >
              ×
            </button>

            <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-primary mt-3 sm:mt-5">
                Select your current section.
              </h2>
              <p className="text-primary text-xs sm:text-sm">
                This will reflect on the Department Chair's record.
              </p>
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="relative">
                <select
                  className="w-full p-2 sm:p-3 border border-primary rounded bg-white text-gray-700 appearance-none font-bold text-sm sm:text-base"
                  value={selectedSection}
                  onChange={handleSectionChange}
                >
                  <option>3CSA</option>
                  <option>3CSB</option>
                  <option>3CSC</option>
                  <option>3CSD</option>
                  <option>3CSE</option>
                  <option>3CSF</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 sm:gap-4">
              <button
                onClick={closeFirstModal}
                className="border border-primary text-primary py-2 px-3 sm:px-6 rounded w-1/2 font-bold text-sm sm:text-base
                           transition-all duration-200 ease-in-out
                           hover:bg-gray-100 hover:shadow-sm
                           active:scale-95 active:shadow-inner"
              >
                Cancel
              </button>
              <button
                onClick={openSecondModal}
                className="bg-primary text-white py-2 px-3 sm:px-6 rounded w-1/2 flex justify-center items-center font-bold text-sm sm:text-base
                           transition-all duration-200 ease-in-out
                           hover:bg-blue-600 hover:shadow-lg
                           active:scale-95 active:shadow-inner"
              >
                Next <span className="ml-1 sm:ml-2">►</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal */}
      {isSecondModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 p-4 sm:p-8 rounded-2xl w-full max-w-md relative">
            <button
              onClick={closeSecondModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-700 text-2xl
                         transition-all duration-150 ease-in-out
                         hover:text-gray-900 hover:scale-110
                         active:scale-90"
            >
              ×
            </button>

            <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-3xl font-bold text-primary mt-3 sm:mt-5">
                Are you sure you have selected your correct section?
              </h2>
              <p className="text-primary text-xs sm:text-sm mt-2 sm:mt-4">
                This will reflect on the Department Chair's record.
              </p>
            </div>

            <div className="flex justify-between gap-2 sm:gap-4 mt-8 sm:mt-12">
              <button
                onClick={closeSecondModal}
                className="border border-primary text-primary py-2 px-3 sm:px-6 rounded w-1/2 font-bold text-sm sm:text-base
                           transition-all duration-200 ease-in-out
                           hover:bg-gray-100 hover:shadow-sm
                           active:scale-95 active:shadow-inner"
              >
                Cancel
              </button>
              <button
                onClick={openRatingModal}
                className="bg-primary text-white py-2 px-3 sm:px-6 rounded w-1/2 flex justify-center items-center font-bold text-sm sm:text-base
                           transition-all duration-200 ease-in-out
                           hover:bg-blue-600 hover:shadow-lg
                           active:scale-95 active:shadow-inner"
              >
                Next <span className="ml-1 sm:ml-2">►</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Third Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 p-4 sm:p-8 rounded-2xl w-full max-w-md relative">
            <button
              onClick={closeRatingModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-700 text-2xl
                         transition-all duration-150 ease-in-out
                         hover:text-gray-900 hover:scale-110
                         active:scale-90"
            >
              ×
            </button>

            <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-3xl font-bold text-primary mt-3 sm:mt-5">
                Let us know what you feel about the schedule.
              </h2>
              <p className="text-primary text-xs sm:text-sm mt-2 sm:mt-4">
                This will reflect on the Department Chair's record.
              </p>
            </div>

            <div className="flex justify-center space-x-2 sm:space-x-4 my-6 sm:my-12">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="focus:outline-none"
                >
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12"
                    fill={
                      star <= (hoveredRating || rating) ? "#FFD700" : "none"
                    }
                    stroke={
                      star <= (hoveredRating || rating) ? "#FFD700" : "#E5E7EB"
                    }
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              ))}
            </div>

            <div className="flex justify-between gap-2 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={closeRatingModal}
                className="border border-primary text-primary py-2 px-3 sm:px-6 rounded w-1/2 font-bold text-sm sm:text-base
                           transition-all duration-200 ease-in-out
                           hover:bg-gray-100 hover:shadow-sm
                           active:scale-95 active:shadow-inner"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="bg-primary text-white py-2 px-3 sm:px-6 rounded w-1/2 flex justify-center items-center font-bold text-sm sm:text-base
                           transition-all duration-200 ease-in-out
                           hover:bg-blue-600 hover:shadow-lg
                           active:scale-95 active:shadow-inner"
              >
                Submit <span className="ml-1 sm:ml-2">►</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 p-4 sm:p-8 rounded-2xl w-full max-w-md relative">
            <button
              onClick={closeSuccessModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-700 text-2xl
                         transition-all duration-150 ease-in-out
                         hover:text-gray-900 hover:scale-110
                         active:scale-90"
            >
              ×
            </button>

            <div className="text-center py-4 sm:py-8 space-y-2 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl font-bold text-primary">
                Successfully Submitted
              </h2>
              <p className="text-primary text-sm sm:text-lg">
                This will reflect on the Department Chair's record.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View;
