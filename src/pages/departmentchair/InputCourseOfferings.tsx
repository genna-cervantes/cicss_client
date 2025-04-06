import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";

import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";
import ScrollButton from "../../components/ScrollButton";

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

const yearLevelOptions: Option[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

const InputCourseOfferings = () => {
  // Array of Courses
  const [firstYearCourses, setFirstYearCourses] = useState<CourseInfo[]>([]);
  const [secondYearCourses, setSecondYearCourses] = useState<CourseInfo[]>([]);
  const [thirdYearCourses, setThirdYearCourses] = useState<CourseInfo[]>([]);
  const [fourthYearCourses, setFourthYearCourses] = useState<CourseInfo[]>([]);

  const [addedCourses, setAddedCourses] = useState<CourseInfo[]>([]);
  const [deletedCourses, setDeletedCourses] = useState<
    { courseCode: string; yearLevel: number }[]
  >([]);
  const [updatedCourses, setUpdatedCourses] = useState<
    { [key: string]: any; yearLevel: number; courseCodeKey: string }[]
  >([]);

  // IMPORTANT: use effect for check token if expired na

  // Handles the Course Title Changes for each form
  const handleCourseTitleChange = useCallback(
    (
      yearLevel: number,
      courseCode: string,
      e: ChangeEvent<HTMLInputElement>
    ) => {
      handleUpdateCourse(
        "title",
        e.target.value as string,
        courseCode,
        yearLevel
      );
    },
    []
  );

  const handleAddedCourseTitleChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      setAddedCourses((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], title: e.target.value };
        return updated;
      });
    },
    []
  );

  // Handles the Course Code Changes for each form
  const handleCourseCodeChange = useCallback(
    (
      yearLevel: number,
      courseCode: string,
      e: ChangeEvent<HTMLInputElement>
    ) => {
      handleUpdateCourse(
        "code",
        { previous: courseCode, new: e.target.value },
        courseCode,
        yearLevel
      );
    },
    []
  );

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
  const handleCourseUnitChange = useCallback(
    (
      yearLevel: number,
      courseCode: string,
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;

      if (value === "") {
        handleUpdateCourse("unit", value, courseCode, yearLevel);
        return;
      }

      const numValue = parseFloat(value);

      if (value.length > 1 && value.startsWith("0")) {
        return;
      }

      if (numValue < 0 || numValue > 3) {
        return;
      }

      handleUpdateCourse("unit", value, courseCode, yearLevel);
    },
    []
  );

  const handleAddedCourseUnitChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value === "") {
      setAddedCourses((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], unit: value };
        return updated;
      });
      return;
    }

    const numValue = parseFloat(value);

    if (value.length > 1 && value.startsWith("0")) {
      return;
    }

    if (numValue < 0 || numValue > 3) {
      return;
    }
    setAddedCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], unit: value };
      return updated;
    });
  };

  // Handles the Course Type Changes for each form
  const handleCourseTypeChange = useCallback(
    (yearLevel: number, courseCode: string, selectedOption: Option | null) => {
      if (selectedOption) {
        handleUpdateCourse("type", selectedOption.value, courseCode, yearLevel);
      }
    },
    []
  );

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

  const handleCourseCategoryChange = useCallback(
    (yearLevel: number, courseCode: string, selectedOption: Option | null) => {
      if (selectedOption) {
        handleUpdateCourse(
          "category",
          selectedOption.value,
          courseCode,
          yearLevel
        );
      }
    },
    []
  );

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
  const handleCourseYearLevelChange = useCallback(
    (index: number, selectedOption: Option | null) => {
      setFirstYearCourses((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          yearLevel: selectedOption ? selectedOption.value : "",
        };
        return updated;
      });
    },
    []
  );

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
  const handleDeleteCourse = useCallback(
    (course: CourseInfo, yearLevel: number) => {
      if (yearLevel === 1) {
        setFirstYearCourses((prev) =>
          prev.filter((prevCourse) => prevCourse.code !== course.code)
        );
      }
      setDeletedCourses((prev) => [
        ...prev,
        { courseCode: course.code, yearLevel },
      ]);
      console.log("deleted", course);
    },
    []
  );

  const handleDeleteAddedCourse = (index: number) => {
    setAddedCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCourse = (
    property: string,
    newValue: any,
    courseCode: string,
    yearLevel: number
  ) => {
    if (yearLevel === 1) {
      setFirstYearCourses((prev) => {
        const index = prev.findIndex((course) => course.code === courseCode);
        if (index === -1) return prev; // No change if course not found

        const updatedCourse = {
          ...prev[index],
          [property]: property !== "code" ? newValue : newValue.new,
        };

        const newCourses = [...prev];
        newCourses[index] = updatedCourse;
        return newCourses;
      });
    } else if (yearLevel === 2) {
      setSecondYearCourses((prev) =>
        prev.map((course) =>
          course.code === courseCode
            ? property !== "code"
              ? { ...course, [property]: newValue }
              : { ...course, [property]: newValue.new }
            : course
        )
      );
    } else if (yearLevel === 3) {
      setThirdYearCourses((prev) =>
        prev.map((course) =>
          course.code === courseCode
            ? property !== "code"
              ? { ...course, [property]: newValue }
              : { ...course, [property]: newValue.new }
            : course
        )
      );
    } else if (yearLevel === 4) {
      setFourthYearCourses((prev) =>
        prev.map((course) =>
          course.code === courseCode
            ? property !== "code"
              ? { ...course, [property]: newValue }
              : { ...course, [property]: newValue.new }
            : course
        )
      );
    } else {
      console.log("error bakit may more than 4 na year");
    }
    setUpdatedCourses((prev) =>
      prev.some((course) => course.courseCodeKey === courseCode)
        ? prev.map((course) =>
            course.courseCodeKey === courseCode
              ? { ...course, [property]: newValue }
              : course
          )
        : [
            ...prev,
            { yearLevel, courseCodeKey: courseCode, [property]: newValue },
          ]
    );
  };

  // Save handler for demonstration: logs each course's details.
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true")

    try {
      let isSuccess = false;
      let apiErrors: string[] = [];

      // save added courses
      if (addedCourses.length > 0) {
        for (let i = 0; i < addedCourses.length; i++) {
          let course = addedCourses[i];
          let reqObj = {
            subjectCode: course.code,
            name: course.title,
            courseType: course.type,
            category: course.category,
            totalUnits: course.unit,
          };

          const department = localStorage.getItem("department") ?? "CS";
          const res = await fetch(
            `http://localhost:8080/courseofferings/${course.yearLevel}/2/${department}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(reqObj),
            }
          );

          if (res.ok) {
            isSuccess = true;
          } else {
            const data = await res.json();
            apiErrors.push(
              `Failed to add course ${course.code}: ${
                data.message || "Unknown error"
              }`
            );
          }
        }
      }

      // save updated courses
      if (updatedCourses.length > 0) {
        for (let i = 0; i < updatedCourses.length; i++) {
          let reqObj = {
            courseCodeKey: updatedCourses[i].courseCodeKey,
            ...(updatedCourses[i]?.title && { name: updatedCourses[i].title }),
            ...(updatedCourses[i]?.code && {
              courseCode: updatedCourses[i].code,
            }),
            ...(updatedCourses[i]?.unit && {
              totalUnits: updatedCourses[i].unit,
            }),
            ...(updatedCourses[i]?.type && {
              courseType: updatedCourses[i].type,
            }),
            ...(updatedCourses[i]?.category && {
              courseCategory: updatedCourses[i].category,
            }),
          };

          const department = localStorage.getItem("department") ?? "CS";
          const res = await fetch(
            `http://localhost:8080/courseofferings/${updatedCourses[i].yearLevel}/2/${department}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(reqObj),
            }
          );

          if (res.ok) {
            isSuccess = true;
          } else {
            const data = await res.json();
            apiErrors.push(
              `Failed to update course ${updatedCourses[i].courseCodeKey}: ${
                data.message || "Unknown error"
              }`
            );
          }
        }
      }

      // save deleted courses
      if (deletedCourses.length > 0) {
        const department = localStorage.getItem("department") ?? "CS";
        for (let i = 0; i < deletedCourses.length; i++) {
          let reqObj = deletedCourses[i];
          const res = await fetch(
            `http://localhost:8080/courseofferings/${deletedCourses[i].yearLevel}/2/${department}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(reqObj),
            }
          );

          if (res.ok) {
            isSuccess = true;
          } else {
            const data = await res.json();
            apiErrors.push(
              `Failed to delete course ${deletedCourses[i].courseCode}: ${
                data.message || "Unknown error"
              }`
            );
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
          text: "Course offerings successfully saved!",
        });
      } else if (
        updatedCourses.length === 0 &&
        addedCourses.length === 0 &&
        deletedCourses.length === 0
      ) {
        // No operations were performed
        setStatusMessage({
          type: "error",
          text: "No changes to save.",
        });
      }
    } catch (error) {
      console.error("Error saving courses:", error);
      setStatusMessage({
        type: "error",
        text: "An error occurred while saving. Please try again.",
      });
    }
  };

  // fetch data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const department = localStorage.getItem("department") ?? "CS";
        for (let i = 1; i < 5; i++) {
          const res = await fetch(
            `http://localhost:8080/courseofferings/${i}/2/${department}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
              },
            }
          ); // sem and department must be dynamic
          const data = await res.json();

          if (res.ok) {
            if (i === 1) {
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
            } else if (i === 2) {
              let transformedSecondYearCourses: CourseInfo[] = [];
              transformedSecondYearCourses = data.map((course: any) => {
                return {
                  title: course.courseName,
                  code: course.courseCode,
                  unit: course.totalUnits,
                  type: course.courseType,
                  category: course.courseCategory,
                  yearLevel: 2,
                };
              });

              setSecondYearCourses(transformedSecondYearCourses);
            } else if (i === 3) {
              let transformedThirdYearCourses: CourseInfo[] = [];
              transformedThirdYearCourses = data.map((course: any) => {
                return {
                  title: course.courseName,
                  code: course.courseCode,
                  unit: course.totalUnits,
                  type: course.courseType,
                  category: course.courseCategory,
                  yearLevel: 3,
                };
              });

              setThirdYearCourses(transformedThirdYearCourses);
            } else if (i === 4) {
              let transformedFourthYearCourses: CourseInfo[] = [];
              transformedFourthYearCourses = data.map((course: any) => {
                return {
                  title: course.courseName,
                  code: course.courseCode,
                  unit: course.totalUnits,
                  type: course.courseType,
                  category: course.courseCategory,
                  yearLevel: 4,
                };
              });

              setFourthYearCourses(transformedFourthYearCourses);
            } else {
              console.log("error yan");
            }
          } else {
            console.log("may error ate ko");
          }
        }
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchCourseData();
  }, []);

  const MemoizedFirstYearCourseList = useMemo(
    () =>
      firstYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={1}
          course={course}
          key={index}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={handleDeleteCourse}
        />
      )),
    [firstYearCourses]
  );

  const MemoizedSecondYearCourseList = useMemo(
    () =>
      secondYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={2}
          course={course}
          key={index}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={handleDeleteCourse}
        />
      )),
    [secondYearCourses]
  );

  const MemoizedThirdYearCourseList = useMemo(
    () =>
      thirdYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={3}
          course={course}
          key={index}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={handleDeleteCourse}
        />
      )),
    [thirdYearCourses]
  );

  const MemoizedFourthYearCourseList = useMemo(
    () =>
      fourthYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={4}
          course={course}
          key={index}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={handleDeleteCourse}
        />
      )),
    [fourthYearCourses]
  );

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  return (
    <>
      {/* Mobile/Small screen warning */}
      <div className="lg:hidden flex flex-col items-center justify-center h-screen mx-5">
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
      <div className="min-h-screen hidden lg:flex flex-col">
        <div className="mx-auto py-10">
          <ScrollButton />
          <Navbar />
        </div>
        <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
          <div className="text-primary text-[35px]">Course Offerings</div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <form className="flex flex-col">
          {/* FIRST YEAR COURSES */}
          {/* <h1>First Year Courses</h1> */}
          {MemoizedFirstYearCourseList}

          {/* SECOND YEAR COURSES */}
          {/* <h1>Second Year Courses</h1> */}
          {MemoizedSecondYearCourseList}

          {/* THIRD YEAR COURSES */}
          {/* <h1>Third Year Courses</h1> */}
          {MemoizedThirdYearCourseList}

          {/* FOURTH YEAR COURSES */}
          {/* <h1>Fourth Year Courses</h1> */}
          {MemoizedFourthYearCourseList}

          {addedCourses.map((course, index) => (
            <section
              key={index}
              className="flex mx-auto gap-7 font-semibold mb-5"
            >
              <div className=" bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope">
                {/* <label>Course {firstYearCourses.length + index + 1}</label> */}
                <div className="flex text-primary font-bold mb-2">
                  <div className="ml-20 mr-2">Course Name</div>
                  <div className="ml-32 mr-4">Code</div>
                  <div className="ml-20 mr-2">Units</div>
                  <div className="ml-16">Lab/Lec</div>
                  <div className="ml-24">Type</div>
                  <div className="ml-20">Yr. Level</div>
                </div>
                <div className="flex items-center gap-10  text-sm">
                  <input
                    type="text"
                    className="border border-primary h-[39px] w-[250px] rounded-md pl-2"
                    value={course.title}
                    onChange={(e) => handleAddedCourseTitleChange(index, e)}
                    placeholder="Enter"
                  />

                  <input
                    type="text"
                    className="border border-primary h-[39px] w-[110px] rounded-md pl-2"
                    value={course.code}
                    onChange={(e) => handleAddedCourseCodeChange(index, e)}
                    placeholder="Enter"
                  />
                  <input
                    type="number"
                    className="border border-primary h-[39px] w-[80px] rounded-md p-3"
                    value={course.unit}
                    onChange={(e) => handleAddedCourseUnitChange(index, e)}
                    placeholder="Enter"
                    min="0"
                    max="3"
                    step="0.5"
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
                      courseType.find(
                        (option) => option.value === course.type
                      ) || null
                    }
                    onChange={(option) =>
                      handleAddedCourseTypeChange(index, option as Option)
                    }
                    className="w-[100px] rounded-[5px]"
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
                      courseCategory.find(
                        (option) => option.value === course.category
                      ) || null
                    }
                    onChange={(option) =>
                      handleAddedCourseCategoryChange(index, option as Option)
                    }
                    className="w-[110px] rounded-[5px]"
                  />
                  <Select
                    options={yearLevelOptions}
                    placeholder="Select"
                    styles={{
                      control: (provided: any) => ({
                        ...provided,
                        border: "1px solid #02296D",
                        borderRadius: "6px",
                      }),
                    }}
                    value={
                      yearLevelOptions.find(
                        (option) => option.value === course.yearLevel.toString()
                      ) || null
                    }
                    onChange={(option) =>
                      handleAddedCourseYearLevelChange(index, option as Option)
                    }
                    className="w-[70px] rounded-[5px]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteAddedCourse(index)}
                className="w-7 transition-all duration-300 active:scale-95 active:shadow-lg"
              >
                <img src={trash_button} alt="Remove" />
              </button>
            </section>
          ))}
          <div className="flex flex-col">
            {statusMessage.type && (
              <div
                className={`mx-auto mt-6 p-3 rounded-md text-center font-medium flex justify-between items-center ${
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
                  onClick={handleSave}
                  className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 active:bg-primary active:text-white active:shadow-lg"
                >
                  Save
                </button>
              </div>
              <div>
                <button
                  onClick={handleAddCourse}
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
    </>
  );
};

const CourseOffering: React.FC<{
  yearLevel: number;
  course: CourseInfo;
  handleCourseTitleChange: (
    yearLevel: number,
    courseCode: string,
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  handleCourseCodeChange: (
    yearLevel: number,
    courseCode: string,
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  handleCourseUnitChange: (
    yearLevel: number,
    courseCode: string,
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  handleCourseTypeChange: (
    yearLevel: number,
    courseCode: string,
    selectedOption: Option | null
  ) => void;
  handleCourseCategoryChange: (
    yearLevel: number,
    courseCode: string,
    selectedOption: Option | null
  ) => void;
  handleCourseYearLevelChange: (
    index: number,
    selectedOption: Option | null
  ) => void;
  handleDeleteCourse: (course: CourseInfo, yearLevel: number) => void;
}> = React.memo(
  ({
    yearLevel,
    course,
    handleCourseTitleChange,
    handleCourseCodeChange,
    handleCourseUnitChange,
    handleCourseTypeChange,
    handleCourseCategoryChange,
    handleDeleteCourse,
    handleCourseYearLevelChange,
  }) => {
    const courseTypeValue = useMemo(
      () => courseType.find((option) => option.value === course.type) || null,
      [course.type]
    );

    const courseCategoryValue = useMemo(
      () =>
        courseCategory.find((option) => option.value === course.category) ||
        null,
      [course.category]
    );

    const yearLevelValue = useMemo(
      () =>
        yearLevelOptions.find((option) => option.value === String(yearLevel)),
      []
    );

    return (
      <>
        <section className="flex mx-auto gap-7  mb-5">
          <div className=" bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope">
            {/* <label>Course {index + 1}</label> */}
            <div className="flex text-primary font-extrabold mb-2">
              <div className="ml-20 mr-2">Course Name</div>
              <div className="ml-32 mr-4">Code</div>
              <div className="ml-20 mr-2">Units</div>
              <div className="ml-16">Lab/Lec</div>
              <div className="ml-24">Type</div>
              <div className="ml-20">Yr. Level</div>
            </div>
            <div className="flex  gap-10 items-center text-sm font-semibold">
              <input
                type="text"
                className="border border-primary h-[39px] w-[250px] rounded-md pl-2"
                value={course.title}
                onChange={(e) =>
                  handleCourseTitleChange(yearLevel, course.code, e)
                }
                placeholder="Enter"
              />

              <input
                type="text"
                className="border border-primary h-[39px] w-[110px] rounded-md pl-2"
                value={course.code}
                onChange={(e) =>
                  handleCourseCodeChange(yearLevel, course.code, e)
                }
                placeholder="Enter"
              />
              <input
                type="number"
                className="border border-primary h-[39px] w-[80px] rounded-md p-3"
                value={course.unit}
                onChange={(e) =>
                  handleCourseUnitChange(yearLevel, course.code, e)
                }
                placeholder="Enter"
                min="0"
                max="3"
                step="0.5"
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
                value={courseTypeValue}
                onChange={(option) =>
                  handleCourseTypeChange(
                    yearLevel,
                    course.code,
                    option as Option
                  )
                }
                className="w-[100px] rounded-[5px]"
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
                value={courseCategoryValue}
                onChange={(option) =>
                  handleCourseCategoryChange(1, course.code, option as Option)
                }
                className="w-[110px] rounded-[5px]"
              />
              <Select
                isDisabled={true}
                options={yearLevelOptions}
                placeholder="Select"
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    border: "1px solid #02296D",
                    borderRadius: "6px",
                  }),
                }}
                value={yearLevelValue}
                // onChange={(option) =>
                //   handleCourseYearLevelChange(index, option as Option)
                // }
                className="w-[70px] rounded-[5px]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDeleteCourse(course, 1)}
            className="w-7"
          >
            <img src={trash_button} alt="Remove" />
          </button>
        </section>
      </>
    );
  }
);

export default InputCourseOfferings;
