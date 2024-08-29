'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { Course } from '@/interfaces/AppInterfaces';
import { Trash2 } from 'lucide-react';

export default function SelectedCoursesList() {
  const { selectedCourses, removeSelectedCourse } =
    useAppContext();

  return (
    <ScrollArea className="h-64 w-full rounded-md border ">
      <div className="p-4">
        <h4 className="mb-1 text-sm font-medium leading-none">
          Selected Courses
        </h4>
        <Separator className="my-4 mt-2" />
        {selectedCourses &&
          selectedCourses.map((course: Course) => {
            return (
              <div key={course.id}>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {course.name_en} - {course.semester_academic_year}
                  </div>
                  <button
                    onClick={() => removeSelectedCourse(course.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Separator className="my-2" />
              </div>
            );
          })}
      </div>
    </ScrollArea>
  );
}
