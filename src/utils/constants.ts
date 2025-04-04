interface WeekDates {
    [day: string]: string;
  }

export const weekDates: WeekDates = {
    Monday: "2025-02-03",
    Tuesday: "2025-02-04",
    Wednesday: "2025-02-05",
    Thursday: "2025-02-06",
    Friday: "2025-02-07",
    Saturday: "2025-02-08",
    Sunday: "2025-02-09",
  };

  export const dateToDay: any = {
    "2025-02-03": "M",
    "2025-02-04": "T",
    "2025-02-05": "W",
    "2025-02-06": "TH",
    "2025-02-07": "F",
    "2025-02-08": "S",
    "2025-02-09": "SN",
  }