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
        `http://localhost:8080/year_sections/${department}`,
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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
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

    const res = await fetch("http://localhost:8080/year_sections", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    if (res.ok) {
      console.log("yeeyyyy saved"); // gawan ng message pls thanks
    } else {
      console.log("may error UGH");
    }

    // updates
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
          <div className="text-primary text-[30px] md:text-[35px]">
            Section Counts
          </div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <section className="flex justify-center font-Manrope font-semibold mt-6 w-full">
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
                      <div className="text-xs ml-4 mr-10">Section</div>
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
                            <div key={i} className="flex space-x-5">
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
                                className="border border-primary rounded-md w-40 p-2"
                                placeholder="Not Applicable"
                                disabled
                              />
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
                      <div className="text-xs ml-4 mr-10">Section</div>
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
                            <div key={i} className="flex space-x-5">
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
                                className="border border-primary rounded-md w-40 p-2"
                                placeholder="Not Applicable"
                                disabled
                              />
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
                      <div className="text-xs ml-4 mr-10">Section</div>
                      <div className="text-xs ml-10">Specialization</div>
                    </div>
                    {typeof sectionCounts.thirdSC == "number" &&
                      sectionCounts.thirdSC > 0 &&
                      Array.from({ length: sectionCounts.thirdSC }).map(
                        (_, i) => {
                          return (
                            <div key={i} className="flex space-x-5">
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
                                    "none"
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
                                  <option value="none">None</option>
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
                      <div className="text-xs ml-4 mr-10">Section</div>
                      <div className="text-xs ml-10">Specialization</div>
                    </div>
                    {typeof sectionCounts.fourthSC == "number" &&
                      sectionCounts.fourthSC > 0 &&
                      Array.from({ length: sectionCounts.fourthSC }).map(
                        (_, i) => {
                          return (
                            <div key={i} className="flex space-x-5">
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
                                    "none"
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
                                  <option value="none">None</option>
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
        <button
          type="submit"
          className="border-2 border-primary py-1 px-1 w-36 text-primary mx-auto mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white font-Manrope font-semibold transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
        >
          Save
        </button>
      </form>
    </>
  );
};

export default InputSectionCounts;
