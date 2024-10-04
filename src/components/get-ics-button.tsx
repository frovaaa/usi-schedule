'use client';

import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Course } from '@/interfaces/AppInterfaces';
import { generateIcsLink } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function GetIcsButton({
  openDirectly,
}: {
  openDirectly: boolean;
}) {
  const { selectedCourses } = useAppContext();
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          toast({
            description: 'Link copied to clipboard',
          });
        },
        (err) => {
          console.error('Could not copy text: ', err);
          fallbackCopyTextToClipboard(text);
        }
      );
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Avoid scrolling to bottom
    textArea.style.opacity = '0'; // Make it invisible
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast({
          description: 'Link copied to clipboard',
        });
      } else {
        console.error('Fallback: Oops, unable to copy');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const handleGenerateLink = () => {
    const icsLink = generateIcsLink(selectedCourses as Course[]);
    if (icsLink) {
      if (openDirectly) {
        window.location.href = icsLink;
      } else {
        copyToClipboard(icsLink);
      }
    }
  };

  return (
    <Button
      variant='outline'
      className='w-full text-purple-700'
      onClick={handleGenerateLink}
      disabled={!selectedCourses || selectedCourses.length === 0}
    >
      {openDirectly ? 'Add to Calendar' : 'Copy Link'}
    </Button>
  );
}
