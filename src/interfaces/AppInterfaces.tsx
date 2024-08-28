export interface Course {
  id: number;
  name_en: string;
  semester_academic_year: string;
}

export interface CourseSchedule {
  course_name: string;
  start_date: string;
  end_date: string;
  location: {
    campus: string;
    classroom: string;
  }
}

export interface Education {
  id: number;
  name_en: string;
  type: {
    id: number;
    name_en: string;
  };
}
