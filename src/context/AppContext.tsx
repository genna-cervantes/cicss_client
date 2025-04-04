import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the context type
interface AppContextType {
  role: string | null;
  setRole: (role: string) => void;
  semester: string;
  department: string,
  setDepartment: (department: string) => void,
  isLocked: boolean
  setIsLocked: (isLocked: boolean) => void,
  isReady: boolean
  setIsReady: (isReady: boolean) => void,
}

const getCurrentSemester = (): string => {
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
  return currentMonth >= 8 ? "First Semester" : "Second Semester";
};

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string>(localStorage.getItem("role") ?? "");
  const [department, setDepartment] = useState<string>(localStorage.getItem("department") ?? "");
  const [semester, setSemester] = useState<string>(getCurrentSemester());
  const [isLocked, setIsLocked] = useState<boolean>(localStorage.getItem("isLocked") === "true" ? true : false)
  const [isReady, setIsReady] = useState<boolean>(localStorage.getItem("isReady") === "true" ? true : false)

  useEffect(() => {
    setSemester(getCurrentSemester());
  }, []);

  return (
    <AppContext.Provider value={{ role, setRole, semester, department, setDepartment, isLocked, setIsLocked, isReady, setIsReady }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
