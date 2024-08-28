'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import LoadingPurpleSpinner from './ui/loading-purple-spinner';

export default function SelectCourses() {
  const [open, setOpen] = useState(false);
  const {
    courses,
    loading,
    selectedEducation,
    fetchCourses,
    addSelectedCourse,
  } = useAppContext();

  useEffect(() => {
    if (selectedEducation !== -1) {
      fetchCourses(selectedEducation);
    }
  }, [selectedEducation]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading || !courses?.length}
        >
          {loading ? (
            <div className="flex items-center ">
              <LoadingPurpleSpinner />
              <span className="ml-5">Loading courses... It takes a bit...</span>
            </div>
          ) : (
            <span className="truncate">
              {courses?.length
                ? 'Select courses...'
                : 'No courses available | Select an education first'}
            </span>
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search course..." />
          <CommandList>
            <CommandEmpty>No course found.</CommandEmpty>
            <CommandGroup>
              {courses &&
                courses?.map((course) => (
                  <CommandItem
                    key={course.id}
                    value={course.name_en + '|' + course.semester_academic_year}
                    onSelect={() => {
                      addSelectedCourse(course.id);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', 'opacity-0')} />
                    {course.name_en + ' - ' + course.semester_academic_year}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
