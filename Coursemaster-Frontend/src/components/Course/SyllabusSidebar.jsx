const SyllabusSidebar = ({
  course,
  selectedModule,
  setSelectedModule,
  setSelectedLesson,
  selectedLesson,
  isLessonCompleted,
}) => {
  return (
    <div className="card h-fit">
      <h3 className="font-bold text-lg mb-4">Course Content</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {course.syllabus?.map((module, moduleIndex) => (
          <div key={moduleIndex}>
            <button
              onClick={() => {
                setSelectedModule(moduleIndex);
                setSelectedLesson(module.lessons?.[0] || null);
              }}
              className={`w-full text-left p-2 rounded ${
                selectedModule === moduleIndex
                  ? "bg-black text-white"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <h5 className="font-semibold">
                Module {module.order}: {module.title}
              </h5>
            </button>

            {selectedModule === moduleIndex && (
              <div className="ml-4 mt-2 space-y-2">
                {module.lessons?.map((lesson, lessonIndex) => (
                  <button
                    key={lessonIndex}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-2 rounded flex items-center gap-2 text-sm ${
                      selectedLesson?._id === lesson._id
                        ? " bg-gray-500 text-white border  hover:text-white hover:bg-gray-500"
                        
                        : "hover:bg-gray-500 border hover:text-white duration-500 "
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isLessonCompleted(lesson._id)}
                      readOnly
                      className="mr-1"
                    />
                    Lesson {lesson.order}: {lesson.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusSidebar;
