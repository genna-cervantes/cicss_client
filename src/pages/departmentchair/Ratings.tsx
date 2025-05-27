import React, { useEffect } from "react";
import { useState } from "react";
import star_label from "../../assets/star_label.png";
import thumbs_up from "../../assets/thumbs_up.png";
import excellent from "../../assets/excellent.png";
import StudentChart from "../../components/StudentChart";
import { merge } from "lodash";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  totalRatings?: number;
  size?: "small" | "medium" | "large";
}

interface StarProps {
  type: "full" | "partial" | "empty";
  fillPercentage?: number;
  size?: "small" | "medium" | "large";
}

interface CourseOption {
  value: string;
  label: string;
}

interface ProfOption {
  value: string;
  label: string;
}

// Dummy Options
const COURSE_OPTIONS: CourseOption[] = [
  { value: "3CSA", label: "3CSA" },
  { value: "3CSB", label: "3CSB" },
  { value: "3CSC", label: "3CSC" },
  { value: "3CSD", label: "3CSD" },
  { value: "3CSE", label: "3CSE" },
  { value: "3CSF", label: "3CSF" },
];

const PROF_OPTIONS: ProfOption[] = [
  { value: "Estabillo, Cherry Rose", label: "Estabillo, Cherry Rose" },
  { value: "Decamora, Lawrence", label: "Decamora, Lawrence" },
  { value: "Cabero, Jonathan", label: "Cabero, Jonathan" },
  { value: "Eleazar, Mia", label: "Eleazar, Mia" },
];

const Star: React.FC<StarProps> = ({
  type,
  fillPercentage = 0,
  size = "medium",
}) => {
  const getStarColor = () => {
    if (type === "full" || type === "partial") {
      return "#FFD700";
    }
    return "#E0E0E0";
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-5 h-5";
      case "large":
        return "w-10 h-10";
      case "medium":
      default:
        return "w-8 h-8";
    }
  };

  if (type === "partial") {
    return (
      <div className={`${getSizeClass()} relative`}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id={`partialFill-${fillPercentage}`}>
              <stop offset={`${fillPercentage}%`} stopColor="#FFD700" />
              <stop offset={`${fillPercentage}%`} stopColor="#E0E0E0" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#partialFill-${fillPercentage})`}
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${getSizeClass()} relative`}>
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path
          fill={getStarColor()}
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </div>
  );
};

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  totalRatings,
  size = "medium",
}) => {
  const clampedRating = Math.max(0, Math.min(rating, maxRating));

  const renderStars = () => {
    const stars: React.ReactNode[] = [];

    for (let i = 1; i <= maxRating; i++) {
      const difference = clampedRating - i + 1;

      if (difference >= 1) {
        stars.push(<Star key={i} type="full" size={size} />);
      } else if (difference > 0) {
        stars.push(
          <Star
            key={i}
            type="partial"
            fillPercentage={difference * 100}
            size={size}
          />
        );
      } else {
        stars.push(<Star key={i} type="empty" size={size} />);
      }
    }

    return stars;
  };

  const getRatingTextSize = () => {
    switch (size) {
      case "small":
        return "text-3xl";
      case "large":
        return "text-7xl";
      case "medium":
      default:
        return "text-6xl";
    }
  };

  const getTotalRatingsTextSize = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "large":
        return "text-xl";
      case "medium":
      default:
        return "text-lg";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <span className={`${getRatingTextSize()} font-bold text-blue-900 mr-3`}>
          {rating.toFixed(1)}
        </span>
        <div className="flex">{renderStars()}</div>
      </div>
      {totalRatings !== undefined && (
        <div className="flex items-center justify-center">
          <span className={`${getTotalRatingsTextSize()} text-gray-800 mt-1`}>
            Based on {totalRatings} ratings
          </span>
        </div>
      )}
    </div>
  );
};

const Ratings = () => {

  const [currentSectionRatings, setCurrentSectionRatings] = useState(0);
  const [currentSectionNumberOfRatings, setCurrentSectionNumberOfRatings] = useState(0);
  const [currentSectionRatingsCount1, setCurrentSectionRatingsCount1] = useState(0);
  const [currentSectionRatingsCount2, setCurrentSectionRatingsCount2] = useState(0);
  const [currentSectionRatingsCount3, setCurrentSectionRatingsCount3] = useState(0);
  const [currentSectionRatingsCount4, setCurrentSectionRatingsCount4] = useState(0);
  const [currentSectionRatingsCount5, setCurrentSectionRatingsCount5] = useState(0);
  
  const [currentTASRatings, setCurrentTASRatings] = useState(0);
  const [currentTASNumberOfRatings, setCurrentTASNumberOfRatings] = useState(0);
  const [currentTASRatingsCount1, setCurrentTASRatingsCount1] = useState(0);
  const [currentTASRatingsCount2, setCurrentTASRatingsCount2] = useState(0);
  const [currentTASRatingsCount3, setCurrentTASRatingsCount3] = useState(0);
  const [currentTASRatingsCount4, setCurrentTASRatingsCount4] = useState(0);
  const [currentTASRatingsCount5, setCurrentTASRatingsCount5] = useState(0);

  const [yearSections, setYearSections] = useState<{
    [key: string]: { next: string; prev: string; specialization: string };
  }>({});
  const [profDetails, setProfDetails] = useState<{ [key: string]: string }>({});

  const [currentSection, setCurrentSection] = useState<{
    label: string;
    specialization?: string;
  }>({ label: "1CSA", specialization: "" });

  const [currentTAS, setCurrentTAS] = useState<{
    label: string;
    name: string;
  }>({ label: "", name: "" });

  useEffect(() => {
    const getCurrentSectionRatings = async () => {
      const res = await fetch(`/api/ratings/section/${currentSection.label}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token") ?? ""}`
        }
      })

      if (res.ok){
        const data = await res.json();
        setCurrentSectionRatings(data.averageRating ?? 0);
        setCurrentSectionNumberOfRatings(data.numberOfRatings ?? 0);
        setCurrentSectionRatingsCount1(data.count1)
        setCurrentSectionRatingsCount2(data.count2)
        setCurrentSectionRatingsCount3(data.count3)
        setCurrentSectionRatingsCount4(data.count4)
        setCurrentSectionRatingsCount5(data.count5)
      }
    }
    getCurrentSectionRatings()
  }, [currentSection])

  useEffect(() => {
    const getCurrentSectionRatings = async () => {
      const res = await fetch(`/api/ratings/tas/${currentTAS.label}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token") ?? ""}`
        }
      })

      if (res.ok){
        const data = await res.json();
        setCurrentTASRatings(data.averageRating ?? 0);
        setCurrentTASNumberOfRatings(data.numberOfRatings ?? 0);
        setCurrentTASRatingsCount1(data.count1)
        setCurrentTASRatingsCount2(data.count2)
        setCurrentTASRatingsCount3(data.count3)
        setCurrentTASRatingsCount4(data.count4)
        setCurrentTASRatingsCount5(data.count5)
      }
    }
    getCurrentSectionRatings()
  }, [currentTAS])

  useEffect(() => {
    const fetchYearSectionsData = async () => {
      let department = localStorage.getItem("department") ?? "CS";
      if (department == "undefined") {
        department = "CS";
      }
      const res = await fetch(
        `/api/year_sections/${department}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      );
      console.log(res);
      const data = await res.json();

      if (res.ok) {
        let firstYearSections = data.firstYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedFirstYearSections = [];
        let secondYearSections = data.secondYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedSecondYearSections = [];
        let thirdYearSections = data.thirdYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedThirdYearSections = [];
        let fourthYearSections = data.fourthYearSections.sort(
          (a: any, b: any) => a.section - b.section
        );
        let transformedFourthYearSections = [];

        for (let i = 0; i < firstYearSections.length; i++) {
          let section = firstYearSections[i];
          let nextSection =
            i === firstYearSections.length - 1
              ? `2${secondYearSections[0].section}`
              : `1${firstYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `4${fourthYearSections[fourthYearSections.length - 1].section}`
              : `1${firstYearSections[i - 1].section}`;

          let newSection = {
            [`1${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedFirstYearSections.push(newSection);
        }

        for (let i = 0; i < secondYearSections.length; i++) {
          let section = secondYearSections[i];
          let nextSection =
            i === secondYearSections.length - 1
              ? `3${thirdYearSections[0].section}`
              : `2${secondYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `1${firstYearSections[firstYearSections.length - 1].section}`
              : `2${secondYearSections[i - 1].section}`;

          let newSection = {
            [`2${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedSecondYearSections.push(newSection);
        }

        for (let i = 0; i < thirdYearSections.length; i++) {
          let section = thirdYearSections[i];
          let nextSection =
            i === thirdYearSections.length - 1
              ? `4${fourthYearSections[0].section}`
              : `3${thirdYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `2${secondYearSections[secondYearSections.length - 1].section}`
              : `3${thirdYearSections[i - 1].section}`;

          let newSection = {
            [`3${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedThirdYearSections.push(newSection);
        }

        for (let i = 0; i < fourthYearSections.length; i++) {
          let section = fourthYearSections[i];
          let nextSection =
            i === fourthYearSections.length - 1
              ? `1${firstYearSections[0].section}`
              : `4${fourthYearSections[i + 1].section}`;
          let prevSection =
            i === 0
              ? `3${thirdYearSections[thirdYearSections.length - 1].section}`
              : `4${fourthYearSections[i - 1].section}`;

          let newSection = {
            [`4${section.section}`]: {
              next: nextSection,
              prev: prevSection,
              specialization: section.specialization as string,
            },
          };

          transformedFourthYearSections.push(newSection);
        }

        const allSections = [
          ...transformedFirstYearSections,
          ...transformedSecondYearSections,
          ...transformedThirdYearSections,
          ...transformedFourthYearSections,
        ];
        const combinedSections = allSections.reduce(
          (acc, obj) => merge(acc, obj),
          {}
        );
        setYearSections(combinedSections);

        // console.log("year sections", combinedSections);
      } else {
        console.log("error with fetching data", data);
      }
    };

    fetchYearSectionsData();
  }, []);

  useEffect(() => {
    const fetchTASData = async () => {
      let department = localStorage.getItem("department") ?? "CS";
      if (department == "undefined") {
        department = "CS";
      }
      const res = await fetch(
        `/api/tasconstraints/details/${department}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      );
      const data = await res.json();

      setProfDetails(
        data.reduce((acc: any, prof: any) => ({ ...acc, ...prof }), {})
      );

      if (res.ok) {
        setCurrentTAS({
          label: Object.keys(data[0])[0],
          name: data[0][Object.keys(data[0])[0]],
        });
      }
    };

    fetchTASData();
  }, []);

  const formatProfName = (name: string) => {
    const parts = name.split(", ");
    if (parts.length === 2) {
      return (
        <>
          {parts[0]}, <br />
          {parts[1]}
        </>
      );
    }
    return name;
  };

  return (
    <div>
      {/* <div className="py-16 font-Helvetica-Neue-Heavy flex justify-center">
        <div className="space-y-8 flex flex-col items-center">
          <StarRating rating={3.5} totalRatings={142} size="large" />
          <img src={star_label} alt="" className="w-2/5" />
        </div>
      </div> */}

      <div className="space-y-8">
        {/* Student */}
        <div>
          <div className="max-w-3xl mx-auto bg-[#E0EFFA] p-16 rounded-2xl">
            {/* label */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-extrabold font-Manrope text-primary">
                Student Schedule Ratings
              </h1>
              {/* Dropdown for section selection */}
              <div className="flex items-center">
                <span className="mr-2 text-primary font-extrabold font-Akira-Expanded">
                  VIEW:
                </span>
                <div className="relative">
                  <select
                    value={currentSection.label}
                    onChange={(e) =>
                      setCurrentSection({
                        label: e.target.value,
                        specialization:
                          yearSections[e.target.value].specialization,
                      })
                    }
                    className="font-Manrope font-bold appearance-none border border-primary rounded-md py-2 px-4 pr-8 w-48 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select a Section
                    </option>
                    {Object.keys(yearSections).map((section, index) => {
                      return (
                        <option key={index} value={section} className="py-2">
                          {section}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-primary h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex mt-8">
              {/* Left */}
              <div className="w-1/2 space-y-9 items-center justify-center flex flex-col">
                {/* Left-upper */}
                <div className="flex space-x-5">
                  <div className="space-y-1 flex flex-col items-center">
                    <div className="font-CyGrotesk text-primary text-2xl text-center">
                      {currentSection.label}
                    </div>
                    <div className="font-Manrope font-extrabold bg-[#FFCC1D] px-3 py-1 rounded-full text-sm text-center">
                      {currentSection.specialization === "none"
                        ? ""
                        : currentSection.specialization}{" "}
                      {/* magcchange depende sa section*/}
                    </div>
                  </div>

                  <div className="w-0.5 h-16 bg-primary rounded-2xl"></div>

                  <div className="flex  flex-col items-center justify-center">
                    <img src={thumbs_up} alt="" className="w-9" />
                    <div className="font-Helvetica-Neue-Heavy text-primary text-lg">
                      Good {/* magcchange depende sa rating*/}
                    </div>
                  </div>
                </div>

                {/* Left-lower */}
                <div className="font-Helvetica-Neue-Heavy">
                  <StarRating rating={currentSectionRatings} totalRatings={currentSectionNumberOfRatings} size="small" />
                </div>
              </div>

              {/* Right */}
              <div className="w-1/2">
                <StudentChart
                  five_count={currentSectionRatingsCount5}
                  four_count={currentSectionRatingsCount4}
                  three_count={currentSectionRatingsCount3}
                  two_count={currentSectionRatingsCount2}
                  one_count={currentSectionRatingsCount1}
                />
              </div>
            </div>
          </div>
        </div>

        {/* TAS */}
        <div>
          <div className="max-w-3xl mx-auto bg-[#E0EFFA] p-16 rounded-2xl">
            {/* label */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-extrabold font-Manrope text-primary">
                Teaching Staff Ratings
              </h1>
              {/* Dropdown for professor selection */}
              <div className="flex items-center">
                <span className="mr-2 text-primary font-extrabold font-Akira-Expanded">
                  VIEW:
                </span>
                <div className="relative">
                  <select
                    value={currentTAS.label}
                    onChange={(e: any) =>
                      setCurrentTAS({
                        label: e.target.value,
                        name: profDetails[e.target.value],
                      })
                    }
                    className="font-Manrope font-bold appearance-none border border-primary rounded-md py-2 px-4 pr-8 w-48 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select a TAS
                    </option>
                    {Object.keys(profDetails).map((tasId, index) => {
                      let tasName = profDetails[tasId];
                      return (
                        <option key={index} value={tasId} className="py-2">
                          {tasName}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-primary h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {/* Upper */}
              <div className="flex justify-center items-center space-x-5">
                {/* Left */}
                <div className="text-center font-Helvetica-Neue-Heavy text-primary">
                  {formatProfName(currentTAS.name)}
                </div>

                {/* Divider */}
                <div className="w-0.5 h-16 bg-primary rounded-2xl"></div>

                {/* Right */}
                <div className="flex flex-col items-center justify-center">
                  <img src={excellent} alt="" className="w-9" />
                  <div className="text-center font-Helvetica-Neue-Heavy text-primary">
                    Excellent {/* magcchange depende sa rating*/}
                  </div>
                </div>
              </div>

              {/* Lower */}
              <div className="flex justify-center items-center font-Helvetica-Neue-Heavy">
                <StarRating rating={currentTASRatings} size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings;
