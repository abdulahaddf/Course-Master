import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AssignmentForm from "../components/Course/AssignmentForm";
import CourseHeader from "../components/Course/CourseHeader";
import LessonNavigation from "../components/Course/LessonNavigation";
import QuizPanel from "../components/Course/QuizPanel";
import SyllabusSidebar from "../components/Course/SyllabusSidebar";
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

  // Initialize selected module/lesson when enrollment (and course syllabus) is loaded
  useEffect(() => {
    if (!enrollment) return;
    const course = enrollment.course;
    if (!course || !Array.isArray(course.syllabus)) return;

    // If no selected lesson yet, pick the first module that has lessons
    if (!selectedLesson) {
      for (let i = 0; i < course.syllabus.length; i++) {
        const mod = course.syllabus[i];
        if (mod && Array.isArray(mod.lessons) && mod.lessons.length > 0) {
          setSelectedModule(i);
          setSelectedLesson(mod.lessons[0]);
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment]);

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
  const course = enrollment?.course;
  const currentModule = course?.syllabus?.[selectedModule];
  const currentLesson = currentModule?.lessons?.find(
    (l) => l._id === selectedLesson?._id
  );
  console.log(currentModule);
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 mb-20">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
        <CourseHeader course={course} enrollment={enrollment} />

        <div className="grid grid-cols-2 gap-6">
          <SyllabusSidebar
            course={course}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            setSelectedLesson={setSelectedLesson}
            selectedLesson={selectedLesson}
            isLessonCompleted={isLessonCompleted}
          />

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

                  <div className="border-t mt-4 pt-4">
                    <h4 className="font-semibold mb-2">Assignment</h4>
                    <AssignmentForm
                      assignmentText={assignmentText}
                      setAssignmentText={setAssignmentText}
                      handleSubmitAssignment={handleSubmitAssignment}
                      assignmentSubmitting={assignmentSubmitting}
                    />
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <h4 className="font-semibold mb-2">Quiz</h4>
                    <QuizPanel
                      quiz={quiz}
                      quizAnswers={quizAnswers}
                      handleQuizAnswer={handleQuizAnswer}
                      handleSubmitQuiz={handleSubmitQuiz}
                      quizResult={quizResult}
                    />
                  </div>
                </div>

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

                <LessonNavigation
                  currentModule={currentModule}
                  currentLesson={currentLesson}
                  setSelectedLesson={setSelectedLesson}
                />
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
