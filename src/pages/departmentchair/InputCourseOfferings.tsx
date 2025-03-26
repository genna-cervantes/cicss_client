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
  const handleCourseCodeChange = useCallback((
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
  }, []);

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
  const handleCourseUnitChange = useCallback((
    yearLevel: number,
    courseCode: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    handleUpdateCourse("unit", e.target.value, courseCode, yearLevel);
  }, []);

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
  const handleCourseTypeChange = useCallback((
    yearLevel: number,
    courseCode: string,
    selectedOption: Option | null
  ) => {
    if (selectedOption) {
      handleUpdateCourse("type", selectedOption.value, courseCode, yearLevel);
    }
  }, []);

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

  const handleCourseCategoryChange = useCallback((
    yearLevel: number,
    courseCode: string,
    selectedOption: Option | null
  ) => {
    if (selectedOption) {
      handleUpdateCourse(
        "category",
        selectedOption.value,
        courseCode,
        yearLevel
      );
    }
  }, []);

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
  const handleCourseYearLevelChange = useCallback((
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
  }, []);

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
  const handleDeleteCourse = useCallback((course: CourseInfo, yearLevel: number) => {
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
  }, []);

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
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
              "Content-type": "application/json",
            },
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
    const updateCoursesData = async () => {
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

        const res = await fetch(
          `http://localhost:8080/courseofferings/${updatedCourses[i].yearLevel}/2/CS`,
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
          console.log("yey updated");
        } else {
          console.log("noo may error");
        }
      }
    };
    updateCoursesData();

    // save deleted courses
    const deleteCourseData = async () => {
      for (let i = 0; i < deletedCourses.length; i++) {
        let reqObj = deletedCourses[i];

        const res = await fetch(
          `http://localhost:8080/courseofferings/${deletedCourses[i].yearLevel}/2/CS`,
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
          console.log("yey delted");
        } else {
          console.log("may error sis");
        }
      }
    };
    deleteCourseData();
  };

  // fetch data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        for (let i = 1; i < 5; i++) {
          const res = await fetch(
            `http://localhost:8080/courseofferings/${i}/2/CS`,
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
      secondYearCourses.map((course, index) => (
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
      secondYearCourses.map((course, index) => (
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
        {/* FIRST YEAR COURSES */}
        {MemoizedFirstYearCourseList}

        {/* SECOND YEAR COURSES */}
        {MemoizedSecondYearCourseList}

        {/* THIRD YEAR COURSES */}
        {MemoizedThirdYearCourseList}
        
        {/* FOURTH YEAR COURSES */}
        {MemoizedFourthYearCourseList}

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
                  courseCategory.find(
                    (option) => option.value === course.category
                  ) || null
                }
                onChange={(option) =>
                  handleAddedCourseCategoryChange(index, option as Option)
                }
                className="w-[150px] rounded-[5px]"
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
                className="w-[150px] rounded-[5px]"
              />
            </div>
            <button
              type="button"
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

const CourseOffering: React.FC<{
  yearLevel: number,
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

    const courseTypeValue = useMemo(() => 
      courseType.find((option) => option.value === course.type) || null,
      [course.type]
    );
  
    const courseCategoryValue = useMemo(() => 
      courseCategory.find((option) => option.value === course.category) || null,
      [course.category]
    );

    const yearLevelValue = useMemo(() => 
      yearLevelOptions.find((option) => option.value === String(yearLevel)),
      []
  ) 
  
    return (
      <section className="flex mx-auto gap-7 font-semibold mb-5">
        <div className="flex items-center gap-10 bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope text-sm">
          {/* <label>Course {index + 1}</label> */}
          <input
            type="text"
            className="border border-primary h-[39px] w-[300px] rounded-md pl-2"
            value={course.title}
            onChange={(e) => handleCourseTitleChange(yearLevel, course.code, e)}
            placeholder="Enter"
          />

          <input
            type="text"
            className="border border-primary h-[39px] w-[150px] rounded-md pl-2"
            value={course.code}
            onChange={(e) => handleCourseCodeChange(yearLevel, course.code, e)}
            placeholder="Enter"
          />
          <input
            type="number"
            className="border border-primary h-[39px] w-[150px] rounded-md p-3"
            value={course.unit}
            onChange={(e) => handleCourseUnitChange(yearLevel, course.code, e)}
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
              courseTypeValue
            }
            onChange={(option) =>
              handleCourseTypeChange(yearLevel, course.code, option as Option)
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
              courseCategoryValue
            }
            onChange={(option) =>
              handleCourseCategoryChange(1, course.code, option as Option)
            }
            className="w-[150px] rounded-[5px]"
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
            value={
              yearLevelValue
            }
            // onChange={(option) =>
            //   handleCourseYearLevelChange(index, option as Option)
            // }
            className="w-[150px] rounded-[5px]"
          />
        </div>
        <button
          type="button"
          onClick={() => handleDeleteCourse(course, 1)}
          className="w-7"
        >
          <img src={trash_button} alt="Remove" />
          ``
        </button>
      </section>
    );
  }
);

export default InputCourseOfferings;
