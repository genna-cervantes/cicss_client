import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";

import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";

interface CourseInfo {
  title: string;
  code: string;
  unit: string;
  type: string;
  category: string;
  yearLevel: string;
}

type Option = {
  value: string;
  label: string;
};

// Dummy Options
const courseType: Option[] = [
  { value: "lec", label: "Lec" },
  { value: "lab", label: "Lab" },
];

const courseCategory: Option[] = [
  { value: "major", label: "Major" },
  { value: "gened", label: "Gened" },
];

const yearLevel: Option[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

const InputCourseOfferings = () => {
  // Array of Courses
  const [courses, setCourses] = useState<CourseInfo[]>([
    { title: "", code: "", unit: "", type: "", category: "", yearLevel: "" },
  ]);

  const [firstYearCourses, setFirstYearCourses] = useState<CourseInfo[]>([]);
  const [addedCourses, setAddedCourses] = useState<CourseInfo[]>([]);

  // Handles the Course Title Changes for each form
  const handleCourseTitleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFirstYearCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title: e.target.value };
      return updated;
    });
  };

  const handleAddedCourseTitleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAddedCourses((prev) => {
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
    setFirstYearCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], code: e.target.value };
      return updated;
    });
  };

  const handleAddedCourseCodeChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAddedCourses((prev) => {
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
    setFirstYearCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], unit: e.target.value };
      return updated;
    });
  };

  const handleAddedCourseUnitChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAddedCourses((prev) => {
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
    setFirstYearCourses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        type: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  const handleAddedCourseTypeChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setAddedCourses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        type: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  const handleCourseCategoryChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setFirstYearCourses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        category: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  const handleAddedCourseCategoryChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setAddedCourses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        category: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  // Handles the Course Year Level Changes for each form
  const handleCourseYearLevelChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setFirstYearCourses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        yearLevel: selectedOption ? selectedOption.value : "",
      };
      return updated;
    });
  };

  const handleAddedCourseYearLevelChange = (
    index: number,
    selectedOption: Option | null
  ) => {
    setAddedCourses((prev) => {
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
    setAddedCourses((prev) => [
      ...prev,
      { title: "", code: "", unit: "", type: "", category: "", yearLevel: "" },
    ]);
  };

  // To Delete Course Form
  const handleDeleteCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAddedCourse = (index: number) => {
    setAddedCourses((prev) => prev.filter((_, i) => i !== index));
  };

  // Save handler for demonstration: logs each course's details.
  const handleSave = (e: FormEvent) => {
    // save added courses
    e.preventDefault();

    const addCourseData = async () => {
      for (let i = 0; i < addedCourses.length; i++) {
        let course = addedCourses[i];
        let reqObj = {
          subjectCode: course.code,
          name: course.title,
          courseType: course.type,
          category: course.category,
          totalUnits: course.unit,
        };

        const res = await fetch(
          `http://localhost:8080/courseofferings/${course.yearLevel}/2/CS`,
          {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`,
              "Content-type": "application/json" },
            body: JSON.stringify(reqObj),
          }
        );

        if (res.ok) {
          console.log("yey nasave");
        } else {
          console.log("shet errro");
        }
      }
    };
    addCourseData();

    // save updated courses

  };

  // fetch data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch("http://localhost:8080/courseofferings/1/2/CS", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`,
          }
        }); // sem and department must be dynamic
        const data = await res.json();

        if (res.ok) {
          console.log(data);

          let transformedFirstYearCourses: CourseInfo[] = [];
          transformedFirstYearCourses = data.map((course: any) => {
            return {
              title: course.courseName,
              code: course.courseCode,
              unit: course.totalUnits,
              type: course.courseType,
              category: course.courseCategory,
              yearLevel: 1,
            };
          });

          setFirstYearCourses(transformedFirstYearCourses);
        } else {
          console.log("may error ate ko");
        }
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchCourseData();
  }, []);

  useEffect(() => {
    console.log(firstYearCourses);
  }, [firstYearCourses]);

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
        {firstYearCourses.map((course, index) => (
          <section
            key={index}
            className="flex mx-auto gap-7 font-semibold mb-5"
          >
            <div className="flex items-center gap-10 bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope text-sm">
              {/* <label>Course {index + 1}</label> */}
              <input
                type="text"
                className="border border-primary h-[39px] w-[300px] rounded-md pl-2"
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
                options={courseCategory}
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={
                  courseCategory.find((option) => option.value === course.category) ||
                  null
                }
                onChange={(option) =>
                  handleCourseCategoryChange(index, option as Option)
                }
                className="w-[150px] rounded-[5px]"
              />
              <Select
                isDisabled={true}
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
                    (option) => option.value === course.yearLevel.toString()
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
        {addedCourses.map((course, index) => (
          <section
            key={index}
            className="flex mx-auto gap-7 font-semibold mb-5"
          >
            <div className="flex items-center gap-10 bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope text-sm">
              {/* <label>Course {firstYearCourses.length + index + 1}</label> */}
              <input
                type="text"
                className="border border-primary h-[39px] w-[300px] rounded-md pl-2"
                value={course.title}
                onChange={(e) => handleAddedCourseTitleChange(index, e)}
                placeholder="Enter"
              />

              <input
                type="text"
                className="border border-primary h-[39px] w-[150px] rounded-md pl-2"
                value={course.code}
                onChange={(e) => handleAddedCourseCodeChange(index, e)}
                placeholder="Enter"
              />
              <input
                type="number"
                className="border border-primary h-[39px] w-[150px] rounded-md p-3"
                value={course.unit}
                onChange={(e) => handleAddedCourseUnitChange(index, e)}
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
                  handleAddedCourseTypeChange(index, option as Option)
                }
                className="w-[150px] rounded-[5px]"
              />
              <Select
                options={courseCategory}
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={
                  courseCategory.find((option) => option.value === course.category) ||
                  null
                }
                onChange={(option) =>
                  handleAddedCourseCategoryChange(index, option as Option)
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
                    (option) => option.value === course.yearLevel.toString()
                  ) || null
                }
                onChange={(option) =>
                  handleAddedCourseYearLevelChange(index, option as Option)
                }
                className="w-[150px] rounded-[5px]"
              />
            </div>
            <button
              onClick={() => handleDeleteAddedCourse(index)}
              className="w-7"
            >
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
