import React, { useState, FormEvent, useEffect } from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import { v4 as uuidv4 } from "uuid";

import add_button_white from "../../assets/add_button_white.png";
import trash_button from "../../assets/trash_button.png";

interface RoomInfo {
  roomId: string;
  department: string;
  roomType: string;
}

interface Option {
  value: string;
  label: string;
}

const roomCodes: Option[] = [
  { value: "RM1801", label: "RM1801" },
  { value: "RM1805", label: "RM1805" },
  { value: "RM1806", label: "RM1806" },
  { value: "RM1807", label: "RM1807" },
  { value: "RM1808", label: "RM1808" },
  { value: "RM1901", label: "RM1901" },
  { value: "RM1902", label: "RM1902" },
  { value: "RM1903", label: "RM1903" },
  { value: "RM1904", label: "RM1904" },
  { value: "RM1905", label: "RM1905" },
  { value: "RM1906", label: "RM1906" },
  { value: "RM1907", label: "RM1907" },
  { value: "RM1908", label: "RM1908" },
  { value: "RM1909", label: "RM1909" },
  { value: "RM1910", label: "RM1910" },
  { value: "RM1911", label: "RM1911" },
  { value: "RM1912", label: "RM1912" },
  { value: "RM1913", label: "RM1913" },
];

const department: Option[] = [
  { value: "CS", label: "CS" },
  { value: "IT", label: "IT" },
  { value: "IS", label: "IS" },
];

const roomType: Option[] = [
  { value: "lec", label: "Lec" },
  { value: "lab", label: "Lab" },
];

const InputRooms = () => {
  // Array of Rooms
  const [rooms, setRooms] = useState<RoomInfo[]>([]);

  const [updatedRooms, setUpdatedRooms] = useState<
    { roomId: string; fields: string[] }[]
  >([]);
  const [insertedRooms, setInsertedRooms] = useState<string[]>([]);
  const [deletedRooms, setDeletedRooms] = useState<string[]>([]);

  useEffect(() => {
    console.log('updated', updatedRooms)
  }, [updatedRooms])

  useEffect(() => {
    console.log('inserted', insertedRooms)
  }, [insertedRooms])

  // Update the roomCode for a specific form.
  const handleRoomCodeChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    if (insertedRooms.find((r) => r === rooms[index].roomId)) {
      setInsertedRooms((prev) => [...prev, selectedOption ? selectedOption.value : rooms[index].roomId])
    }
    setRooms((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        roomId: selectedOption ? selectedOption.value : updated[index].roomId,
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
    if (!insertedRooms.find((r) => r === rooms[index].roomId)) {
      setUpdatedRooms((prev) => {
        return prev.some((item) => item.roomId === rooms[index].roomId)
          ? prev.map((item) =>
              item.roomId === rooms[index].roomId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "department"])],
                  }
                : item
            )
          : [...prev, { roomId: rooms[index].roomId, fields: ["department"] }];
      });
    }
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
    if (!insertedRooms.find((r) => r === rooms[index].roomId)) {
      setUpdatedRooms((prev) => {
        return prev.some((item) => item.roomId === rooms[index].roomId)
          ? prev.map((item) =>
              item.roomId === rooms[index].roomId
                ? {
                    ...item,
                    fields: [...new Set([...item.fields, "roomType"])],
                  }
                : item
            )
          : [...prev, { roomId: rooms[index].roomId, fields: ["roomType"] }];
      });
    }
  };

  // Add a new form.
  const handleAddRoom = (e: FormEvent) => {
    e.preventDefault();
    let tempId = uuidv4();
    setRooms((prev) => [...prev, { roomId: tempId, department: "", roomType: "" }]);
    setInsertedRooms((prev) => [...prev, tempId]);
  };

  // Delete a specific form.
  const handleDeleteRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
    setDeletedRooms((prev) => [...prev, rooms[index].roomId])
  };

  // Save handler for demonstration (logs the rooms array).
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    // rooms.forEach((room, index) => {
    //   console.log(`Room ${index + 1}`);
    //   console.log(` Code: ${room.roomId}`);
    //   console.log(` Department: ${room.department}`);
    //   console.log(` Type: ${room.roomType}`);
    // });

    // UPDATES
    for (let i = 0; i < updatedRooms.length; i++) {
      let updatedRoom: any = rooms.find(
        (r) => r.roomId === updatedRooms[i].roomId
      );

      if (!updatedRoom) {
        continue;
      }

      const reqObj: any = {
        roomId: updatedRoom.roomId,
      };

      for (let j = 0; j < updatedRooms[i].fields.length; j++) {
        let field = updatedRooms[i].fields[j];
        reqObj[field] = updatedRoom[field];
      }

      const res = await fetch("http://localhost:8080/rooms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
      });

      if (res.ok) {
        console.log("yeey ok");
      } else {
        const data = await res.json();
        console.log("error", data);
      }
    }

    // INSERTS
    for (let i = 0; i < insertedRooms.length; i++) {
      let insertedRoom = insertedRooms[i];

      if (!insertedRoom.startsWith("RM")) {
        continue;
      }

      if (rooms.filter((r) => r.roomId === insertedRoom).length > 1) {
        continue;
        // set error dito na bawal mag dupli ng room
      }

      let room = rooms.find((r) => r.roomId === insertedRoom);

      if (!room) {
        continue;
      }

      let reqObj = {
        roomId: insertedRoom,
        department: room.department,
        roomType: room.roomType,
      };

      const res = await fetch("http://localhost:8080/rooms", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(reqObj),
      });

      if (res.ok) {
        console.log("yeyy");
      } else {
        const data = await res.json();
        console.log("error", data);
      }
    }

    // DELETES
    for (let i = 0; i < deletedRooms.length; i++){
      const res = await fetch("http://localhost:8080/rooms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({roomId: deletedRooms[i]}),
      });

      if (res.ok) {
        console.log("yey ok"); // PLS CHANGE THIS TO MESSAGE KAHIT SA BABA NUNG BUTTONS LNG
      } else {
        const data = await res.json()
        console.log("nooo", data);
      }
    }
    
  };

  // CONNECTIONS TO DB
  useEffect(() => {
    const getRooms = async () => {
      const res = await fetch("http://localhost:8080/rooms/CS"); // MAKE DYNAMIC AH
      const data = await res.json();

      if (res.ok) {
        setRooms(data);
        console.log(data);
      } else {
        console.log("error", data);
      }
    };

    getRooms();
  }, []);

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
        {rooms.map((room, index) => {
          return (
            <div
              key={index}
              className="flex gap-5 mx-auto font-Manrope font-semibold mb-7"
            >
              <div className="flex bg-[rgba(241,250,255,0.5)] rounded-xl shadow-md gap-16 p-10 items-center">
                <label className="block font-semibold mb-2">
                  Room {index + 1}
                </label>
                <Select
                  isDisabled={room.roomId.startsWith("RM")}
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
                    roomCodes.find((option) => option.value === room.roomId) ||
                    null
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
          );
        })}

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
