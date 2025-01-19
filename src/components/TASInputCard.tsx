import Select from "react-select";
import makeAnimated from "react-select/animated";
import add_button from "../assets/add_button.png";
import trash_button from "../assets/trash_button.png";

const TASInputCard = ({
  profNum,
  onDelete,
}: {
  profNum: number;
  onDelete: () => void;
}) => {
  // List of Courses
  const courseOptions = [
    { value: "coa", label: "Computer Organization and Architecture" },
    { value: "stats", label: "Advanced Statistics and Probability" },
    { value: "desalgo", label: "Design and Analysis of Algorithms" },
    { value: "appdev1", label: "Applications Development 1" },
    { value: "se1", label: "Software Engineering 1" },
    { value: "se2", label: "Software Engineering 2" },
    { value: "automata", label: "Theory of Automata" },
    { value: "thesis1", label: "Thesis 1" },
  ];

  // Day Options
  const dayOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
  ];

  // Prof Status
  const profStatus = [
    { value: "part-time", label: "Part-Time" },
    { value: "full-time", label: "Full-Time" },
  ];

  const animatedComponents = makeAnimated();

  const customStyles = {
    valueContainer: (provided: any) => ({
      ...provided,
      maxHeight: "160px",
      overflowY: "auto",
    }),
  };

  return (
    <div className="font-Manrope font-bold flex gap-5">
      <div className="bg-[rgba(241,250,255,0.5)] flex gap-6 items-start p-4 rounded-lg shadow-md">
        <div>Prof {profNum}</div>
        <input
          type="text"
          placeholder="Enter Professor Name"
          className="h-[38.5px] border border-primary rounded-[5px] px-2 w-[200px]"
        />

        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={profStatus}
          className="w-36 border border-primary rounded-[5px]"
        />

        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          isClearable={false}
          options={courseOptions}
          styles={customStyles}
          classNamePrefix="custom-select"
          className="w-[200px] border border-primary rounded-[5px]"
        />

        <div className="flex flex-col items-center bg-custom_skyblue gap-5 p-5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="font-Manrope font-bold text-sm">Day</div>
            <div>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={dayOptions}
                className="w-36 border border-primary rounded-[5px]"
              />
            </div>

            <div className="flex gap-3 items-center bg-[#E4F2FC] p-5 rounded-md font-Manrope font-bold text-sm">
              <div>Start</div>
              <input
                type="time"
                id="start-time"
                className="h-[38.5px] border border-primary rounded-[5px] py-1 px-2"
              />
              <div>End</div>
              <input
                type="time"
                id="end-time"
                className="h-[38.5px] border border-primary rounded-[5px] py-1 px-2"
              />
              <button className="w-7">
                <img src={add_button} />
              </button>
            </div>
          </div>

          <button className="bg-primary text-white font-Manrope py-1 px-5 rounded-md text-sm font-bold">
            Add Day
          </button>
        </div>
      </div>
      <button onClick={onDelete}>
        <img src={trash_button} className="w-9" />
      </button>
    </div>
  );
};

export default TASInputCard;
