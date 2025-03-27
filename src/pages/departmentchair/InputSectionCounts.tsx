import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Navbar from "../../components/Navbar";

interface SectionCounts {
  firstSC: number | "";
  secondSC: number | "";
  thirdSC: number | "";
  fourthSC: number | "";
}

interface SectionErrors {
  firstSC: string;
  secondSC: string;
  thirdSC: string;
  fourthSC: string;
}

const InputSectionCounts: React.FC = () => {
  const [sectionCounts, setSectionCounts] = useState<SectionCounts>({
    firstSC: "",
    secondSC: "",
    thirdSC: "",
    fourthSC: "",
  });

  const [errors, setErrors] = useState<SectionErrors>({
    firstSC: "",
    secondSC: "",
    thirdSC: "",
    fourthSC: "",
  });

  // Validate input and set error messages
  const validateInput = (
    name: string,
    value: number | "",
    rawValue?: string
  ) => {
    if (value === "") {
      return "This field is required";
    }

    // Check if the input starts with 0
    if (rawValue && rawValue.startsWith("0")) {
      return "Input cannot start with 0";
    }

    if (typeof value === "number") {
      if (value < 1) {
        return "Value must be at least 1";
      }
      if (value > 15) {
        return "Value cannot exceed 15";
      }
    }

    return "";
  };

  const handleSectionCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value ? parseInt(value, 10) : "";

    setSectionCounts((prevCounts) => ({
      ...prevCounts,
      [name]: numberValue,
    }));

    // Validate immediately and set error
    setErrors((prev) => ({
      ...prev,
      [name]: validateInput(name, numberValue, value),
    }));
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors: SectionErrors = {
      firstSC: validateInput(
        "firstSC",
        sectionCounts.firstSC,
        sectionCounts.firstSC?.toString()
      ),
      secondSC: validateInput(
        "secondSC",
        sectionCounts.secondSC,
        sectionCounts.secondSC?.toString()
      ),
      thirdSC: validateInput(
        "thirdSC",
        sectionCounts.thirdSC,
        sectionCounts.thirdSC?.toString()
      ),
      fourthSC: validateInput(
        "fourthSC",
        sectionCounts.fourthSC,
        sectionCounts.fourthSC?.toString()
      ),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      console.log("Submitted section counts:", sectionCounts);
      //get data here
    }
  };

  const getInputClass = (fieldName: keyof SectionErrors) => {
    return errors[fieldName]
      ? "border border-red-500 rounded-md w-20 p-2 focus:outline-red-500"
      : "border border-primary rounded-md w-20 p-2";
  };

  return (
    <>
      {/* Mobile/Small screen warning */}
      <div className="sm:hidden flex flex-col items-center justify-center h-screen">
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

      {/* Main content */}
      <form
        onSubmit={handleSave}
        className="hidden sm:flex flex-col min-h-screen overflow-hidden"
      >
        <div className="mx-auto py-10">
          <Navbar />
        </div>
        <section className="px-4 md:px-16 flex flex-col lg:flex-row gap-2 lg:gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
          <div className="text-primary text-[35px]">Section Counts</div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <section className="flex justify-center font-Manrope font-semibold mt-10">
          <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)]">
            <div className="p-6 flex justify-center items-center">
              <div className="grid grid-cols-4 gap-14 mx-auto">
                <div className="flex flex-col items-center w-24">
                  <label
                    htmlFor="firstSC"
                    className="mb-2 font-Manrope font-extrabold text-primary"
                  >
                    1st Year
                  </label>
                  <input
                    type="number"
                    id="firstSC"
                    name="firstSC"
                    value={sectionCounts.firstSC}
                    onChange={handleSectionCountChange}
                    className={getInputClass("firstSC")}
                    placeholder="1"
                    min="1"
                    max="15"
                  />
                  {errors.firstSC ? (
                    <div className="h-6 mt-1 text-center w-full">
                      <p className="text-red-500 text-xs">{errors.firstSC}</p>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col items-center w-24">
                  <label
                    htmlFor="secondSC"
                    className="mb-2 font-Manrope font-extrabold text-primary"
                  >
                    2nd Year
                  </label>
                  <input
                    type="number"
                    id="secondSC"
                    name="secondSC"
                    value={sectionCounts.secondSC}
                    onChange={handleSectionCountChange}
                    className={getInputClass("secondSC")}
                    placeholder="1"
                    min="1"
                    max="15"
                  />
                  {errors.secondSC ? (
                    <div className="h-6 mt-1 text-center w-full">
                      <p className="text-red-500 text-xs">{errors.secondSC}</p>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col items-center w-24">
                  <label
                    htmlFor="thirdSC"
                    className="mb-2 font-Manrope font-extrabold text-primary"
                  >
                    3rd Year
                  </label>
                  <input
                    type="number"
                    id="thirdSC"
                    name="thirdSC"
                    value={sectionCounts.thirdSC}
                    onChange={handleSectionCountChange}
                    className={getInputClass("thirdSC")}
                    placeholder="1"
                    min="1"
                    max="15"
                  />
                  {errors.thirdSC ? (
                    <div className="h-6 mt-1 text-center w-full">
                      <p className="text-red-500 text-xs">{errors.thirdSC}</p>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col items-center w-24">
                  <label
                    htmlFor="fourthSC"
                    className="mb-2 font-Manrope font-extrabold text-primary"
                  >
                    4th Year
                  </label>
                  <input
                    type="number"
                    id="fourthSC"
                    name="fourthSC"
                    value={sectionCounts.fourthSC}
                    onChange={handleSectionCountChange}
                    className={getInputClass("fourthSC")}
                    placeholder="1"
                    min="1"
                    max="15"
                  />
                  {errors.fourthSC ? (
                    <div className="h-6 mt-1 text-center w-full">
                      <p className="text-red-500 text-xs">{errors.fourthSC}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
        <button
          type="submit"
          className="border-2 border-primary py-1 px-1 w-36 text-primary mx-auto mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white font-Manrope font-semibold"
        >
          Save
        </button>
      </form>
    </>
  );
};

export default InputSectionCounts;
