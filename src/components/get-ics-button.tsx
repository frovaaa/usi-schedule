'use client';

import { Button } from './ui/button';
import { useAppContext } from '@/context/AppContext';

export default function GetIcsButton() {
  const { selectedCourses } = useAppContext();

  const generateIcsLink = (): string => {
    if (!selectedCourses) return '';

    const baseUrl = `${window.location.origin}/api/calendar`;
    const coursesParam = selectedCourses
      .map((courseId: number) => courseId)
      .join(',');
    return `${baseUrl}?courses=${coursesParam}`;
  };

  const handleGenerateLink = () => {
    const icsLink = generateIcsLink();
    if (icsLink) {
      window.open(icsLink, '_blank');
    }
  };

  return (
    <Button
      variant="outline"
      className="text-purple-700"
      onClick={handleGenerateLink}
    >
      Add to Calendar
    </Button>
  );
}
