import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import add_button_white from "../../assets/add_button_white.png";
import trash_button from "../../assets/trash_button.png";
import Select from "react-select";
import makeAnimated from "react-select/animated";

type OptionType = {
  value: string;
  label: string;
};

const InputRooms = () => {
  const [rooms, setRooms] = useState<
    {
      id: number;
      roomCode: string | null;
      department: string | null;
      roomType: string | null;
    }[]
  >([{ id: 1, roomCode: null, department: null, roomType: null }]);

  const animatedComponents = makeAnimated();
  const roomCodes: OptionType[] = [
    { value: "1903", label: "1903" },
    { value: "1904", label: "1904" },
    { value: "1905", label: "1905" },
    { value: "1906", label: "1906" },
    { value: "1907", label: "1907" },
    { value: "1908", label: "1908" },
    { value: "1909", label: "1909" },
    { value: "1910", label: "1910" },
    { value: "1911", label: "1911" },
    { value: "1912", label: "1912" },
    { value: "1913", label: "1913" },
  ];
  const department: OptionType[] = [
    { value: "cs", label: "CS" },
    { value: "it", label: "IT" },
    { value: "is", label: "IS" },
  ];
  const roomType: OptionType[] = [
    { value: "lec", label: "Lec" },
    { value: "lab", label: "Lab" },
  ];

  const addRoom = () => {
    setRooms((prevRooms) => [
      ...prevRooms,
      {
        id: prevRooms.length + 1,
        roomCode: null,
        department: null,
        roomType: null,
      },
    ]);
  };

  const deleteRoom = (id: number) => {
    setRooms((prevRooms) => {
      // Remove the room by ID
      const updatedRooms = prevRooms.filter((room) => room.id !== id);

      // Reassign IDs based on their new position in the array
      return updatedRooms.map((room, index) => ({
        ...room,
        id: index + 1, // Reassign id based on the new index
      }));
    });
  };

  const handleSelectChange = (
    id: number,
    field: string,
    value: string | null
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id ? { ...room, [field]: value } : room
      )
    );
  };

  const handleSave = () => {
    const results = rooms.map((room, index) => ({
      room: `Room ${index + 1}`,
      roomCode: room.roomCode || "Not Selected",
      department: room.department || "Not Selected",
      roomType: room.roomType || "Not Selected",
    }));

    console.log("Chosen Room Details:");
    results.forEach((result) => {
      console.log(
        `${result.room}: Room Code - ${result.roomCode}, Department - ${result.department}, Room Type - ${result.roomType}`
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">Rooms Constraints</div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>
      <section className="flex font-Manrope font-extrabold my-11 ml-[360px] gap-36">
        <div className="flex gap-28">
          <p>No.</p>
          <p>Room Code</p>
        </div>
        <div className="flex gap-44">
          <p>Department</p>
          <p>Type</p>
        </div>
      </section>
      <div className="flex flex-col">
        {rooms.map((room, index) => (
          <div
            key={room.id}
            className="flex gap-5 mx-auto font-Manrope font-semibold mb-7"
          >
            <div className="flex bg-[rgba(241,250,255,0.5)] rounded-xl shadow-md gap-16 p-10 items-center">
              <p>Room {room.id}</p>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={roomCodes}
                className="w-44"
                placeholder="Select"
                onChange={(selectedOption) =>
                  handleSelectChange(
                    room.id,
                    "roomCode",
                    (selectedOption as OptionType).value
                  )
                }
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
              />
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={department}
                className="w-44"
                placeholder="Select"
                onChange={(selectedOption) =>
                  handleSelectChange(
                    room.id,
                    "department",
                    (selectedOption as OptionType).value
                  )
                }
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
              />
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={roomType}
                className="w-44"
                placeholder="Select"
                onChange={(selectedOption) =>
                  handleSelectChange(
                    room.id,
                    "roomType",
                    (selectedOption as OptionType).value
                  )
                }
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
              />
            </div>
            <button className="w-7" onClick={() => deleteRoom(room.id)}>
              <img src={trash_button} alt="Delete" />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto flex gap-4">
        <div>
          <button
            onClick={handleSave}
            className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white"
          >
            Save
          </button>
        </div>
        <div>
          <button
            onClick={addRoom}
            className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm"
          >
            Add
            <img src={add_button_white} className="w-4" alt="Add" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputRooms;
