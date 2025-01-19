import { useState } from "react";
import Navbar from "../../components/Navbar";
import TASInputCard from "../../components/TASInputCard";
import add_button_white from "../../assets/add_button_white.png";

const InputTAS = () => {
  const [profNum, setProfNum] = useState(1);
  const [inputCards, setInputCards] = useState([{ id: 1 }]);
  const handleAddCard = () => {
    const nextProfNum = profNum + 1;
    setInputCards([...inputCards, { id: nextProfNum }]);
    setProfNum(nextProfNum);
  };
  const handleDeleteCard = (id: number) => {
    const updatedCards = inputCards.filter((card) => card.id !== id);
    const reassignedCards = updatedCards.map((card, index) => ({
      id: index + 1,
    }));
    setInputCards(reassignedCards);
    setProfNum(reassignedCards.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">Teaching Academic Staff</div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>
      <section className="mx-20 my-11">
        <div className="flex font-Manrope font-extrabold gap-80">
          <div className="flex gap-28">
            <div className="flex gap-16">
              <p>No.</p>
              <p>Professor Name</p>
            </div>
            <p>Status</p>
            <p>Specialties</p>
          </div>
          <p>Day and Time Restriction</p>
        </div>
      </section>
      <section className="flex flex-col mx-auto gap-5">
        {inputCards.map((card) => (
          <TASInputCard
            key={card.id}
            profNum={card.id}
            onDelete={() => handleDeleteCard(card.id)}
          />
        ))}
      </section>
      <div className="mx-auto flex gap-4">
        <div>
          <button className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm">
            Save
          </button>
        </div>
        <div>
          <button
            onClick={handleAddCard}
            className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm"
          >
            Add
            <img src={add_button_white} className="w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputTAS;
