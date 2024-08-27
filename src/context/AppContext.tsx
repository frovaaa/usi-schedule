'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Faculty, Course } from '@/interfaces/AppInterfaces';

interface AppState {
  faculties: Faculty[] | null;
  selectedFaculty: Faculty['id'] | -1;
  courses: Course[] | null;
  selectedCourses: Course['id'][] | null;
  schedules: any | null;
  loading: boolean;
  fetchFaculties: () => Promise<void>;
  setSelectedFaculty: (facultyId: number) => void;
  fetchCourses: (facultyId: number) => Promise<void>;
  addSelectedCourse: (courseId: number) => void;
  removeSelectedCourse: (courseId: number) => void;
  getCourseInfo: (courseId: number) => Course | undefined;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [faculties, setFaculties] = useState<Faculty[] | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<number>(-1);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
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
      setFaculties(result?.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (facultyId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://search.usi.ch/api/faculties/${facultyId}/courses`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const result: any = await response.json();
      setCourses(result.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSelectedCourse = (courseId: number) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev;
      }
      return [...prev, courseId];
    });
  };

  const removeSelectedCourse = (courseId: number) => {
    setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
  };

  const getCourseInfo = (courseId: number): Course | undefined => {
    return courses?.find((course: Course) => course.id === courseId);
  };

  return (
    <AppContext.Provider
      value={{
        faculties,
        selectedFaculty,
        setSelectedFaculty,
        courses,
        selectedCourses,
        schedules,
        loading,
        fetchFaculties,
        fetchCourses,
        addSelectedCourse,
        removeSelectedCourse,
        getCourseInfo,
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
