import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseBySlug } from '../features/courses/courseSlice';
import { createEnrollment } from '../features/enrollments/enrollmentSlice';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [enrollmentError, setEnrollmentError] = React.useState('');
  
  const { currentCourse, isLoading, isError, message } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: enrollmentLoading, isError: enrollmentIsError, message: enrollmentMessage } = useSelector((state) => state.enrollments);

  useEffect(() => {
    dispatch(getCourseBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (enrollmentIsError && enrollmentMessage) {
      setEnrollmentError(enrollmentMessage);
      const timer = setTimeout(() => setEnrollmentError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [enrollmentIsError, enrollmentMessage]);

  const handleEnroll = async (batch) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrollmentError('');

    const enrollmentData = {
      courseId: currentCourse._id,
      batch: batch.name
    };

    const result = await dispatch(createEnrollment(enrollmentData));
    if (createEnrollment.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (isError) {
    return <div className="error">{message}</div>;
  }

  if (!currentCourse) {
    return <div className="loading">Course not found</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{currentCourse.title}</h1>
        <p className="text-muted">{currentCourse.description}</p>
        
        <div className="grid grid-2 mt-4">
          <div>
            <h3>Course Details</h3>
            <p><strong>Instructor:</strong> {currentCourse.instructor?.name}</p>
            <p><strong>Category:</strong> {currentCourse.category}</p>
            <p><strong>Price:</strong> ${currentCourse.price}</p>
            <p><strong>Tags:</strong> {currentCourse.tags?.join(', ')}</p>
          </div>
          
          <div>
            <h3>Available Batches</h3>
            {enrollmentError && (
              <div className="alert alert-danger mb-3">
                {enrollmentError}
              </div>
            )}
            {currentCourse.batches?.map((batch, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <h4>{batch.name}</h4>
                <p>Start: {new Date(batch.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(batch.endDate).toLocaleDateString()}</p>
                <button
                  onClick={() => handleEnroll(batch)}
                  disabled={enrollmentLoading}
                  className="btn btn-success"
                >
                  {enrollmentLoading ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3>Course Syllabus</h3>
          {currentCourse.syllabus?.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-4">
              <h4>Module {module.order}: {module.title}</h4>
              <p>{module.description}</p>
              
              <div className="ml-4">
                <h5>Lessons:</h5>
                {module.lessons?.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="mb-2 p-2 border rounded">
                    <h6>Lesson {lesson.order}: {lesson.title}</h6>
                    <p className="text-muted">{lesson.description}</p>
                    <p className="text-sm">Duration: {lesson.duration} minutes</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Link to="/" className="btn btn-secondary">
            Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;