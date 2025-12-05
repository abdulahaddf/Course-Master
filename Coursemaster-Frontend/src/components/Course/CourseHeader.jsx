const CourseHeader = ({ course, enrollment }) => {
    console.log(enrollment)
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted">{course.category}</p>
        <div className="progress-bar" style={{ width: "200px" }}>
          <div
            className="progress-fill"
            style={{ width: `${enrollment.progress}%` }}
          >
            {enrollment.progress}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
