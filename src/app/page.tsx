import SelectFaculty from '@/components/select-faculty';
import SelectCourses from '@/components/select-courses';
import SelectedCoursesList from '@/components/selected-courses-list';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-between p-24 bg-gray-100">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 animate-bounce">
            USI Custom Schedule
          </h1>
          <p className="text-xl text-gray-700">
            Generate your custom USI-Calendar with your courses
            <br />
            and export it to your calendar app
          </p>
        </header>

        {/* Selection */}
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg space-y-4">
          <h2 className="text-3xl font-bold mb-4">
            Select the faculty of the course
          </h2>
          <SelectFaculty />

          <h2 className="text-3xl font-bold mb-4">
            Select the courses you want to add
          </h2>
          <SelectCourses />
          <SelectedCoursesList />
        </div>
      </div>
    </main>
  );
}
