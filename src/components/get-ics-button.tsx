'use client';

import { Button } from './ui/button';
import { useAppContext } from '@/context/AppContext';

export default function GetIcsButton() {
  const { selectedCourses } = useAppContext();

  const generateIcsLink = (): string => {
    if (!selectedCourses || selectedCourses.length === 0) return '';

    const baseUrl = `${window.location.origin}/api/calendar`;
    const coursesParam = selectedCourses
      .map((courseId: number) => courseId)
      .join(',');
    const httpLink = `${baseUrl}?courses=${coursesParam}`;
    return httpLink.replace('https', 'webcal').replace('http', 'webcal');
  };

  const handleGenerateLink = () => {
    const icsLink = generateIcsLink();
    if (icsLink) {
      window.location.href = icsLink;
    }
  };

  return (
    <Button
      variant="outline"
      className="text-purple-700"
      onClick={handleGenerateLink}
      disabled={!selectedCourses || selectedCourses.length === 0}
    >
      Add to Calendar
    </Button>
  );
}
