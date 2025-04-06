import { dateToDay } from "./constants";
import { clsx } from "clsx";

export function cn(...inputs: any[]) {
  return clsx(...inputs);
}

export const uniqueByKey = <T>(arr: T[], key: keyof T): T[] => {
    const seen = new Set();
    return arr.filter((item) => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  };

export const fuzzyMatch = (input: string, target: string) => {
  let t = 0;
  input = input.toLowerCase();
  target = target.toLowerCase();

  for (let i = 0; i < target.length; i++) {
    if (input[t] === target[i]) t++;
  }

  return t === input.length;
};

export const fetchUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userInfo = await response.json();
    console.log("User Info:", userInfo);

    return userInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const checkIfCICSStudent = (email: string) => {
  try {
    let prefix = email.split("@")[0];
    let prefixSplit = prefix.split(".");
    let college = prefixSplit[prefixSplit.length - 1];

    return college === "cics";
  } catch (error) {
    console.error("Error with checking email:", error);
  }
};

export const checkIfCICSTAS = async (email: string) => {
  try {
    // POST /api/tas/email
    let rqBody = JSON.stringify({ email }); // {email: email}

    let response = await fetch(
      "http://localhost:8080/departmentchair/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: rqBody,
      }
    );

    let jsRes = await response.json();

    return jsRes.auth;
  } catch (error) {
    console.error("Error with checking email: ", error);
  }
};

export const getCourseCodesFromInternalRepresentation = (
  internalRep: String[]
) => {
  // loop thru the string arr
  // remove ung mga -LC -LB sa dulo tapos gawing set - para sa may mga lab
  // remove ung mga W- sa unahan - para sa mga specialization - lagyan ng (Specialization) - dont kasi sa front end may difference din dapat

  // return the set
  let removedLCandLb = internalRep.map((r) => {
    if (r.endsWith("-LC") || r.endsWith("-LB")) {
      return r.slice(0, r.length - 3);
    }
    return r;
  });

  return Array(...new Set(removedLCandLb));
};

export const transformToOriginalEvents = (
  transformedEvents: any,
  changedScheduleBlocks: any,
  value: string
) => {
  let originalEvents = [];

  console.log(changedScheduleBlocks);

  let combinedEvents = transformedEvents.map((te: any) => {
    const changedEvent = changedScheduleBlocks.find(
      (ce: any) => ce.id === te.id
    );

    return changedEvent || te;
  });

  for (let i = 0; i < combinedEvents.length; i++) {
    let schedBlock = combinedEvents[i];

    let date: string = schedBlock.start.split(" ")[0];
    let start: string = `${schedBlock.start.split(" ")[1].slice(0, 2)}${schedBlock.start.split(" ")[1].slice(3)}`;
    let end: string = `${schedBlock.end.split(" ")[1].slice(0, 2)}${schedBlock.end.split(" ")[1].slice(3)}`;

    // "{"type":"lec","violations":[]}"
    let description = JSON.parse(schedBlock?.description ?? "");

    const reqObj = {
      section: value.slice(1),
      year: value.slice(0, 1),
      department: value.slice(1, 3),
      id: schedBlock.id,
      room: {
        roomId: schedBlock.location,
      },
      tas: schedBlock?.people?.[0] ?? "GENED_PROF",
      day: dateToDay[date],
      timeBlock: {
        start,
        end,
      },
      course: {
        type: description?.type,
        category: description?.category,
        subjectCode: schedBlock.title,
      },
      violations: description?.violations,
    };

    originalEvents.push(reqObj);
  }

  return originalEvents;
};

export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
