import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeLesson, getMyEnrollments } from '../features/enrollments/enrollmentSlice';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { enrollments, isLoading, isError, message } = useSelector((state) => state.enrollments);
  const { user } = useSelector((state) => state.auth);
  console.log(enrollments)
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    dispatch(getMyEnrollments());
  }, [dispatch,isError]);

  const handleLessonClick = (enrollment, lesson) => {
    setSelectedEnrollment(enrollment);
    setSelectedLesson(lesson);
  };

  const handleMarkComplete = async () => {
    if (selectedEnrollment && selectedLesson) {
      await dispatch(completeLesson({
        enrollmentId: selectedEnrollment._id,
        lessonId: selectedLesson._id
      }));
      setSelectedLesson(null);
    }
  };

  const isLessonCompleted = (enrollment, lessonId) => {
    return enrollment.lessonsCompleted?.some(lesson => lesson.lessonId === lessonId);
  };

  if (isLoading) {
    return <Loading/>;
  }

  if (isError) {
    return <div className="error mt-40 text-center">{message}</div>;
  }
console.log(message)
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
        <h1 className="border w-fit mx-auto p-5 rounded-2xl text-3xl text-center mb-10 bg-white">Welcome to your Dashboard, {user?.name}!</h1>
        
        {enrollments.length === 0 ? (
          <div className="text-center ">
            <p className="my-10 text-4xl">You haven't enrolled in any courses yet.</p>
            <Link to="/" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="card">
                <h3 className="font-bold text-xl">{enrollment.course.title}</h3>
                <p className="text-muted">{enrollment.course.description}</p>
                <p><strong>Batch:</strong> {enrollment.batch}</p>
                <p><strong>Enrolled:</strong> {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                
                <div className="mb-3">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${enrollment.progress}%` }}
                    >
                      {enrollment.progress}%
                    </div>
                  </div>
                </div>

                <div>
                  <h4>Course Content</h4>
                  {enrollment.course.syllabus?.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="mb-3">
                      <h5>Module {module.order}: {module.title}</h5>
                      {module.lessons?.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="ml-3 mb-2">
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              checked={isLessonCompleted(enrollment, lesson._id)}
                              readOnly
                              className="mr-2"
                            />
                            <span 
                              className={isLessonCompleted(enrollment, lesson._id) ? 'text-success' : ''}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleLessonClick(enrollment, lesson)}
                            >
                              Lesson {lesson.order}: {lesson.title}
                            </span>
                          </div>
                          {selectedEnrollment?._id === enrollment._id && 
                           selectedLesson?._id === lesson._id && 
                           !isLessonCompleted(enrollment, lesson._id) && (
                            <div className="mt-2">
                              <button 
                                onClick={handleMarkComplete}
                                className="btn btn-success btn-sm"
                              >
                                Mark as Complete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;