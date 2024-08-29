'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Course, Education } from '@/interfaces/AppInterfaces';

interface AppState {
  courses: Course[] | null;
  selectedCourses: Course[] | null;
  schedules: any | null;
  loading: boolean;
  fetchCourses: (educationId: number) => Promise<void>;
  addSelectedCourse: (courseId: Course) => void;
  removeSelectedCourse: (courseId: number) => void;
  fetchEducations: () => Promise<void>;
  educations: Education[] | null;
  selectedEducation: Education['id'] | -1;
  setSelectedEducation: (educationId: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [educations, setEducations] = useState<Education[] | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<number>(-1);

  const fetchCourses = async (educationId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`api/courses?educationId=${educationId}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEducations = async () => {
    setLoading(true);
    try {
      const response = await fetch('api/educations');
      const data = await response.json();
      setEducations(data);
    } catch (error) {
      console.error('Error fetching educations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSelectedCourse = (newCourse: Course) => {
    setSelectedCourses((prev: Course[]) => {
      if (prev.some((course: Course) => course.id === newCourse.id)) {
        return prev;
      }
      return [...prev, { ...newCourse }].sort((a, b) => a.id - b.id);
    });
  };

  const removeSelectedCourse = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.filter((course: Course) => course.id !== courseId)
    );
  };

  return (
    <AppContext.Provider
      value={{
        courses,
        selectedCourses,
        schedules,
        loading,
        fetchCourses,
        addSelectedCourse,
        removeSelectedCourse,
        fetchEducations,
        educations,
        selectedEducation,
        setSelectedEducation,
      }}
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
