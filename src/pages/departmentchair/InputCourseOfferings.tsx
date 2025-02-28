import React, { useState, ChangeEvent, FormEvent } from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";

import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";

interface CourseInfo {
  title: string;
  code: string;
  unit: string;
  type: string;
  yearLevel: string;
}

type Option = {
  value: string;
  label: string;
};

const InputCourseOfferings = () => {
  // Dummy Options
  const courseType: Option[] = [
    { value: "lec", label: "Lec" },
    { value: "lab", label: "Lab" },
  ];

  const yearLevel: Option[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  // Array of Courses
  const [courses, setCourses] = useState<CourseInfo[]>([
    { title: "", code: "", unit: "", type: "", yearLevel: "" },
  ]);

  // Handles the Course Title Changes for each form
  const handleCourseTitleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title: e.target.value };
      return updated;
    });
  };

  // Handles the Course Code Changes for each form
  const handleCourseCodeChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], code: e.target.value };
      return updated;
    });
  };

  // Handles the Course Unit Changes for each form
  const handleCourseUnitChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], unit: e.target.value };
      return updated;
    });
  };

  // Handles the Course Type Changes for each form
  const handleCourseTypeChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        type: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  // Handles the Course Year Level Changes for each form
  const handleCourseYearLevelChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        yearLevel: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  // To Add Course Form
  const handleAddCourse = (e: FormEvent) => {
    e.preventDefault();
    setCourses((prev) => [
      ...prev,
      { title: "", code: "", unit: "", type: "", yearLevel: "" },
    ]);
  };

  // To Delete Course Form
  const handleDeleteCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  // Save handler for demonstration: logs each course's details.
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    courses.forEach((course, index) => {
      console.log(`Course ${index + 1}`);
      console.log(` Title: ${course.title}`);
      console.log(` Code: ${course.code}`);
      console.log(` Unit: ${course.unit}`);
      console.log(` Type: ${course.type}`);
      console.log(` Year Level: ${course.yearLevel}`);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">Course Offerings</div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>
      <section className="flex font-Manrope font-extrabold ml-36 my-11">
        <p>No.</p>
        <p className="ml-44">Course Title</p>
        <p className="ml-[187px]">Course Code</p>
        <p className="ml-32">Unit</p>
        <p className="ml-[136px]">Lab/Lec</p>
        <p className="ml-28">Year Level</p>
      </section>

      <form className="flex flex-col">
        {courses.map((course, index) => (
          <section
            key={index}
            className="flex mx-auto gap-7 font-semibold mb-5"
          >
            <div className="flex items-center gap-10 bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope text-sm">
              <label>Course {index + 1}</label>
              <input
                type="text"
                className="border border-primary h-[39px] w-[350px] rounded-md pl-2"
                value={course.title}
                onChange={(e) => handleCourseTitleChange(index, e)}
                placeholder="Enter"
              />

              <input
                type="text"
                className="border border-primary h-[39px] w-[150px] rounded-md pl-2"
                value={course.code}
                onChange={(e) => handleCourseCodeChange(index, e)}
                placeholder="Enter"
              />
              <input
                type="number"
                className="border border-primary h-[39px] w-[150px] rounded-md p-3"
                value={course.unit}
                onChange={(e) => handleCourseUnitChange(index, e)}
                placeholder="Enter"
              />
              <Select
                options={courseType}
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={
                  courseType.find((option) => option.value === course.type) ||
                  null
                }
                onChange={(option) =>
                  handleCourseTypeChange(index, option as Option)
                }
                className="w-[150px] rounded-[5px]"
              />
              <Select
                options={yearLevel}
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={
                  yearLevel.find(
                    (option) => option.value === course.yearLevel
                  ) || null
                }
                onChange={(option) =>
                  handleCourseYearLevelChange(index, option as Option)
                }
                className="w-[150px] rounded-[5px]"
              />
            </div>
            <button onClick={() => handleDeleteCourse(index)} className="w-7">
              <img src={trash_button} alt="Remove" />
            </button>
          </section>
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
              onClick={handleAddCourse}
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

export default InputCourseOfferings;
