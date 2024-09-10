import SelectCourses from '@/components/select-courses';
import SelectedCoursesList from '@/components/selected-courses-list';
import SelectEducation from '@/components/select-education';
import GetIcsButton from '@/components/get-ics-button';
import Disclaimer from '@/components/disclaimer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <header className="text-center mb-5 mt-5">
        <h1 className="text-5xl font-bold mb-4 animate-bounce">USIschedule</h1>
        <p className="text-xl text-gray-700">
          Generate your custom USI schedule
          <br />
          All your courses from the various educations to any calendar app
        </p>
      </header>

      {/* Selection */}
      <div className="w-full max-w-3xl p-8 rounded-lg shadow-lg space-y-4 bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
        <h2 className="text-3xl font-bold mb-0">Select the education</h2>
        <SelectEducation />

        <h2 className="text-3xl font-bold mb-0">Select the courses</h2>
        <SelectCourses />
        <SelectedCoursesList />
        <GetIcsButton />
      </div>

      {/* Disclaimer */}
      <footer className="mt-auto mb-2">
        <Disclaimer />
        <hr className="my-4 border-gray-300" />
        {/* Copyright and Github link */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Made with ❤️ by{' '}
            <a
              href="
              https://github.com/frovaaa/usi-schedule
              "
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              frovaaa
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
