'use client';

import { useAppContext } from '@/context/AppContext';
import { useEffect } from 'react';

import * as React from 'react';
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

interface Faculty {
  id: number;
  name_en: string;
}

export default function SelectFaculty() {
  const [open, setOpen] = React.useState(false);
  const [selectedFaculty, setSelectedFaculty] = React.useState(-1);
  const { faculties, loading, fetchFaculties } = useAppContext();

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {selectedFaculty !== -1 && faculties?.data
            ? faculties.data.find(
                (faculty: Faculty) => faculty.id === selectedFaculty
              )?.name_en
            : 'Select faculty...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search faculty..." />
          <CommandList>
            <CommandEmpty>No faculty found</CommandEmpty>
            <CommandGroup>
              {faculties?.data &&
                faculties.data.map((faculty: Faculty) => (
                  <CommandItem
                    key={faculty.id}
                    value={faculty.name_en}
                    onSelect={() => {
                      setSelectedFaculty(
                        faculty?.id === selectedFaculty ? -1 : faculty.id
                      );
                      setOpen(false);
                    }}
                    className="cursor-pointer text-left"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedFaculty === faculty.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {faculty.name_en}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
