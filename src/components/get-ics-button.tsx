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
    const httpLink = `${baseUrl}?courses=${coursesParam}`;
    return httpLink.replace('http', 'webcal').replace('https', 'webcal');
  };

  const handleGenerateLink = () => {
    const icsLink = generateIcsLink();
    console.log(icsLink);
    if (icsLink) {
      window.location.href = icsLink;
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
