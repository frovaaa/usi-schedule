export interface Course {
  id: number;
  name_en: string;
  semester_academic_year: string;
}

export interface Education {
  id: number;
  name_en: string;
  name_it?: string;
  type: {
    id: number;
    name_en: string;
    name_it?: string;
  };
}
