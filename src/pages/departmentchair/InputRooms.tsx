import React, { useState, FormEvent } from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";

import add_button_white from "../../assets/add_button_white.png";
import trash_button from "../../assets/trash_button.png";

interface RoomInfo {
  roomCode: number;
  department: string;
  roomType: string;
}

interface Option {
  value: string;
  label: string;
}

const InputRooms = () => {
  //Dummy Options
  const roomCodes: Option[] = [
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

  const department: Option[] = [
    { value: "cs", label: "CS" },
    { value: "it", label: "IT" },
    { value: "is", label: "IS" },
  ];

  const roomType: Option[] = [
    { value: "lec", label: "Lec" },
    { value: "lab", label: "Lab" },
  ];

  // Array of Rooms
  const [rooms, setRooms] = useState<RoomInfo[]>([
    { roomCode: 0, department: "", roomType: "" },
  ]);

  // Update the roomCode for a specific form.
  const handleRoomCodeChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setRooms((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        roomCode: selectedOption
          ? Number(selectedOption.value)
          : updated[index].roomCode,
      };
      return updated;
    });
  };

  // Update the department for a specific form.
  const handleDepartmentChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setRooms((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        department: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  // Update the room type for a specific form.
  const handleRoomTypeChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setRooms((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        roomType: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  // Add a new form.
  const handleAddRoom = (e: FormEvent) => {
    e.preventDefault();
    setRooms((prev) => [
      ...prev,
      { roomCode: 0, department: "", roomType: "" },
    ]);
  };

  // Delete a specific form.
  const handleDeleteRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  // Save handler for demonstration (logs the rooms array).
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    rooms.forEach((room, index) => {
      console.log(`Room ${index + 1}`);
      console.log(` Code: ${room.roomCode}`);
      console.log(` Department: ${room.department}`);
      console.log(` Type: ${room.roomType}`);
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

      <form className="flex flex-col">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="flex gap-5 mx-auto font-Manrope font-semibold mb-7"
          >
            <div className="flex bg-[rgba(241,250,255,0.5)] rounded-xl shadow-md gap-16 p-10 items-center">
              <label className="block font-semibold mb-2">
                Room {index + 1}
              </label>
              <Select
                options={roomCodes}
                className="w-44"
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={
                  roomCodes.find(
                    (option) => Number(option.value) === room.roomCode
                  ) || null
                }
                onChange={(option) => handleRoomCodeChange(index, option)}
              />
              <Select
                options={department}
                className="w-44"
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={
                  department.find(
                    (option) => option.value === room.department
                  ) || null
                }
                onChange={(option) => handleDepartmentChange(index, option)}
              />
              <Select
                options={roomType}
                className="w-44"
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={
                  roomType.find((option) => option.value === room.roomType) ||
                  null
                }
                onChange={(option) => handleRoomTypeChange(index, option)}
              />
            </div>
            <button type="button" onClick={() => handleDeleteRoom(index)}>
              <img src={trash_button} alt="Delete" className="w-7" />
            </button>
          </div>
        ))}

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
              onClick={handleAddRoom}
              className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm"
            >
              Add
              <img src={add_button_white} className="w-4" alt="Add" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputRooms;
