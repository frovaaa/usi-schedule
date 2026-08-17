import { unstable_cache } from 'next/cache';
import { USI_API_BASE_URL } from '@/lib/usi-data';

interface UsiCourseSchedule {
  course: {
    name_en: string;
    name_it: string;
  };
  start: string;
  end: string;
  place: {
    office: string;
    building: {
      campus: {
        name: string;
      };
    };
  };
}

class UsiApiError extends Error {
  constructor(
    resourceName: string,
    readonly status: number
  ) {
    super(`USI API ${resourceName} request failed with status ${status}`);
    this.name = 'UsiApiError';
  }
}

const fetchUsiApi = async (path: string, resourceName: string) => {
  const response = await fetch(`${USI_API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new UsiApiError(resourceName, response.status);
  }

  return response.json() as Promise<unknown>;
};

const fetchCourses = async (educationId: number) => {
  const result = await fetchUsiApi(
    `/educations/${educationId}/courses`,
    'courses'
  );
  if (typeof result !== 'object' || result === null || !('data' in result)) {
    throw new TypeError('USI API courses response is missing data');
  }
  return result.data;
};

export const getCachedCourses = unstable_cache(fetchCourses, ['educationId'], {
  tags: ['courses'],
  revalidate: 60 * 60 * 24 * 30,
});

const fetchEducations = async () => {
  return fetchUsiApi('/educations', 'educations');
};

export const getCachedEducations = unstable_cache(fetchEducations, [], {
  tags: ['educations'],
  revalidate: 60 * 60 * 24 * 30,
});

const fetchCourseSchedule = async (courseId: number) => {
  let result: unknown;
  try {
    result = await fetchUsiApi(
      `/courses/${courseId}/schedules`,
      'course schedule'
    );
  } catch (error) {
    if (error instanceof UsiApiError && error.status === 404) {
      console.info('[usi-api] Skipping removed course', { courseId });
      return [];
    }
    throw error;
  }

  if (
    typeof result !== 'object' ||
    result === null ||
    !('data' in result) ||
    !Array.isArray(result.data)
  ) {
    throw new TypeError('USI API course schedule response is missing data');
  }
  return result.data as UsiCourseSchedule[];
};

export const getCachedCourseSchedule = unstable_cache(
  fetchCourseSchedule,
  ['courseId'],
  {
    tags: ['course-schedule'],
    revalidate: 60 * 60 * 6,
  }
);
