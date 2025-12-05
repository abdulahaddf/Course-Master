const LessonNavigation = ({
  currentModule,
  currentLesson,
  setSelectedLesson,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          const lessons = currentModule?.lessons || [];
          const currentIndex = lessons.findIndex(
            (l) => l._id === currentLesson._id
          );
          if (currentIndex > 0) {
            setSelectedLesson(lessons[currentIndex - 1]);
          }
        }}
        disabled={currentModule?.lessons?.[0]?._id === currentLesson._id}
        className="btn btn-secondary flex-1"
      >
        ← Previous
      </button>

      <button
        onClick={() => {
          const lessons = currentModule?.lessons || [];
          const currentIndex = lessons.findIndex(
            (l) => l._id === currentLesson._id
          );
          if (currentIndex < lessons.length - 1) {
            setSelectedLesson(lessons[currentIndex + 1]);
          }
        }}
        disabled={
          currentModule?.lessons?.[currentModule?.lessons?.length - 1]?._id ===
          currentLesson._id
        }
        className="btn btn-secondary flex-1"
      >
        Next →
      </button>
    </div>
  );
};

export default LessonNavigation;
