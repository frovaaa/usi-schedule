'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { _fetchCourses, _fetchEducations } from '@/api/usi-api';
import { Course, Education } from '@/interfaces/AppInterfaces';

interface AppState {
  courses: Course[] | null;
  selectedCourses: Course['id'][] | null;
  schedules: any | null;
  loading: boolean;
  fetchCourses: (educationId: number) => Promise<void>;
  addSelectedCourse: (courseId: number) => void;
  removeSelectedCourse: (courseId: number) => void;
  getCourseInfo: (courseId: number) => Course | undefined;

  fetchEducations: () => Promise<void>;
  educations: Education[] | null;
  selectedEducation: Education['id'] | -1;
  setSelectedEducation: (educationId: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [schedules, setSchedules] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [educations, setEducations] = useState<Education[] | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<number>(-1);

  const fetchCourses = async (educationId: number) => {
    setLoading(true);
    try {
      const data = await _fetchCourses(educationId);
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
      const data = await _fetchEducations();
      setEducations(data);
    } catch (error) {
      console.error('Error fetching educations:', error);
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
        courses,
        selectedCourses,
        schedules,
        loading,
        fetchCourses,
        addSelectedCourse,
        removeSelectedCourse,
        getCourseInfo,
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
