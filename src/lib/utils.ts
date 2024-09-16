import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Course } from '@/interfaces/AppInterfaces';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateIcsLink(selectedCourses: Course[]): string {
  if (!selectedCourses || selectedCourses.length === 0) return '';

  const baseUrl = `${window.location.origin}/api/calendar`;
  const coursesParam = selectedCourses
    .map((course: Course) => course.id)
    .join(',');
  const httpLink = `${baseUrl}?courses=${coursesParam}`;
  return httpLink.replace('https', 'webcal').replace('http', 'webcal');
}
