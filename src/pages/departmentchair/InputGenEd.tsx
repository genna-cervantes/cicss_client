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

import add_button from "../../assets/add_button.png";
import trash_button from "../../assets/trash_button.png";
import add_button_white from "../../assets/add_button_white.png";

interface TimeEntry {
  start: string;
  end: string;
}

interface Restriction {
  day: string;
  startEndTimes: TimeEntry[];
}

interface GenEdInfo {
  courseTitle: string;
  courseCode: string;
  courseRestriction: Restriction[];
}

interface Option {
  value: string;
  label: string;
}

const courseOptions: Option[] = [
  { value: "coa", label: "Computer Organization and Architecture" },
  { value: "stats", label: "Advanced Statistics and Probability" },
  { value: "desalgo", label: "Design and Analysis of Algorithms" },
  { value: "appdev1", label: "Applications Development 1" },
  { value: "se1", label: "Software Engineering 1" },
  { value: "se2", label: "Software Engineering 2" },
  { value: "automata", label: "Theory of Automata" },
  { value: "thesis1", label: "Thesis 1" },
];

const dayOptions: Option[] = [
  { value: "M", label: "Monday" },
  { value: "T", label: "Tuesday" },
  { value: "W", label: "Wednesday" },
  { value: "TH", label: "Thursday" },
  { value: "F", label: "Friday" },
  { value: "S", label: "Saturday" },
];

const getDayOptions = (
  currentRestriction: string,
  currentDayRestrictions: Restriction[]
) => {
  const availableDays = dayOptions.filter(
    (opt) => !currentDayRestrictions.some((res) => res.day === opt.value)
  );

  const currentDayOption = dayOptions.find(
    (opt) => opt.value === currentRestriction
  );

  return currentDayOption
    ? [...availableDays, currentDayOption]
    : availableDays;
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #02296D",
    borderRadius: "6px",
    width: "200px",
    height: "38px",
    padding: "0 2px",
  }),
};

const InputGenEd = () => {
  // Store an array of GenED with constraints
  const [genEdList, setGenEdList] = useState<GenEdInfo[]>([
    {
      courseTitle: "",
      courseCode: "",
      courseRestriction: [{ day: "", startEndTimes: [{ start: "", end: "" }] }],
    },
  ]);

  const [updatedGenedConstraints, setUpdatedGenedConstraints] = useState<
    {
      courseCode: string;
      courseRestriction: Restriction[];
    }[]
  >([]);

  //Handler for changing a restriction's day for a specific GenEd Course
  const handleGenEdDayRestrictionChange = useCallback(
    (courseCode: string, selectedOption: Option | null, restricitonIndex: number) => {
      if (selectedOption == null) {
        return;
      }

      console.log("getting called");
      console.log(selectedOption);

      setGenEdList((prev) => {
        const index = prev.findIndex(
          (course) => course.courseCode === courseCode
        );
        if (index === -1) return prev; // No change if course not found

        const course = prev[index];
        let resIndex = restricitonIndex;

        console.log('res index', resIndex)

        let updatedRestrictions;

        // Update existing restriction
        updatedRestrictions = course.courseRestriction.map((res, i) =>
          i === resIndex ? { ...res, day: selectedOption.value } : res
        );

        // Update course with new restrictions
        const updatedCourse = {
          ...course,
          courseRestriction: updatedRestrictions,
        };

        handleUpdate({genedConstraint: updatedCourse})

        // Return new list with updated course
        const newGenedConstraints = [...prev];
        newGenedConstraints[index] = updatedCourse;

        return newGenedConstraints;
      });

    },
    []
  );

  useEffect(() => {
    console.log('updated gened constraints')
    console.log(updatedGenedConstraints)
  }, [updatedGenedConstraints])

  // Handler for changing a time field (start or end) for a specific GenEd Course
  const handleGenEdTimeRestrictionChange = useCallback(
    (
      genEdIndex: number,
      restrictionIndex: number,
      timeIndex: number,
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const { name, value } = e.target;

      console.log(value);
      setGenEdList((prev) => {
        const index = genEdIndex;
        if (index === -1) return prev; // No change if course not found

        const course = prev[index];
        const resIndex = restrictionIndex;

        let updatedRestrictions;

        // Update existing restriction
        updatedRestrictions = course.courseRestriction.map((res, i) => {
          if (i === resIndex) {
            let updatedStartEndTimes = res.startEndTimes.map((set, si) => {
              if (si === timeIndex) {
                return {
                  ...set,
                  [name]: value,
                };
              } else {
                return set;
              }
            });

            return { ...res, startEndTimes: updatedStartEndTimes };
          } else {
            return { ...res };
          }
        });

        // Update course with new restrictions
        const updatedCourse = {
          ...course,
          courseRestriction: updatedRestrictions,
        };

        handleUpdate({genedConstraint: updatedCourse})

        // Return new list with updated course
        const newGenedConstraints = [...prev];
        newGenedConstraints[genEdIndex] = updatedCourse;

        return newGenedConstraints;
      });

    },
    []
  );

  // Handler to add a new day restriciton to a specific GenEd Course
  const handleAddDayRestriction = useCallback(
    (courseCode: string, e: FormEvent) => {
      e.preventDefault();

      setGenEdList((prev) => {
        let index = prev.findIndex((gened) => gened.courseCode === courseCode);

        let updatedGened = {
          ...prev[index],
          courseRestriction: [
            ...prev[index].courseRestriction,
            { day: "", startEndTimes: [{ start: "", end: "" }] },
          ],
        };

        handleUpdate({genedConstraint: updatedGened})

        let updatedGenedConstraints = [...prev];
        updatedGenedConstraints[index] = updatedGened;

        return updatedGenedConstraints;
      });
    },
    []
  );

  // Handler to delete a day restriction from a specific GenEd Course
  const handleDeleteDayRestriction = useCallback(
    (genEdIndex: number, restrictionIndex: number) => {
      setGenEdList((prev) => {
        const updated = [...prev];
        updated[genEdIndex] = {
          ...updated[genEdIndex],
          courseRestriction: updated[genEdIndex].courseRestriction.filter(
            (_, i) => i !== restrictionIndex
          ),
        };

        handleUpdate({genedConstraint: updated[genEdIndex]})

        return updated;
      });
    },
    []
  );

  // Handler to add a new time entry to a GenEd Course
  const handleAddTimeRestriction = useCallback(
    (genEdIndex: number, restrictionIndex: number) => {
      setGenEdList((prev) => {
        const updated = [...prev];
        const updatedRequests = [...updated[genEdIndex].courseRestriction];
        updatedRequests[restrictionIndex] = {
          ...updatedRequests[restrictionIndex],
          startEndTimes: [
            ...updatedRequests[restrictionIndex].startEndTimes,
            { start: "", end: "" },
          ],
        };
        updated[genEdIndex] = {
          ...updated[genEdIndex],
          courseRestriction: updatedRequests,
        };

        handleUpdate({genedConstraint: updated[genEdIndex]})

        return updated;
      });
    },
    []
  );

  // Handler to delete a time entry from a GenEd Course
  const handleDeleteTimeRestriction = useCallback(
    (genEdIndex: number, requestIndex: number, timeIndex: number) => {
      setGenEdList((prev) => {
        const updated = [...prev];
        const updatedRequests = [...updated[genEdIndex].courseRestriction];
        // Only delete if more than one time entry exists
        if (updatedRequests[requestIndex].startEndTimes.length > 1) {
          updatedRequests[requestIndex] = {
            ...updatedRequests[requestIndex],
            startEndTimes: updatedRequests[requestIndex].startEndTimes.filter(
              (_, i) => i !== timeIndex
            ),
          };
        }
        updated[genEdIndex] = {
          ...updated[genEdIndex],
          courseRestriction: updatedRequests,
        };

        handleUpdate({genedConstraint: updated[genEdIndex]})

        return updated;
      });
    },
    []
  );

  const handleUpdate = ({genedConstraint}: {genedConstraint: GenEdInfo}) => {
    setUpdatedGenedConstraints((prev) => {
      let newGened = [...prev]
      let index = prev.findIndex((gen) => gen.courseCode === genedConstraint.courseCode)
      if (index === -1){
        newGened.push({courseCode: genedConstraint.courseCode, courseRestriction: genedConstraint.courseRestriction})
      }else{
      newGened[index] = {courseCode: genedConstraint.courseCode, courseRestriction: genedConstraint.courseRestriction}
      }
      return newGened;
    })
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    // handle update
    const updateGenedConstraintData = async () => {
      for (let i = 0; i < updatedGenedConstraints.length; i++){
        let genedcon = updatedGenedConstraints[i]

        let transformedRestrictions: any = {
          M: [],
          T: [],
          W: [],
          TH: [],
          F: [],
          S: []
        };
        genedcon.courseRestriction.forEach((res) => {
          let transformedStartEndTimes = res.startEndTimes.map((set) => {
            return {
              start: `${set.start.slice(0,2)}${set.start.slice(3)}`,
              end: `${set.end.slice(0,2)}${set.end.slice(3)}`
            }
          })
          transformedRestrictions[res.day] = transformedStartEndTimes
        })

        const res = await fetch(`http://localhost:8080/genedconstraint/${genedcon.courseCode}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token") ?? ''}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify(transformedRestrictions)
        })

        if (res.ok){
          console.log('yey updated')
        }else{
          console.log('may error sis')
        }
      }
    }
    updateGenedConstraintData()
  };

  // fetch data
  useEffect(() => {
    const getGenedCourseConstraintData = async () => {
      const res = await fetch("http://localhost:8080/genedconstraint", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // courseTitle courseCode restrictions
        // [{ day: "", startEndTimes: [{ start: "", end: "" }] }]
        let transformedGenedConstraints = [];
        transformedGenedConstraints = data.map((genedConstraint: any) => {
          let genedConstraintRestrictionKeys = Object.keys(
            genedConstraint.restrictions
          );

          let transformedGenedConstraintRestrictions =
            genedConstraintRestrictionKeys
              .map((genedkey: string) => {
                if (genedConstraint.restrictions[genedkey].length > 0) {
                  let transformedStartEndTimes = genedConstraint.restrictions[
                    genedkey
                  ].map((time: any) => {
                    let start = time?.start
                      ? `${time.start.slice(0, 2)}:${time.start.slice(2)}`
                      : "";
                    let end = time?.end
                      ? `${time.end.slice(0, 2)}:${time.end.slice(2)}`
                      : "";

                    return { start, end };
                  });

                  return {
                    day: genedkey,
                    startEndTimes: transformedStartEndTimes, // genedConstraint.restrictions[genedkey],
                  };
                }
                return undefined; // Explicitly return undefined
              })
              .filter(Boolean); // Removes all falsy values (undefined)

          return {
            courseTitle: genedConstraint.courseName,
            courseCode: genedConstraint.courseCode,
            courseRestriction: transformedGenedConstraintRestrictions,
          };
        });

        console.log(transformedGenedConstraints);
        setGenEdList(transformedGenedConstraints);

        console.log(data);
      } else {
        console.log("error in fetching");
      }
    };

    getGenedCourseConstraintData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">Gen Ed Constraints</div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>
      <section className="flex font-Manrope mx-11 my-11 font-extrabold">
        <p className="ml-[160px]">No.</p>
        <p className="ml-[90px]">Course Title</p>
        <p className="ml-[80px]">Course Code</p>
        <p className="ml-[300px]">Time Restriction</p>
      </section>

      <div className="flex mx-auto gap-5 font-Manrope font-semibold">
        <form onSubmit={handleSave}>
          {genEdList.map((genEdCourse, genEdIndex) => {
            if (genEdIndex === 1) console.log(genEdCourse);
            return (
              <div key={genEdIndex} className="mb-7 flex gap-3">
                <div className="flex gap-5 bg-[#F1FAFF] px-5 pt-5 rounded-xl shadow-sm w-full">
                  <div className="flex gap-3">
                    <div className="flex justify-center gap-3">
                      <div>
                        <input
                          disabled
                          type="text"
                          name="courseCode"
                          value={genEdCourse.courseTitle}
                          // onChange={(e) => handleCourseCodeChange(genEdIndex, e)}
                          placeholder="Enter"
                          className="h-[38px] border border-primary rounded-[5px] px-2 w-[200px]"
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        disabled
                        type="text"
                        name="courseCode"
                        value={genEdCourse.courseCode}
                        // onChange={(e) => handleCourseCodeChange(genEdIndex, e)}
                        placeholder="Enter"
                        className="h-[38px] border border-primary rounded-[5px] px-2 w-[200px]"
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    {/* kapag wala ndi siya nag mmap */}
                    {genEdCourse.courseRestriction.length > 0 ? (
                      <div>
                        {genEdCourse.courseRestriction.map(
                          (restriction, restrictionIndex) => {
                            return (
                              <DayRestriction
                                key={restrictionIndex}
                                restriction={restriction}
                                restrictionIndex={restrictionIndex}
                                genEdCourse={genEdCourse}
                                genEdIndex={genEdIndex}
                                handleAddTimeRestriction={
                                  handleAddTimeRestriction
                                }
                                handleDeleteTimeRestriction={
                                  handleDeleteTimeRestriction
                                }
                                handleGenEdDayRestrictionChange={
                                  handleGenEdDayRestrictionChange
                                }
                                handleGenEdTimeRestrictionChange={
                                  handleGenEdTimeRestrictionChange
                                }
                                handleDeleteDayRestriction={
                                  handleDeleteDayRestriction
                                }
                              />
                            );
                          }
                        )}
                        {genEdCourse.courseRestriction.length < 6 && (
                          <button
                            onClick={(e) =>
                              handleAddDayRestriction(genEdCourse.courseCode, e)
                            }
                            className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                          >
                            Add Day
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="bg-[#BFDDF6] p-5 rounded-md mb-5 w-full">
                        {genEdCourse.courseRestriction.length < 6 && (
                          <button
                            onClick={(e) =>
                              handleAddDayRestriction(genEdCourse.courseCode, e)
                            }
                            className="bg-primary text-white py-1 px-4 text-xs rounded-md"
                          >
                            Add Day
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="justify-center flex gap-4 font-Manrope font-semibold">
            <button
              type="submit"
              className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary mt-20 mb-24 rounded-sm hover:bg-primary hover:text-white"
            >
              Save
            </button>
            {/* walang add dito kasi lahat ng gened course nakalagay na here */}
          </div>
        </form>
      </div>
    </div>
  );
};

const DayRestriction = React.memo(
  ({
    genEdCourse,
    restriction,
    genEdIndex,
    restrictionIndex,
    handleGenEdDayRestrictionChange,
    handleGenEdTimeRestrictionChange,
    handleDeleteTimeRestriction,
    handleAddTimeRestriction,
    handleDeleteDayRestriction,
  }: {
    genEdCourse: GenEdInfo;
    restriction: Restriction;
    genEdIndex: number;
    restrictionIndex: number;
    handleGenEdDayRestrictionChange: (courseCode: string, selectedOption: Option | null, restricitonIndex: number) => void
    handleGenEdTimeRestrictionChange: (
      genEdIndex: number,
      restrictionIndex: number,
      timeIndex: number,
      e: ChangeEvent<HTMLInputElement>
    ) => void;
    handleDeleteTimeRestriction: (
      genEdIndex: number,
      requestIndex: number,
      timeIndex: number
    ) => void;
    handleAddTimeRestriction: (
      genEdIndex: number,
      restrictionIndex: number
    ) => void;
    handleDeleteDayRestriction: (
      genEdIndex: number,
      restrictionIndex: number
    ) => void;
  }) => {
    const dayOptionsMemoized = useMemo(
      () => getDayOptions(restriction.day, genEdCourse.courseRestriction),
      [genEdCourse.courseRestriction]
    );

    const customStylesMemoized = useMemo(() => customStyles, []);

    const onChangeHandler = useCallback(
      (selectedOption: any) =>
        handleGenEdDayRestrictionChange(genEdCourse.courseCode, selectedOption, restrictionIndex),
      [genEdCourse.courseCode, handleGenEdDayRestrictionChange]
    );

    const selectedValue = useMemo(
      () =>
        dayOptionsMemoized.find((opt) => opt.value === restriction.day) || null,
      [dayOptionsMemoized, restriction.day]
    );

    return (
      <div className="bg-[#BFDDF6] p-5 rounded-md mb-5">
        <div className="flex gap-3 justify-center">
          <div className="flex gap-3 items-center mb-3">
            <label>Day</label>
            <MemoizedSelect
              selectedValue={selectedValue}
              onChangeHandler={onChangeHandler}
              customStylesMemoized={customStylesMemoized}
              dayOptionsMemoized={dayOptionsMemoized}
            />
          </div>

          <div className="flex flex-col">
            {restriction.startEndTimes.length > 0 ? (
              restriction.startEndTimes.map((time, timeIndex) => {
                return (
                  <div key={timeIndex} className="mb-3">
                    <div className="flex items-center gap-3 justify-center">
                      <label>Start</label>
                      <input
                        type="time"
                        name="start"
                        value={time.start}
                        onChange={(e) =>
                          handleGenEdTimeRestrictionChange(
                            genEdIndex,
                            restrictionIndex,
                            timeIndex,
                            e
                          )
                        }
                        className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                      />
                      <label>End</label>
                      <input
                        type="time"
                        name="end"
                        value={time.end}
                        onChange={(e) =>
                          handleGenEdTimeRestrictionChange(
                            genEdIndex,
                            restrictionIndex,
                            timeIndex,
                            e
                          )
                        }
                        className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                      />
                      {restriction.startEndTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteTimeRestriction(
                              genEdIndex,
                              restrictionIndex,
                              timeIndex
                            )
                          }
                        >
                          <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleAddTimeRestriction(genEdIndex, restrictionIndex)
                        }
                        className="w-7"
                      >
                        <img src={add_button} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col">
                <div className="mb-3">
                  <div className="flex items-center gap-3 justify-center">
                    <label>Start</label>
                    <input
                      type="time"
                      name="start"
                      value=""
                      onChange={(e) =>
                        handleGenEdTimeRestrictionChange(genEdIndex, 0, 0, e)
                      }
                      className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                    />
                    <label>End</label>
                    <input
                      type="time"
                      name="end"
                      value={
                        genEdCourse?.courseRestriction[0]?.startEndTimes[0]
                          ?.end || ""
                      }
                      onChange={(e) =>
                        handleGenEdTimeRestrictionChange(genEdIndex, 0, 0, e)
                      }
                      className="h-[38px] border w-[130px] border-primary rounded-[5px] py-1 px-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTimeRestriction(genEdIndex, 0, 0)
                      }
                    >
                      <div className="h-[5px] w-[17px] bg-primary rounded-2xl"></div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddTimeRestriction(genEdIndex, 0)}
                      className="w-7"
                    >
                      <img src={add_button} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={() => handleDeleteDayRestriction(genEdIndex, restrictionIndex)}
            className="border border-primary text-primary py-1 px-4 text-xs rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
);

const MemoizedSelect = React.memo(
  ({
    dayOptionsMemoized,
    selectedValue,
    onChangeHandler,
    customStylesMemoized,
  }: {
    dayOptionsMemoized: any;
    selectedValue: any;
    onChangeHandler: any;
    customStylesMemoized: any;
  }) => {
    return (
      <Select
        options={dayOptionsMemoized}
        placeholder="Select"
        value={selectedValue}
        onChange={onChangeHandler}
        styles={customStylesMemoized}
      />
    );
  }
);

export default InputGenEd;
