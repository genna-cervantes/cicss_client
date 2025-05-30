import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Navbar from "../../components/Navbar";

interface SectionCounts {
  firstSC: number | "";
  secondSC: number | "";
  thirdSC: number | "";
  fourthSC: number | "";
}

const InputSectionCounts: React.FC = () => {
  const [sectionCounts, setSectionCounts] = useState<SectionCounts>({
    firstSC: "",
    secondSC: "",
    thirdSC: "",
    fourthSC: "",
  });

  const [firstYearSections, setFirstYearSections] = useState<
    { section: string; specialization: "none" }[]
  >([]);
  const [secondYearSections, setSecondYearSections] = useState<
    { section: string; specialization: "none" }[]
  >([]);
  const [thirdYearSections, setThirdYearSections] = useState<
    { section: string; specialization: string }[]
  >([]);
  const [fourthYearSections, setFourthYearSections] = useState<
    { section: string; specialization: string }[]
  >([]);

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Add state for status message
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const handleSectionCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseInt(value, 10) : "";

    if (numValue === "" || (numValue >= 1 && numValue <= 20)) {
      setSectionCounts((prevCounts) => ({
        ...prevCounts,
        [name]: numValue,
      }));

      if (numValue !== "") {
        setValidationErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  // fetch data
  useEffect(() => {
    const fetchYearSectionsData = async () => {
      const department = localStorage.getItem("department") ?? "CS";
      const res = await fetch(
        `/api/year_sections/${department}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setSectionCounts({
          firstSC: data.firstYearSections.length,
          secondSC: data.secondYearSections.length,
          thirdSC: data.thirdYearSections.length,
          fourthSC: data.fourthYearSections.length,
        });
        setFirstYearSections(data.firstYearSections);
        setSecondYearSections(data.secondYearSections);
        setThirdYearSections(data.thirdYearSections);
        setFourthYearSections(data.fourthYearSections);
      } else {
        console.log("error with fetching data", data);
        setStatusMessage({
          type: "error",
          text: "Failed to load section data",
        });
      }
    };

    fetchYearSectionsData();
  }, []);

  // Validate that all section counts have values
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (sectionCounts.firstSC === "") {
      errors.firstSC = "First year section count is required";
    }

    if (sectionCounts.secondSC === "") {
      errors.secondSC = "Second year section count is required";
    }

    if (sectionCounts.thirdSC === "") {
      errors.thirdSC = "Third year section count is required";
    }

    if (sectionCounts.fourthSC === "") {
      errors.fourthSC = "Fourth year section count is required";
    }

    firstYearSections.forEach((sec) => {
      if (sec.section.trim() === "") {
        errors.firstSC = "First year section is required";
      }
    });
    secondYearSections.forEach((sec) => {
      if (sec.section.trim() === "") {
        errors.secondSC = "Second year section is required";
      }
    });
    thirdYearSections.forEach((sec) => {
      if (sec.section.trim() === "") {
        errors.thirdCS = "Third year section is required";
      }
    });
    fourthYearSections.forEach((sec) => {
      if (sec.section.trim() === "") {
        errors.firstSC = "Fourth year section is required";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true");

    setStatusMessage({ type: null, text: "" });

    if (!validateForm()) {
      setStatusMessage({
        type: "error",
        text: "Please fix validation errors before saving",
      });
      return;
    }

    // inserts
    console.log("Submitted section counts:", sectionCounts);

    let reqBody = {
      department: "CS",
      semester: 2,
      1: firstYearSections,
      2: secondYearSections,
      3: thirdYearSections,
      4: fourthYearSections,
    };

    console.log(reqBody);

    try {
      const res = await fetch("/api/year_sections", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      if (res.ok) {
        console.log("Successfully Added");
        setStatusMessage({
          type: "success",
          text: "Sections successfully saved!",
        });
      } else {
        console.log("Unable to Add");
        setStatusMessage({
          type: "error",
          text: "Failed to save sections. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error saving sections:", error);
      setStatusMessage({
        type: "error",
        text: "An error occurred while saving. Please check your connection and try again.",
      });
    }
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    yearIndex: number; // 1, 2, 3, or 4 for year
    sectionIndex: number;
  }>({
    isOpen: false,
    yearIndex: 0,
    sectionIndex: -1,
  });

  const DeleteConfirmationDialog = () => {
    if (!deleteConfirmation.isOpen) return null;

    const handleConfirmDelete = () => {
      // Perform the actual deletion based on the year
      switch (deleteConfirmation.yearIndex) {
        case 1:
          deleteFirstYearSection(deleteConfirmation.sectionIndex);
          break;
        case 2:
          deleteSecondYearSection(deleteConfirmation.sectionIndex);
          break;
        case 3:
          deleteThirdYearSection(deleteConfirmation.sectionIndex);
          break;
        case 4:
          deleteFourthYearSection(deleteConfirmation.sectionIndex);
          break;
      }
      // Close the dialog
      setDeleteConfirmation({ isOpen: false, yearIndex: 0, sectionIndex: -1 });
    };

    const handleCancelDelete = () => {
      setDeleteConfirmation({ isOpen: false, yearIndex: 0, sectionIndex: -1 });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-md">
          <h3 className="text-lg font-bold text-primary mb-4">
            Confirm Deletion
          </h3>
          <p className="mb-6">Are you sure you want to delete this section?</p>
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
    );
  };

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const deleteFirstYearSection = (index: number) => {
    setFirstYearSections((prev) => prev.filter((_, i) => i !== index));
    setSectionCounts((prev) => ({
      ...prev,
      firstSC:
        typeof prev.firstSC === "number" ? prev.firstSC - 1 : prev.firstSC,
    }));
  };

  const deleteSecondYearSection = (index: number) => {
    setSecondYearSections((prev) => prev.filter((_, i) => i !== index));
    setSectionCounts((prev) => ({
      ...prev,
      secondSC:
        typeof prev.secondSC === "number" ? prev.secondSC - 1 : prev.secondSC,
    }));
  };

  const deleteThirdYearSection = (index: number) => {
    setThirdYearSections((prev) => prev.filter((_, i) => i !== index));
    setSectionCounts((prev) => ({
      ...prev,
      thirdSC:
        typeof prev.thirdSC === "number" ? prev.thirdSC - 1 : prev.thirdSC,
    }));
  };

  const deleteFourthYearSection = (index: number) => {
    setFourthYearSections((prev) => prev.filter((_, i) => i !== index));
    setSectionCounts((prev) => ({
      ...prev,
      fourthSC:
        typeof prev.fourthSC === "number" ? prev.fourthSC - 1 : prev.fourthSC,
    }));
  };

  const initiateDeleteFirstYearSection = (index: number) => {
    setDeleteConfirmation({ isOpen: true, yearIndex: 1, sectionIndex: index });
  };

  const initiateDeleteSecondYearSection = (index: number) => {
    setDeleteConfirmation({ isOpen: true, yearIndex: 2, sectionIndex: index });
  };

  const initiateDeleteThirdYearSection = (index: number) => {
    setDeleteConfirmation({ isOpen: true, yearIndex: 3, sectionIndex: index });
  };

  const initiateDeleteFourthYearSection = (index: number) => {
    setDeleteConfirmation({ isOpen: true, yearIndex: 4, sectionIndex: index });
  };

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
      <form onSubmit={handleSave} className="hidden sm:flex flex-col">
        <div className="mx-auto py-10">
          <Navbar />
        </div>
        <section className="px-8 md:px-16 flex flex-col md:flex-row gap-4 md:gap-11 font-Helvetica-Neue-Heavy items-center justify-center text-center md:text-left">
          <div className="text-primary mt-5 text-[30px] md:text-[35px]">
            Section Counts
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <section className="flex justify-center font-Manrope font-semibold mt-6 w-full mb-5">
          <div className="space-y-10">
            {/* Upper */}
            <div className="flex flex-col lg:flex-row lg:space-x-10 space-y-10 lg:space-y-0">
              {/* First Year */}
              <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)] p-7 w-full lg:w-6/12 ">
                <div className="font-bold text-primary mb-4">First Year</div>
                <div className="flex gap-5 w-full">
                  <div className="space-y-2 w-20 flex flex-col items-center">
                    <div className="text-xs text-center whitespace-nowrap">
                      No. of Sections
                    </div>
                    <input
                      type="number"
                      id="firstSC"
                      name="firstSC"
                      value={sectionCounts.firstSC}
                      onChange={handleSectionCountChange}
                      className={`border ${
                        validationErrors.firstSC
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-md w-20 p-2`}
                      placeholder="1"
                      min="1"
                      max="20"
                      onKeyDown={(e) => {
                        if (e.key === "-") {
                          e.preventDefault();
                        }
                      }}
                    />
                    {validationErrors.firstSC && (
                      <div className="text-red-500 text-xs text-center">
                        {validationErrors.firstSC}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-64">
                    <div className="flex">
                      <div className="text-xs ml-4 mr-6">Section</div>
                      <div className="text-xs ml-10">Specialization</div>
                    </div>
                    {typeof sectionCounts.firstSC == "number" &&
                      sectionCounts.firstSC > 0 &&
                      Array.from({ length: sectionCounts.firstSC }).map(
                        (_, i) => {
                          firstYearSections[i] = {
                            ...firstYearSections[i],
                            specialization: "none",
                          };
                          return (
                            <div
                              key={i}
                              className="flex space-x-5 items-center"
                            >
                              <input
                                type="text"
                                className="border border-primary rounded-md w-20 p-2"
                                value={firstYearSections[i]?.section ?? ""}
                                onChange={(e) =>
                                  setFirstYearSections((prev) => {
                                    const newSections = [...prev];
                                    newSections[i] = {
                                      specialization: "none",
                                      section: e.target.value,
                                    };
                                    return newSections;
                                  })
                                }
                              />
                              <input
                                type="text"
                                className="border border-primary rounded-md w-32 p-2"
                                placeholder="Not Applicable"
                                disabled
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  initiateDeleteFirstYearSection(i)
                                }
                                className="text-primary hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
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
                          );
                        }
                      )}
                  </div>
                </div>
              </div>

              {/* Second Year */}
              <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)] p-7 w-full lg:w-6/12">
                <div className="font-bold text-primary mb-4">Second Year</div>
                <div className="flex gap-5 w-full">
                  <div className="space-y-2 w-20 flex flex-col items-center">
                    <div className="text-xs text-center whitespace-nowrap">
                      No. of Sections
                    </div>
                    <input
                      type="number"
                      id="secondSC"
                      name="secondSC"
                      value={sectionCounts.secondSC}
                      onChange={handleSectionCountChange}
                      className={`border ${
                        validationErrors.secondSC
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-md w-20 p-2`}
                      placeholder="1"
                      min="1"
                      max="20"
                      onKeyDown={(e) => {
                        if (e.key === "-") {
                          e.preventDefault();
                        }
                      }}
                    />
                    {validationErrors.secondSC && (
                      <div className="text-red-500 text-xs text-center">
                        {validationErrors.secondSC}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-64">
                    <div className="flex">
                      <div className="text-xs ml-4 mr-6">Section</div>
                      <div className="text-xs ml-10">Specialization</div>
                    </div>
                    {typeof sectionCounts.secondSC == "number" &&
                      sectionCounts.secondSC > 0 &&
                      Array.from({ length: sectionCounts.secondSC }).map(
                        (_, i) => {
                          secondYearSections[i] = {
                            ...secondYearSections[i],
                            specialization: "none",
                          };
                          return (
                            <div
                              key={i}
                              className="flex space-x-5 items-center"
                            >
                              <input
                                type="text"
                                className="border border-primary rounded-md w-20 p-2"
                                value={secondYearSections[i]?.section ?? ""}
                                onChange={(e) =>
                                  setSecondYearSections((prev) => {
                                    const newSections = [...prev];
                                    newSections[i] = {
                                      specialization: "none",
                                      section: e.target.value,
                                    };
                                    return newSections;
                                  })
                                }
                              />
                              <input
                                type="text"
                                className="border border-primary rounded-md w-32 p-2"
                                placeholder="Not Applicable"
                                disabled
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  initiateDeleteSecondYearSection(i)
                                }
                                className="text-primary hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
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
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lower */}
            <div className="flex flex-col lg:flex-row lg:space-x-10 space-y-10 lg:space-y-0">
              {/* Third Year */}
              <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)] p-7 w-full lg:w-6/12">
                <div className="font-bold text-primary mb-4">Third Year</div>
                <div className="flex gap-5 w-full">
                  <div className="space-y-2 w-20 flex flex-col items-center">
                    <div className="text-xs text-center whitespace-nowrap">
                      No. of Sections
                    </div>
                    <input
                      type="number"
                      id="thirdSC"
                      name="thirdSC"
                      value={sectionCounts.thirdSC}
                      onChange={handleSectionCountChange}
                      className={`border ${
                        validationErrors.thirdSC
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-md w-20 p-2`}
                      placeholder="1"
                      min="1"
                      max="20"
                      onKeyDown={(e) => {
                        if (e.key === "-") {
                          e.preventDefault();
                        }
                      }}
                    />
                    {validationErrors.thirdSC && (
                      <div className="text-red-500 text-xs text-center">
                        {validationErrors.thirdSC}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-64">
                    <div className="flex">
                      <div className="text-xs ml-4 mr-5">Section</div>
                      <div className="text-xs ml-10">Specialization</div>
                    </div>
                    {typeof sectionCounts.thirdSC == "number" &&
                      sectionCounts.thirdSC > 0 &&
                      Array.from({ length: sectionCounts.thirdSC }).map(
                        (_, i) => {
                          // thirdYearSections[i] = {
                          //   ...thirdYearSections[i],
                          //   specialization: "Data Science",
                          // };
                          return (
                            <div
                              key={i}
                              className="flex space-x-5 items-center"
                            >
                              <input
                                type="text"
                                className="border border-primary rounded-md w-20 p-2"
                                value={thirdYearSections[i]?.section ?? ""}
                                onChange={(e) =>
                                  setThirdYearSections((prev) => {
                                    const newSections = [...prev];
                                    newSections[i] = {
                                      ...newSections[i],
                                      section: e.target.value,
                                      specialization: "Data Science",
                                    };
                                    return newSections;
                                  })
                                }
                              />
                              <div className="relative w-40">
                                <select
                                  name="thirdYearSpecializations"
                                  id="thirdYearSpecializations"
                                  className="appearance-none border border-primary rounded-md w-full h-11 p-2 pr-8 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                  value={
                                    thirdYearSections[i]?.specialization ??
                                    "Data Science"
                                  }
                                  onChange={(e) => {
                                    setThirdYearSections((prev) => {
                                      const newSections = [...prev];
                                      newSections[i] = {
                                        ...newSections[i],
                                        specialization: e.target.value,
                                      };
                                      return newSections;
                                    });
                                  }}
                                >
                                  <option value="Data Science">
                                    Data Science
                                  </option>
                                  <option value="Core CS">
                                    Core Computer Science
                                  </option>
                                  <option value="Game Development">
                                    Game Development
                                  </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                                  <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  initiateDeleteThirdYearSection(i)
                                }
                                className="text-primary hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
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
                          );
                        }
                      )}
                  </div>
                </div>
              </div>

              {/* Fourth Year */}
              <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)] p-7 w-full lg:w-6/12">
                <div className="font-bold text-primary mb-4">Fourth Year</div>
                <div className="flex gap-5 w-full">
                  <div className="space-y-2 w-20 flex flex-col items-center">
                    <div className="text-xs text-center whitespace-nowrap">
                      No. of Sections
                    </div>
                    <input
                      type="number"
                      id="fourthSC"
                      name="fourthSC"
                      value={sectionCounts.fourthSC}
                      onChange={handleSectionCountChange}
                      className={`border ${
                        validationErrors.fourthSC
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-md w-20 p-2`}
                      placeholder="1"
                      min="1"
                      max="20"
                      onKeyDown={(e) => {
                        if (e.key === "-") {
                          e.preventDefault();
                        }
                      }}
                    />
                    {validationErrors.fourthSC && (
                      <div className="text-red-500 text-xs text-center">
                        {validationErrors.fourthSC}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-64">
                    <div className="flex">
                      <div className="text-xs ml-4 mr-5">Section</div>
                      <div className="text-xs ml-10">Specialization</div>
                    </div>
                    {typeof sectionCounts.fourthSC == "number" &&
                      sectionCounts.fourthSC > 0 &&
                      Array.from({ length: sectionCounts.fourthSC }).map(
                        (_, i) => {
                          // fourthYearSections[i] = {
                          //   ...fourthYearSections[i],
                          //   // specialization: "Data Science",
                          // };
                          return (
                            <div
                              key={i}
                              className="flex space-x-5 items-center"
                            >
                              <input
                                type="text"
                                className="border border-primary rounded-md w-20 p-2"
                                value={fourthYearSections[i]?.section ?? ""}
                                onChange={(e) =>
                                  setFourthYearSections((prev) => {
                                    const newSections = [...prev];
                                    newSections[i] = {
                                      ...newSections[i],
                                      section: e.target.value,
                                      specialization: "Data Science",
                                    };
                                    return newSections;
                                  })
                                }
                              />
                              <div className="relative w-40">
                                <select
                                  name="fourthYearSpecializations"
                                  id="fourthYearSpecializations"
                                  className="appearance-none border border-primary rounded-md w-full h-11 p-2 pr-8 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                  value={
                                    fourthYearSections[i]?.specialization ??
                                    "Data Science"
                                  }
                                  onChange={(e) => {
                                    setFourthYearSections((prev) => {
                                      const newSections = [...prev];
                                      newSections[i] = {
                                        ...newSections[i],
                                        specialization: e.target.value,
                                      };
                                      return newSections;
                                    });
                                  }}
                                >
                                  {/* should be dynamic huhu */}
                                  <option value="Data Science">
                                    Data Science
                                  </option>
                                  <option value="Core CS">
                                    Core Computer Science
                                  </option>
                                  <option value="Game Development">
                                    Game Development
                                  </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                                  <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  initiateDeleteFourthYearSection(i)
                                }
                                className="text-primary hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
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
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Message Display */}
        {statusMessage.type && (
          <div
            className={`mx-auto mt-6 p-3 rounded-md text-center font-medium relative ${
              statusMessage.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {statusMessage.text}
            <button
              onClick={clearStatusMessage}
              className="text-gray-600 hover:text-gray-900 ml-5 items-center"
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

        <button
          type="submit"
          className="border-2 border-primary py-1 px-1 w-36 text-primary mx-auto mt-7 mb-24 rounded-sm hover:bg-primary hover:text-white font-Manrope font-semibold transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
        >
          Save
        </button>

        <DeleteConfirmationDialog />
      </form>
    </>
  );
};

export default InputSectionCounts;