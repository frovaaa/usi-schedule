'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Course, Education } from '@/interfaces/AppInterfaces';
import {
  formatCourses,
  formatEducations,
  USI_API_BASE_URL,
} from '@/lib/usi-data';

interface AppState {
  courses: Course[] | null;
  selectedCourses: Course[] | null;
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

const fetchJson = async (url: string) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<unknown>;
};

const fetchWithFallback = async <T,>(
  internalUrl: string,
  publicUrl: string,
  format: (value: unknown) => T
) => {
  try {
    return format(await fetchJson(internalUrl));
  } catch (error) {
    console.warn(
      `The cached API request failed; retrying ${publicUrl} directly.`,
      error
    );
    return format(await fetchJson(publicUrl));
  }
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [educations, setEducations] = useState<Education[] | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<number>(-1);

  const fetchCourses = async (educationId: number) => {
    setLoading(true);
    try {
      const data = await fetchWithFallback(
        `/api/courses?educationId=${educationId}`,
        `${USI_API_BASE_URL}/educations/${educationId}/courses`,
        formatCourses
      );
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEducations = async () => {
    setLoading(true);
    try {
      const data = await fetchWithFallback(
        '/api/educations',
        `${USI_API_BASE_URL}/educations`,
        formatEducations
      );
      setEducations(data);
    } catch (error) {
      console.error('Error fetching educations:', error);
      setEducations([]);
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
