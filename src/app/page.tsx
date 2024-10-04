import SelectCourses from '@/components/select-courses';
import SelectedCoursesList from '@/components/selected-courses-list';
import SelectEducation from '@/components/select-education';
import GetIcsButton from '@/components/get-ics-button';
import Disclaimer from '@/components/disclaimer';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center'>
      <header className='mb-5 mt-5 text-center'>
        <h1 className='mb-4 animate-bounce text-5xl font-bold'>USIschedule</h1>
        <p className='text-xl text-gray-700'>
          Generate your custom USI schedule
          <br />
          All your courses from the various educations to any calendar app
        </p>
      </header>

      {/* Selection */}
      <div className='w-full max-w-3xl space-y-4 rounded-lg bg-card p-8 text-card-foreground shadow-lg dark:bg-card dark:text-card-foreground'>
        <h2 className='mb-0 text-3xl font-bold'>Select the education</h2>
        <SelectEducation />

        <h2 className='mb-0 text-3xl font-bold'>Select the courses</h2>
        <SelectCourses />
        <SelectedCoursesList />

        {/* Row with 3 elements */}
        <div className='flex flex-col items-center md:flex-row md:items-center md:justify-center md:space-x-4'>
          <GetIcsButton openDirectly={true} />
          <p className='text-center text-sm text-gray-500'>or</p>
          <GetIcsButton openDirectly={false} />
        </div>
      </div>

      {/* Disclaimer */}
      <footer className='mb-2 mt-auto'>
        <Disclaimer />
        <hr className='my-4 border-gray-300' />
        {/* Copyright and Github link */}
        <div className='text-center text-sm text-gray-500'>
          <p>
            Made with ❤️ by{' '}
            <a
              href='
              https://github.com/frovaaa/usi-schedule
              '
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500'
            >
              frovaaa
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
