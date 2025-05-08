import React, { useState, FormEvent, useEffect } from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import { v4 as uuidv4 } from "uuid";

import add_button_white from "../../assets/add_button_white.png";
import trash_button from "../../assets/trash_button.png";
import ScrollButton from "../../components/ScrollButton";

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

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  useEffect(() => {
    console.log("updated", updatedRooms);
  }, [updatedRooms]);

  useEffect(() => {
    console.log("inserted", insertedRooms);
  }, [insertedRooms]);

  // Update the roomCode for a specific form.
  const handleRoomCodeChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    if (insertedRooms.find((r) => r === rooms[index].roomId)) {
      setInsertedRooms((prev) => [
        ...prev,
        selectedOption ? selectedOption.value : rooms[index].roomId,
      ]);
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
    setRooms((prev) => [
      ...prev,
      { roomId: tempId, department: "", roomType: "" },
    ]);
    setInsertedRooms((prev) => [...prev, tempId]);
  };

  // Delete a specific form.
  const handleDeleteRoom = (index: number) => {
    setRoomToDelete(index);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete !== null) {
      setRooms((prev) => prev.filter((_, i) => i !== roomToDelete));
      setDeletedRooms((prev) => [...prev, rooms[roomToDelete].roomId]);
      setShowDeleteModal(false);
      setRoomToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

  // Save handler for demonstration (logs the rooms array).
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true");

    try {
      let isSuccess = false;
      let apiErrors: string[] = [];

      // UPDATES
      if (updatedRooms.length > 0) {
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

          try {
            console.log("Sending PUT request:", reqObj);
            const res = await fetch("http://localhost:8080/rooms", {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reqObj),
            });

            console.log("Update response status:", res.status);

            if (res.ok) {
              isSuccess = true;
            } else {
              const data = await res.json();
              console.log("error", data);
              apiErrors.push(
                `Failed to update room ${updatedRoom.roomId}: ${
                  data.message || "Unknown error"
                }`
              );
            }
          } catch (error) {
            console.error("Update fetch error:", error);
            apiErrors.push(`Network error updating room ${updatedRoom.roomId}`);
          }
        }
      }

      // INSERTS
      if (insertedRooms.length > 0) {
        for (let i = 0; i < insertedRooms.length; i++) {
          let insertedRoom = insertedRooms[i];

          if (!insertedRoom.startsWith("RM")) {
            continue;
          }

          if (rooms.filter((r) => r.roomId === insertedRoom).length > 1) {
            apiErrors.push(`Duplicate room ID: ${insertedRoom}`);
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

          try {
            console.log("Sending POST request:", reqObj);
            const res = await fetch("http://localhost:8080/rooms", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(reqObj),
            });

            console.log("Insert response status:", res.status);

            if (res.ok) {
              isSuccess = true;
            } else {
              const data = await res.json();
              console.log("error", data);
              apiErrors.push(
                `Failed to add room ${insertedRoom}: ${
                  data.message || "Unknown error"
                }`
              );
            }
          } catch (error) {
            console.error("Insert fetch error:", error);
            apiErrors.push(`Network error adding room ${insertedRoom}`);
          }
        }
      }

      // DELETES
      if (deletedRooms.length > 0) {
        for (let i = 0; i < deletedRooms.length; i++) {
          try {
            console.log("Sending DELETE request for:", deletedRooms[i]);
            const res = await fetch("http://localhost:8080/rooms", {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ roomId: deletedRooms[i] }),
            });

            console.log("Delete response status:", res.status);

            if (res.ok) {
              isSuccess = true;
            } else {
              const data = await res.json();
              console.log("nooo", data);
              apiErrors.push(
                `Failed to delete room ${deletedRooms[i]}: ${
                  data.message || "Unknown error"
                }`
              );
            }
          } catch (error) {
            console.error("Delete fetch error:", error);
            apiErrors.push(`Network error deleting room ${deletedRooms[i]}`);
          }
        }
      }

      // Set final status message
      if (apiErrors.length > 0) {
        setStatusMessage({
          type: "error",
          text: apiErrors[0], // Show first error or join multiple errors
        });
      } else if (isSuccess) {
        setStatusMessage({
          type: "success",
          text: "Room data successfully saved!",
        });
      } else if (
        updatedRooms.length === 0 &&
        insertedRooms.length === 0 &&
        deletedRooms.length === 0
      ) {
        // No operations were performed
        setStatusMessage({
          type: "error",
          text: "No changes to save.",
        });
      }
    } catch (error) {
      console.error("Error saving rooms:", error);
      setStatusMessage({
        type: "error",
        text: "An error occurred while saving. Please try again.",
      });
    }
  };

  // CONNECTIONS TO DB
  useEffect(() => {
    const getRooms = async () => {
      const department = localStorage.getItem("department") ?? "CS";
      const res = await fetch(`http://localhost:8080/rooms/${department}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      }); // MAKE DYNAMIC AH
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
    <>
      {/* Mobile/Small screen warning */}
      <div className="sm:hidden flex flex-col items-center justify-center h-screen mx-5">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Limited Access
          </h2>
          <p className="text-gray-600 mb-6">
            This page is optimized for laptop or desktop use. Please open it
            <br />
            on a larger screen for the best experience.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="hidden min-h-screen sm:flex flex-col">
        <div className="mx-auto py-10">
          <ScrollButton />
          <Navbar />
        </div>
        <section className="px-4 md:px-16 flex flex-col md:flex-row gap-4  font-Helvetica-Neue-Heavy items-center justify-center">
          <div className="text-primary mt-5 text-[28px] md:text-[35px] text-center md:text-left">
            Rooms Constraints
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <form className="flex flex-col">
          {rooms.map((room, index) => {
            return (
              <div
                key={index}
                className="flex gap-5 mx-auto font-Manrope font-semibold mb-3 mt-4"
              >
                <div className=" bg-[rgba(241,250,255,0.5)] rounded-xl shadow-md p-6 space-y-2">
                  <div className="flex font-Manrope font-bold text-primary">
                    <div className="ml-4 mr-5">No.</div>
                    <div className="ml-20 mr-16">Code</div>
                    <div className="ml-14">Department</div>
                    <div className="ml-28">Type</div>
                  </div>
                  <div className="flex gap-10 items-center">
                    <label className="block font-semibold mb-2">
                      Room {index + 1}
                    </label>
                    <Select
                      isDisabled={room.roomId.startsWith("RM")}
                      options={roomCodes}
                      className="w-36"
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
                          (option) => option.value === room.roomId
                        ) || null
                      }
                      onChange={(option) => handleRoomCodeChange(index, option)}
                    />
                    <Select
                      options={department}
                      className="w-36"
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
                      onChange={(option) =>
                        handleDepartmentChange(index, option)
                      }
                    />
                    <Select
                      options={roomType}
                      className="w-36"
                      placeholder="Select"
                      styles={{
                        control: (provided: any) => ({
                          ...provided,
                          border: "1px solid #02296D",
                          borderRadius: "6px",
                        }),
                      }}
                      value={
                        roomType.find(
                          (option) => option.value === room.roomType
                        ) || null
                      }
                      onChange={(option) => handleRoomTypeChange(index, option)}
                    />
                  </div>
                </div>
                <button type="button" onClick={() => handleDeleteRoom(index)}>
                  <img
                    src={trash_button}
                    alt="Delete"
                    className="w-7 transition-all duration-300 active:scale-95 active:shadow-lg"
                  />
                </button>
              </div>
            );
          })}

          <div className="flex flex-col">
            {statusMessage.type && (
              <div
                className={`mx-auto  mt-6 p-3 rounded-md text-center font-medium flex justify-between items-center ${
                  statusMessage.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                <span className="flex-grow">{statusMessage.text}</span>
                <button
                  onClick={clearStatusMessage}
                  className="text-gray-600 hover:text-gray-900 ml-5 flex items-center"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}

            <div className="mx-auto flex gap-4">
              <div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                >
                  Save
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="flex justify-center items-center gap-2 border-2 border-primary bg-primary text-white py-1 px-1 w-36 font-semibold mt-20 mb-24 rounded-sm transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                >
                  Add
                  <img src={add_button_white} className="w-4" alt="Add" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6">Are you sure you want to delete?</p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputRooms;
