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
import { fuzzyMatch } from "../../utils/utils";

export interface CourseInfo {
  title: string;
  code: string;
  unit: string;
  type: string;
  category: string;
  yearLevel: string | number; // Allow number for internal consistency, string for form values
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
  const [searchValue, setSearchValue] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<CourseInfo[]>([]);

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

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<{
    courseInfo: CourseInfo | null;
    yearLevelContext: number | null; // yearLevel of the course for existing, or from dropdown for added
    index?: number; // For 'addedCourses'
    type: "existing" | "added";
  } | null>(null);

  // IMPORTANT: use effect for check token if expired na

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
      if (
        value.length > 1 &&
        value.startsWith("0") &&
        !value.startsWith("0.")
      ) {
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
    if (value.length > 1 && value.startsWith("0") && !value.startsWith("0.")) {
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

  const handleCourseYearLevelChange = useCallback(
    // This function appears unused by CourseOffering due to disabled Select,
    // and its logic is specific to firstYearCourses and index-based updates.
    // If year level changes for existing courses become a feature, this needs rework.
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

  const handleAddCourse = (e: FormEvent) => {
    e.preventDefault();
    setAddedCourses((prev) => [
      ...prev,
      { title: "", code: "", unit: "", type: "", category: "", yearLevel: "" },
    ]);
  };

  // Opens confirmation modal for deleting an existing course
  const requestDeleteExistingCourse = useCallback(
    (course: CourseInfo, yearLevel: number) => {
      setCourseToDelete({
        courseInfo: course,
        yearLevelContext: yearLevel,
        type: "existing",
      });
      setIsDeleteModalOpen(true);
    },
    []
  );

  // Opens confirmation modal for deleting a newly added course
  const requestDeleteAddedCourse = (index: number) => {
    setCourseToDelete({
      courseInfo: addedCourses[index],
      yearLevelContext: null, // Or parse from addedCourses[index].yearLevel if needed for message
      index: index,
      type: "added",
    });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!courseToDelete || !courseToDelete.courseInfo) return;

    const { courseInfo, yearLevelContext, index, type } = courseToDelete;

    if (type === "existing" && yearLevelContext !== null) {
      const yearLvl = yearLevelContext; // To satisfy TS null check
      if (yearLvl === 1) {
        setFirstYearCourses((prev) =>
          prev.filter((c) => c.code !== courseInfo.code)
        );
      } else if (yearLvl === 2) {
        setSecondYearCourses((prev) =>
          prev.filter((c) => c.code !== courseInfo.code)
        );
      } else if (yearLvl === 3) {
        setThirdYearCourses((prev) =>
          prev.filter((c) => c.code !== courseInfo.code)
        );
      } else if (yearLvl === 4) {
        setFourthYearCourses((prev) =>
          prev.filter((c) => c.code !== courseInfo.code)
        );
      }
      setDeletedCourses((prev) => [
        ...prev,
        { courseCode: courseInfo.code, yearLevel: yearLvl },
      ]);
      console.log("Deleted existing course:", courseInfo);
    } else if (type === "added" && index !== undefined) {
      setAddedCourses((prev) => prev.filter((_, i) => i !== index));
      console.log("Deleted added course at index:", index);
    }

    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleUpdateCourse = (
    property: string,
    newValue: any,
    courseCode: string,
    yearLevel: number
  ) => {
    const updateCoursesState = (
      setter: React.Dispatch<React.SetStateAction<CourseInfo[]>>
    ) => {
      setter((prev) => {
        const index = prev.findIndex((course) => course.code === courseCode);
        if (index === -1) return prev;

        const updatedCourse = {
          ...prev[index],
          [property]: property !== "code" ? newValue : newValue.new,
        };

        const newCourses = [...prev];
        newCourses[index] = updatedCourse;
        return newCourses;
      });
    };

    if (yearLevel === 1) updateCoursesState(setFirstYearCourses);
    else if (yearLevel === 2) updateCoursesState(setSecondYearCourses);
    else if (yearLevel === 3) updateCoursesState(setThirdYearCourses);
    else if (yearLevel === 4) updateCoursesState(setFourthYearCourses);
    else console.log("Error: Invalid year level in handleUpdateCourse");

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

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasChanges", "true");

    try {
      let isSuccess = false;
      let apiErrors: string[] = [];

      if (addedCourses.length > 0) {
        for (let i = 0; i < addedCourses.length; i++) {
          let course = addedCourses[i];
          if (!course.yearLevel || !course.code || !course.title) {
            apiErrors.push(
              `Cannot save added course at index ${
                i + 1
              }: Year Level, Code, and Title are required.`
            );
            continue;
          }
          let reqObj = {
            subjectCode: course.code,
            name: course.title,
            courseType: course.type,
            category: course.category,
            totalUnits: course.unit,
          };
          const department = localStorage.getItem("department") ?? "CS";
          const res = await fetch(
            `/api/courseofferings/${course.yearLevel}/2/${department}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(reqObj),
            }
          );
          if (res.ok) isSuccess = true;
          else {
            const data = await res.json();
            apiErrors.push(
              `Failed to add course ${course.code}: ${
                data.message || "Unknown error"
              }`
            );
          }
        }
      }

      if (updatedCourses.length > 0) {
        for (let i = 0; i < updatedCourses.length; i++) {
          const currentUpdate = updatedCourses[i];
          let reqObj: { [key: string]: any } = {
            courseCodeKey: currentUpdate.courseCodeKey,
          };
          if (currentUpdate.title) reqObj.name = currentUpdate.title;
          if (currentUpdate.code) {
            // 'code' is an object { previous: string, new: string }
            reqObj.courseCode = currentUpdate.code.new;
          }
          if (currentUpdate.unit) reqObj.totalUnits = currentUpdate.unit;
          if (currentUpdate.type) reqObj.courseType = currentUpdate.type;
          if (currentUpdate.category)
            reqObj.courseCategory = currentUpdate.category; // API expects courseCategory

          const department = localStorage.getItem("department") ?? "CS";
          const res = await fetch(
            `/api/courseofferings/${currentUpdate.yearLevel}/2/${department}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(reqObj),
            }
          );
          if (res.ok) isSuccess = true;
          else {
            const data = await res.json();
            apiErrors.push(
              `Failed to update course ${currentUpdate.courseCodeKey}: ${
                data.message || "Unknown error"
              }`
            );
          }
        }
      }

      if (deletedCourses.length > 0) {
        const department = localStorage.getItem("department") ?? "CS";
        for (let i = 0; i < deletedCourses.length; i++) {
          let reqObj = { courseCode: deletedCourses[i].courseCode }; // API might just need courseCode
          const res = await fetch(
            `/api/courseofferings/${deletedCourses[i].yearLevel}/2/${department}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify(reqObj),
            }
          );
          if (res.ok) isSuccess = true;
          else {
            const data = await res.json();
            apiErrors.push(
              `Failed to delete course ${deletedCourses[i].courseCode}: ${
                data.message || "Unknown error"
              }`
            );
          }
        }
      }

      if (apiErrors.length > 0) {
        setStatusMessage({ type: "error", text: apiErrors.join(" \n ") });
      } else if (isSuccess) {
        setStatusMessage({
          type: "success",
          text: "Course offerings successfully saved!",
        });
        // Optionally clear local change trackers on full success
        setAddedCourses([]);
        setUpdatedCourses([]);
        setDeletedCourses([]);
        // Re-fetch data or manage state to reflect saved changes accurately
      } else if (
        updatedCourses.length === 0 &&
        addedCourses.length === 0 &&
        deletedCourses.length === 0
      ) {
        setStatusMessage({ type: "error", text: "No changes to save." });
      }
    } catch (error) {
      console.error("Error saving courses:", error);
      setStatusMessage({
        type: "error",
        text: "An error occurred while saving. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const department = localStorage.getItem("department") ?? "CS";
        const setters = [
          setFirstYearCourses,
          setSecondYearCourses,
          setThirdYearCourses,
          setFourthYearCourses,
        ];
        for (let i = 1; i <= 4; i++) {
          const res = await fetch(
            `/api/courseofferings/${i}/2/${department}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
              },
            }
          );
          const data = await res.json();
          if (res.ok) {
            const transformedCourses: CourseInfo[] = data.map(
              (course: any) => ({
                title: course.courseName,
                code: course.courseCode,
                unit: course.totalUnits.toString(), // Ensure unit is string
                type: course.courseType,
                category: course.courseCategory,
                yearLevel: i.toString(), // Store as string to match Option values
              })
            );
            setters[i - 1](transformedCourses);
          } else {
            console.log(
              `Error fetching year ${i} courses:`,
              data.message || "Server error"
            );
            setters[i - 1]([]); // Clear courses for that year on error
          }
        }
      } catch (err) {
        console.log("Error fetching course data:", err);
        // Potentially set an error state for the whole page
      }
    };
    fetchCourseData();
  }, []);

  const MemoizedFirstYearCourseList = useMemo(
    () =>
      firstYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={1} // Pass as number
          course={course}
          key={`${course.code}-${index}`} // More robust key
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange} // Prop kept for consistency, though not actively used by CourseOffering
          handleDeleteCourse={requestDeleteExistingCourse} // Use modal trigger
        />
      )),
    [
      firstYearCourses,
      handleCourseCodeChange,
      handleCourseCategoryChange,
      handleCourseTitleChange,
      handleCourseTypeChange,
      handleCourseUnitChange,
      handleCourseYearLevelChange,
      requestDeleteExistingCourse,
    ]
  );

  const MemoizedSecondYearCourseList = useMemo(
    () =>
      secondYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={2}
          course={course}
          key={`${course.code}-${index}`}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={requestDeleteExistingCourse}
        />
      )),
    [
      secondYearCourses,
      handleCourseCodeChange,
      handleCourseCategoryChange,
      handleCourseTitleChange,
      handleCourseTypeChange,
      handleCourseUnitChange,
      handleCourseYearLevelChange,
      requestDeleteExistingCourse,
    ]
  );

  const MemoizedThirdYearCourseList = useMemo(
    () =>
      thirdYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={3}
          course={course}
          key={`${course.code}-${index}`}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={requestDeleteExistingCourse}
        />
      )),
    [
      thirdYearCourses,
      handleCourseCodeChange,
      handleCourseCategoryChange,
      handleCourseTitleChange,
      handleCourseTypeChange,
      handleCourseUnitChange,
      handleCourseYearLevelChange,
      requestDeleteExistingCourse,
    ]
  );

  const MemoizedFourthYearCourseList = useMemo(
    () =>
      fourthYearCourses.map((course, index) => (
        <CourseOffering
          yearLevel={4}
          course={course}
          key={`${course.code}-${index}`}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={requestDeleteExistingCourse}
        />
      )),
    [
      fourthYearCourses,
      handleCourseCodeChange,
      handleCourseCategoryChange,
      handleCourseTitleChange,
      handleCourseTypeChange,
      handleCourseUnitChange,
      handleCourseYearLevelChange,
      requestDeleteExistingCourse,
    ]
  );

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const clearStatusMessage = () => {
    setStatusMessage({ type: null, text: "" });
  };

  const handleFilter = () => {
    const allCourses = [
      ...firstYearCourses,
      ...secondYearCourses,
      ...thirdYearCourses,
      ...fourthYearCourses,
    ];

    if (yearFilter === 0 && searchValue.length === 0) {
      setSearchResults([]);
      return;
    }

    let filteredByYear = allCourses;
    if (yearFilter > 0) {
      filteredByYear = allCourses.filter(
        (course) => parseInt(course.yearLevel.toString()) === yearFilter
      );
    }

    if (searchValue.length > 0) {
      const fuzzyMatches = filteredByYear.filter(
        (course) =>
          fuzzyMatch(searchValue, course.title) ||
          fuzzyMatch(searchValue, course.code)
      );
      setSearchResults(fuzzyMatches);
    } else {
      setSearchResults(filteredByYear);
    }
  };

  // useEffect(() => {
  //   console.log(searchResults); // Keep for debugging if needed
  // }, [searchResults]);

  // const handleSearch = () => {
  //   // Simplified, relies on handleFilter
  //   handleFilter();
  // };

  // useEffect to auto-filter when searchValue or yearFilter changes
  useEffect(() => {
    handleFilter();
  }, [
    searchValue,
    yearFilter,
    firstYearCourses,
    secondYearCourses,
    thirdYearCourses,
    fourthYearCourses,
  ]);

  const MemoizedSearchResultsList = useMemo(
    () =>
      searchResults.map((course, index) => (
        <CourseOffering
          yearLevel={parseInt(course.yearLevel.toString())}
          course={course}
          key={`search-${course.code}-${index}`}
          handleCourseCodeChange={handleCourseCodeChange}
          handleCourseCategoryChange={handleCourseCategoryChange}
          handleCourseTitleChange={handleCourseTitleChange}
          handleCourseTypeChange={handleCourseTypeChange}
          handleCourseUnitChange={handleCourseUnitChange}
          handleCourseYearLevelChange={handleCourseYearLevelChange}
          handleDeleteCourse={requestDeleteExistingCourse}
        />
      )),
    [
      searchResults,
      handleCourseCodeChange,
      handleCourseCategoryChange,
      handleCourseTitleChange,
      handleCourseTypeChange,
      handleCourseUnitChange,
      handleCourseYearLevelChange,
      requestDeleteExistingCourse,
    ]
  );

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
        <section className="px-16 mt-5 flex gap-11 font-Helvetica-Neue-Heavy items-center justify-center">
          <div className="text-primary text-[35px]">Course Offerings</div>
          <div className="bg-custom_yellow p-2 rounded-md">
            1st Semester A.Y 2025-2026
          </div>
        </section>

        <div className="w-full flex justify-center my-4">
          <div className="flex w-[60%] justify-between bg-primary/15 px-4 py-3 rounded-xl items-center">
            <div className="flex gap-x-2">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                className="rounded-md text-sm py-1 px-4 w-[18rem]"
                placeholder="Search by Course Code or Course Name"
              />
              {/* Search button can be removed if useEffect handles filtering */}
              {/* <button
                className="text-sm bg-primary rounded-md text-white px-4 font-semibold"
                onClick={handleSearch} 
              >
                Search
              </button> */}
            </div>

            <div className="flex gap-x-2 items-center">
              <h1 className="text-sm">Filter By Years</h1>
              <select
                name="yearFilter"
                id="yearFilter"
                value={yearFilter}
                onChange={(e) => setYearFilter(parseInt(e.target.value))}
                className="rounded-md px-2 text-sm py-1 w-[6rem]"
              >
                <option value="0">All Years</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              {/* Filter button can be removed if useEffect handles filtering */}
              {/* <button
                className="text-sm bg-primary rounded-md text-white px-4 font-semibold py-1"
                onClick={handleFilter}
              >
                Filter
              </button> */}
            </div>
          </div>
        </div>

        {(searchValue.length > 0 || yearFilter > 0) &&
          searchResults.length > 0 && (
            <div className="flex flex-col justify-center">
              {MemoizedSearchResultsList}
            </div>
          )}

        {(searchValue.length > 0 || yearFilter > 0) &&
          searchResults.length === 0 && (
            <div className="text-center my-10 text-gray-500">
              No courses match your search criteria.
            </div>
          )}

        {/* Display all courses if no search/filter is active */}
        {searchResults.length === 0 &&
          searchValue.length === 0 &&
          yearFilter === 0 && (
            <form className="flex flex-col">
              {firstYearCourses.length > 0 && (
                <h1 className="text-xl font-bold text-primary mx-auto my-4">
                  First Year Courses
                </h1>
              )}
              {MemoizedFirstYearCourseList}
              {secondYearCourses.length > 0 && (
                <h1 className="text-xl font-bold text-primary mx-auto my-4">
                  Second Year Courses
                </h1>
              )}
              {MemoizedSecondYearCourseList}
              {thirdYearCourses.length > 0 && (
                <h1 className="text-xl font-bold text-primary mx-auto my-4">
                  Third Year Courses
                </h1>
              )}
              {MemoizedThirdYearCourseList}
              {fourthYearCourses.length > 0 && (
                <h1 className="text-xl font-bold text-primary mx-auto my-4">
                  Fourth Year Courses
                </h1>
              )}
              {MemoizedFourthYearCourseList}

              {addedCourses.map((course, index) => (
                <section
                  key={`added-${index}`}
                  className="flex mx-auto gap-7 font-semibold mb-5 items-center" // Added items-center
                >
                  <div className=" bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope">
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
                          handleAddedCourseCategoryChange(
                            index,
                            option as Option
                          )
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
                            (option) =>
                              option.value === course.yearLevel.toString()
                          ) || null
                        }
                        onChange={(option) =>
                          handleAddedCourseYearLevelChange(
                            index,
                            option as Option
                          )
                        }
                        className="w-[70px] rounded-[5px]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => requestDeleteAddedCourse(index)} // Use modal trigger
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
                    style={{ whiteSpace: "pre-line" }} // To allow newlines in error messages
                  >
                    <span className="flex-grow text-left">
                      {statusMessage.text}
                    </span>{" "}
                    {/* text-left for multiline */}
                    <button
                      onClick={clearStatusMessage}
                      className="text-gray-600 hover:text-gray-900 ml-5 flex items-center self-start" // self-start for alignment
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
                        {" "}
                        <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
                        <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
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
          )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            {" "}
            {/* Responsive width */}
            <h3 className="text-lg font-bold text-primary mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the course
              {courseToDelete.courseInfo?.title
                ? ` "${courseToDelete.courseInfo.title}"`
                : ""}
              {courseToDelete.courseInfo?.code
                ? ` (${courseToDelete.courseInfo.code})`
                : courseToDelete.type === "added"
                ? " (this newly added course)"
                : ""}
              ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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

const CourseOffering: React.FC<{
  yearLevel: number; // Expect number for consistency
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
  ) => void; // Kept for prop consistency, though Select is disabled
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
    // handleCourseYearLevelChange, // This prop is passed but the Select below is disabled.
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
        yearLevelOptions.find(
          (option) => option.value === String(course.yearLevel)
        ) || null,
      [course.yearLevel]
    );

    return (
      <>
        <section className="flex mx-auto gap-7 mb-5 items-center">
          {" "}
          {/* Added items-center */}
          <div className=" bg-[rgba(241,250,255,0.5)] p-6 shadow-md rounded-xl font-Manrope">
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
                  handleCourseCategoryChange(
                    yearLevel,
                    course.code,
                    option as Option
                  )
                } // Corrected to use yearLevel
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
                    backgroundColor: "#e9ecef",
                  }),
                }} // Added disabled style
                value={yearLevelValue}
                // onChange={(option) => handleCourseYearLevelChange(index, option as Option)} // `index` is not available here, and Select is disabled
                className="w-[70px] rounded-[5px]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDeleteCourse(course, yearLevel)} // Corrected to pass actual yearLevel
            className="w-7 transition-all duration-300 active:scale-95 active:shadow-lg" // Added active effects
          >
            <img src={trash_button} alt="Remove" />
          </button>
        </section>
      </>
    );
  }
);

export default InputCourseOfferings;
