import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ReadyButton = () => {
  const { department, setIsReady, isReady } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    const res = await fetch(
      `/schedule-api/schedule/ready/${department}`
    );

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setIsReady(true);
        localStorage.setItem("isReady", "true");
      } else {
        console.log("error with readying schedule");
      }
    } else {
      console.log("error with readying schedule");
    }

    closeModal();
  };

  useEffect(() => {
    if (isReady) {
      navigate("/departmentchair/ready-schedule");
    }
  }, [isReady, navigate]);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-primary text-white font-Manrope font-extrabold px-10 py-3 rounded-md"
      >
        Ready
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 shadow-md font-Manrope font-extrabold text-primary">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 font-Manrope">
              Confirm Ready Status
            </h2>
            <p className="mb-6 font-Manrope">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md font-Manrope font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary text-white rounded-md font-Manrope font-extrabold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReadyButton;
