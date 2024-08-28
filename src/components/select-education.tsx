'use client';

import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Education } from '@/interfaces/AppInterfaces';

export default function SelectEducation() {
  const [open, setOpen] = useState(false);
  const {
    educations,
    loading,
    fetchEducations,
    selectedEducation,
    setSelectedEducation,
  } = useAppContext();
  const [selectedEduType, setSelectedEduType] = useState<number>(-1);
  const [filteredEducations, setFilteredEducations] = useState<
    Education[] | null
  >(educations);

  const educationTypes = educations
    ?.filter(
      (education: Education, index: number, self: Education[]) =>
        index === self.findIndex((t) => t.type.id === education.type.id)
    )
    .map((education: Education) => education.type);

  const _setSelectedEduType = (type: string) => {
    type == 'All'
      ? setSelectedEduType(-1)
      : setSelectedEduType(
          educationTypes?.find((eduType) => eduType.name_en === type)?.id || -1
        );
  };

  useEffect(() => {
    fetchEducations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredEducations(educations);
  }, [educations]);

  useEffect(() => {
    setSelectedEducation(-1);
    if (selectedEduType !== -1) {
      setFilteredEducations(
        educations
          ? educations.filter(
              (education: Education) => education.type.id === selectedEduType
            )
          : null
      );
    } else {
      setFilteredEducations(educations);
    }
  }, [selectedEduType, educations, setSelectedEducation]);

  return (
    <div className="columns-2">
      <Select onValueChange={(val) => _setSelectedEduType(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="text-purple-500" value="All">
            All
          </SelectItem>
          {educationTypes &&
            educationTypes.map((type: Education['type']) => (
              <SelectItem key={type.id} value={type.name_en}>
                {type.name_en}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between truncate"
          >
            {selectedEducation !== -1 && filteredEducations
              ? filteredEducations.find(
                  (education: Education) => education.id === selectedEducation
                )?.name_en
              : 'Select education...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search education..." />
            <CommandList>
              <CommandEmpty>No education found</CommandEmpty>
              <CommandGroup>
                {filteredEducations &&
                  filteredEducations.map((education: Education) => (
                    <CommandItem
                      key={education.id}
                      value={education.name_en}
                      onSelect={() => {
                        setSelectedEducation(
                          education?.id === selectedEducation
                            ? -1
                            : education.id
                        );
                        setOpen(false);
                      }}
                      className="cursor-pointer text-left"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedEducation === education.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {education.name_en}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
