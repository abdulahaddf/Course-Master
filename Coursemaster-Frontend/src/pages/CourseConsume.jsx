import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../components/Course/VideoPlayer";
import Loading from "../components/Loading";
import {
  completeLesson,
  getMyEnrollments,
} from "../features/enrollments/enrollmentSlice";
import assignmentService from "../services/assignmentService";
import quizService from "../services/quizService";

const CourseConsume = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enrollments, isLoading } = useSelector((state) => state.enrollments);
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [assignmentText, setAssignmentText] = useState("");
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (enrollments.length === 0) {
      dispatch(getMyEnrollments());
    }
  }, [dispatch, enrollments.length]);

  const enrollment = enrollments.find((e) => e._id === enrollmentId);

  const handleMarkComplete = async () => {
    if (enrollment && selectedLesson) {
      await dispatch(
        completeLesson({
          enrollmentId: enrollment._id,
          lessonId: selectedLesson._id,
        })
      );
      // Refresh enrollments to see updated progress
      dispatch(getMyEnrollments());
    }
  };

  // load quiz for selected module
  useEffect(() => {
    const loadQuiz = async () => {
      if (!course || !currentModule) return;
      try {
        const q = await quizService.getQuizByCourseModule(
          course._id,
          currentModule.title,
          token
        );
        setQuiz(q);
        setQuizAnswers(q.questions.map(() => null));
        setQuizResult(null);
      } catch (e) {
        setQuiz(null);
      }
    };
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModule]);

  const handleSubmitAssignment = async () => {
    if (!course || !currentModule) return;
    setAssignmentSubmitting(true);
    try {
      const payload = {
        courseId: course._id,
        module: currentModule.title,
        submission: assignmentText,
      };
      await assignmentService.createAssignment(payload, token);
      setAssignmentText("");
      alert("Assignment submitted");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  const handleQuizAnswer = (qIndex, optionIndex) => {
    setQuizAnswers((prev) => {
      const arr = [...prev];
      arr[qIndex] = optionIndex;
      return arr;
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    try {
      const res = await quizService.submitQuiz(quiz._id, quizAnswers, token);
      setQuizResult(res);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return enrollment?.lessonsCompleted?.some(
      (lesson) => lesson.lessonId === lessonId
    );
  };

  if (isLoading) {
    return <Loading />;
  }
  console.log(enrollment);
  if (!enrollment) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
          <div className="text-center">
            <p className="text-xl mb-4">Enrollment not found</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const course = enrollment.course;
  const currentModule = course.syllabus?.[selectedModule];
  const currentLesson = selectedLesson || currentModule?.lessons?.[0];
  console.log(currentLesson);
  console.log(currentLesson.videoUrl);
  console.log(course);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 mb-20">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
        {/* Header */}
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

        <div className="grid grid-2 gap-6">
          {/* Sidebar - Syllabus */}
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
                        ? "bg-blue-500 text-white"
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
                              ? "bg-green-500 text-white"
                              : isLessonCompleted(lesson._id)
                              ? "bg-green-500/30 text-green-100"
                              : "bg-white/10 hover:bg-white/20"
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

          {/* Main Content Area */}
          <div className="space-y-4">
            {currentLesson ? (
              <>
                <div className="card">
                  <h2 className="text-2xl font-bold mb-2">
                    Lesson {currentLesson.order}: {currentLesson.title}
                  </h2>
                  <p className="text-muted mb-4">
                    Module {currentModule?.order}: {currentModule?.title}
                  </p>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-justify">{currentLesson.description}</p>
                  </div>

                  {currentLesson.videoUrl && (
                    <div className="border-t mt-4 pt-4">
                      <h4 className="font-semibold mb-2">Video</h4>
                      <VideoPlayer url={currentLesson.videoUrl} />
                    </div>
                  )}

                  {currentLesson.duration && (
                    <div className="border-t mt-4 pt-4">
                      <p>
                        <strong>Duration:</strong> {currentLesson.duration}{" "}
                        minutes
                      </p>
                    </div>
                  )}
                  {/* Assignment submission UI for this module */}
                  <div className="border-t mt-4 pt-4">
                    <h4 className="font-semibold mb-2">Assignment</h4>
                    <p className="text-sm text-muted mb-2">
                      Submit a Google Drive link or a text answer for this
                      module.
                    </p>
                    <textarea
                      placeholder="Paste Drive link or write your answer here"
                      value={assignmentText}
                      onChange={(e) => setAssignmentText(e.target.value)}
                      rows={3}
                      className="w-full mb-2 p-2 border rounded"
                    />
                    <button
                      onClick={handleSubmitAssignment}
                      disabled={assignmentSubmitting}
                      className="btn btn-primary"
                    >
                      {assignmentSubmitting
                        ? "Submitting..."
                        : "Submit Assignment"}
                    </button>
                  </div>

                  {/* Quiz UI for this module */}
                  <div className="border-t mt-4 pt-4">
                    <h4 className="font-semibold mb-2">Quiz</h4>
                    {quiz ? (
                      <div>
                        {quiz.questions.map((q, qi) => (
                          <div key={qi} className="mb-3">
                            <p className="font-medium">
                              {qi + 1}. {q.text}
                            </p>
                            {q.options.map((opt, oi) => (
                              <label key={oi} className="block">
                                <input
                                  type="radio"
                                  name={`q-${qi}`}
                                  checked={quizAnswers[qi] === oi}
                                  onChange={() => handleQuizAnswer(qi, oi)}
                                  className="mr-2"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        ))}
                        <button
                          onClick={handleSubmitQuiz}
                          className="btn btn-primary mr-2"
                        >
                          Submit Quiz
                        </button>
                        {quizResult && (
                          <div className="mt-2 p-2 bg-green-100 rounded">
                            Score: {quizResult.score}% —{" "}
                            {quizResult.correctAnswers}/{quizResult.total}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted">
                        No quiz for this module.
                      </p>
                    )}
                  </div>
                </div>

                {/* Complete Button */}
                {!isLessonCompleted(currentLesson._id) && (
                  <button
                    onClick={handleMarkComplete}
                    className="btn btn-success w-full"
                  >
                    Mark Lesson as Complete
                  </button>
                )}

                {isLessonCompleted(currentLesson._id) && (
                  <div className="card bg-green-500/20 text-black text-center">
                    ✓ Lesson Completed
                  </div>
                )}

                {/* Navigation */}
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
                    disabled={
                      currentModule?.lessons?.[0]?._id === currentLesson._id
                    }
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
                      currentModule?.lessons?.[
                        currentModule?.lessons?.length - 1
                      ]?._id === currentLesson._id
                    }
                    className="btn btn-secondary flex-1"
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className="card text-center">
                <p>No lessons available</p>
              </div>
            )}

            <Link to="/dashboard" className="btn btn-primary w-full">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseConsume;
