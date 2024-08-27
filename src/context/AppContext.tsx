'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  faculties: any | null;
  courses: any | null;
  schedules: any | null;
  loading: boolean;
  fetchFaculties: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [faculties, setFaculties] = useState<any | null>(null);
  const [courses, setCourses] = useState<any | null>(null);
  const [schedules, setSchedules] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://search.usi.ch/api/faculties');
      if (!response.ok) {
        throw new Error('Failed to fetch faculties');
      }
      const result: any = await response.json();
      setFaculties(result);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{ faculties, courses, schedules, loading, fetchFaculties }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
