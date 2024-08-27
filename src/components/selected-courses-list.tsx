'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { Course } from '@/interfaces/AppInterfaces';

export default function SelectedCoursesList() {
  const { selectedCourses, getCourseInfo } = useAppContext();

  return (
    <ScrollArea className="h-72 w-full rounded-md border ">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Selected Courses
        </h4>
        {selectedCourses &&
          selectedCourses.map((courseId) => {
            const courseInfo: Course | undefined = getCourseInfo(courseId);
            if (!courseInfo) {
              return null;
            }
            return (
              <>
                <div key={courseInfo.id} className="text-sm">
                  {courseInfo.name_en} - {courseInfo.semester_academic_year}
                </div>
                <Separator className="my-2" />
              </>
            );
          })}
      </div>
    </ScrollArea>
  );
}
