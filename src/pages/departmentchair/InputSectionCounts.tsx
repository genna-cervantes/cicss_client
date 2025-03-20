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

  const handleSectionCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSectionCounts((prevCounts) => ({
      ...prevCounts,
      [name]: value ? parseInt(value, 10) : "",
    }));
  };

  // fetch data
  useEffect(() => {
    const fetchYearSectionsData = async () => {
      const res = await fetch("http://localhost:8080/year_sections/CS");
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

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    console.log(reqBody)

    const res = await fetch("http://localhost:8080/year_sections", {
      method: "POST",
      headers: {
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
    <form onSubmit={handleSave} className="flex flex-col">
      <div className="mx-auto py-10">
        <Navbar />
      </div>
      <section className="px-16 flex gap-11 font-Helvetica-Neue-Heavy items-center">
        <div className="text-primary text-[35px]">Section Counts</div>
        <div className="bg-custom_yellow p-2 rounded-md">
          1st Semester A.Y 2025-2026
        </div>
      </section>
      <section className="mx-auto my-11">
        <div className="flex gap-36 font-Manrope font-extrabold">
          <p>1st Year</p>
          <p>2nd Year</p>
          <p>3rd Year</p>
          <p>4th Year</p>
        </div>
      </section>
      <section className="flex justify-center font-Manrope font-semibold">
        <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)]">
          <div className="p-6 flex gap-32">
            <div>
              <div className="flex flex-col">
                <input
                  type="number"
                  id="firstSC"
                  name="firstSC"
                  value={sectionCounts.firstSC}
                  onChange={handleSectionCountChange}
                  className="border border-primary rounded-md w-20 p-2"
                  placeholder="0"
                />
                {typeof sectionCounts.firstSC == "number" &&
                  Array.from({ length: sectionCounts.firstSC }).map((_, i) => {
                    firstYearSections[i].specialization = 'none'
                    return (
                      <input
                        key={i}
                        type="text"
                        className="border border-primary rounded-md w-24 p-2 my-2"
                        value={firstYearSections[i]?.section ?? ""}
                        onChange={(e) =>
                          setFirstYearSections((prev) => {
                            const newSections = [...prev];
                            newSections[i] = {
                              specialization: 'none',
                              section: e.target.value,
                            };
                            return newSections;
                          })
                        }
                      />
                    );
                  })}
              </div>
            </div>
            <div>
              <input
                type="number"
                id="secondSC"
                name="secondSC"
                value={sectionCounts.secondSC}
                onChange={handleSectionCountChange}
                className="border border-primary rounded-md w-20 p-2"
                placeholder="0"
              />
              <div className="flex flex-col">
                {typeof sectionCounts.secondSC == "number" &&
                  Array.from({ length: sectionCounts.secondSC }).map((_, i) => {
                    secondYearSections[i].specialization = 'none'
                    return (
                      <input
                        key={i}
                        type="text"
                        className="border border-primary rounded-md w-24 p-2 my-2"
                        value={secondYearSections[i]?.section ?? ""}
                        onChange={(e) =>
                          setSecondYearSections((prev) => {
                            const newSections = [...prev];
                            newSections[i] = {
                              specialization: 'none',
                              section: e.target.value,
                            };
                            return newSections;
                          })
                        }
                      />
                    );
                  })}
              </div>
            </div>
            <div>
              <input
                type="number"
                id="thirdSC"
                name="thirdSC"
                value={sectionCounts.thirdSC}
                onChange={handleSectionCountChange}
                className="border border-primary rounded-md w-20 p-2"
                placeholder="0"
              />
              <div className="flex flex-col">
                {typeof sectionCounts.thirdSC == "number" &&
                  Array.from({ length: sectionCounts.thirdSC }).map((_, i) => {
                    return (
                      <span key={i}>
                        <input
                          type="text"
                          className="border border-primary rounded-md w-24 p-2 my-2"
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
                        <select
                          name="thirdYearSpecializations"
                          id="thirdYearSpecializations"
                          value={thirdYearSections[i]?.specialization ?? "none"}
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
                          <option value="Data Science">Data Science</option>
                          <option value="Core CS">
                            Core Computer Science
                          </option>
                          <option value="Game Development">
                            Game Development
                          </option>
                        </select>
                      </span>
                    );
                  })}
              </div>
            </div>
            <div>
              <input
                type="number"
                id="fourthSC"
                name="fourthSC"
                value={sectionCounts.fourthSC}
                onChange={handleSectionCountChange}
                className="border border-primary rounded-md w-20 p-2"
                placeholder="0"
              />
              <div className="flex flex-col">
                {typeof sectionCounts.fourthSC == "number" &&
                  Array.from({ length: sectionCounts.fourthSC }).map((_, i) => {
                    return (
                      <span key={i}>
                        <input
                          type="text"
                          className="border border-primary rounded-md w-24 p-2 my-2"
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
                        <select
                          name="fourthYearSpecializations"
                          id="fourthYearSpecializations"
                          value={
                            fourthYearSections[i]?.specialization ?? "none"
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
                          <option value="Data Science">Data Science</option>
                          <option value="Core CS">
                            Core Computer Science
                          </option>
                          <option value="Game Development">
                            Game Development
                          </option>
                        </select>
                      </span>
                    );
                  })}
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
  );
};

export default InputSectionCounts;
