import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Select from "react-select";
import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";

type SelectOption = {
  value: string;
  label: string;
};

interface Course {
  id: number;
  title: string;
  code: string;
  unit: string;
  type: SelectOption | null;
  year: SelectOption | null;
}

const InputCourseOfferings = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: "", code: "", unit: "", type: null, year: null },
  ]);

  const courseType: SelectOption[] = [
    { value: "lec", label: "Lec" },
    { value: "lab", label: "Lab" },
  ];

  const yearLevel: SelectOption[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: courses.length + 1,
        title: "",
        code: "",
        unit: "",
        type: null,
        year: null,
      },
    ]);
  };

  const removeCourse = (id: number) => {
    setCourses((prevCourses) => {
      // Remove the course by id
      const updatedCourses = prevCourses.filter((course) => course.id !== id);

      // Reassign ids to the remaining courses
      return updatedCourses.map((course, index) => ({
        ...course,
        id: index + 1, // Reassign id based on new index
      }));
    });
  };

  const handleInputChange = (
    id: number,
    field: keyof Course,
    value: string | SelectOption | null
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const handleSave = () => {
    //get inputted values
    const results = courses.map((course) => ({
      id: course.id,
      title: course.title || "Not Provided",
      code: course.code || "Not Provided",
      unit: course.unit || "Not Provided",
      type: course.type ? course.type.label : "Not Selected",
      year: course.year ? course.year.label : "Not Selected",
    }));

    console.log("Course Offerings:");
    results.forEach((course) => {
      console.log(
        `Course ${course.id}: Title - "${course.title}", Code - "${course.code}", Unit - "${course.unit}", Type - "${course.type}", Year Level - "${course.year}"`
      );
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

      {courses.map((course) => (
        <section
          key={course.id}
          className="flex mx-auto gap-7 font-semibold mb-5"
        >
          <div className="flex items-center gap-10 bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope text-sm">
            <p>Course {course.id}</p>
            <input
              type="text"
              className="border border-primary h-[39px] w-[350px] rounded-md pl-2"
              placeholder="Type Course Title"
              value={course.title}
              onChange={(e) =>
                handleInputChange(course.id, "title", e.target.value)
              }
            />
            <input
              type="text"
              className="border border-primary h-[39px] w-[150px] rounded-md pl-2"
              placeholder="Type Course Code"
              value={course.code}
              onChange={(e) =>
                handleInputChange(course.id, "code", e.target.value)
              }
            />
            <input
              type="number"
              className="border border-primary h-[39px] w-[150px] rounded-md p-3"
              placeholder="Type Unit"
              value={course.unit}
              onChange={(e) =>
                handleInputChange(course.id, "unit", e.target.value)
              }
            />
            <Select
              options={courseType}
              value={course.type}
              placeholder="Select"
              styles={{
                control: (provided: any) => ({
                  ...provided,
                  border: "1px solid #02296D",
                  borderRadius: "6px",
                }),
              }}
              onChange={(selectedOption) =>
                handleInputChange(
                  course.id,
                  "type",
                  selectedOption as SelectOption
                )
              }
              className="w-[150px] rounded-[5px]"
            />
            <Select
              options={yearLevel}
              value={course.year}
              placeholder="Select"
              styles={{
                control: (provided: any) => ({
                  ...provided,
                  border: "1px solid #02296D",
                  borderRadius: "6px",
                }),
              }}
              onChange={(selectedOption) =>
                handleInputChange(
                  course.id,
                  "year",
                  selectedOption as SelectOption
                )
              }
              className="w-[150px] rounded-[5px]"
            />
          </div>
          <button onClick={() => removeCourse(course.id)} className="w-7">
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
            onClick={addCourse}
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

export default InputCourseOfferings;
