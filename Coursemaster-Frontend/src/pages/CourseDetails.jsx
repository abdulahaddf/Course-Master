import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseBySlug } from '../features/courses/courseSlice';
import { createEnrollment } from '../features/enrollments/enrollmentSlice';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCourse, isLoading, isError, message } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: enrollmentLoading } = useSelector((state) => state.enrollments);

  useEffect(() => {
    dispatch(getCourseBySlug(slug));
  }, [dispatch, slug]);

  const handleEnroll = async (batch) => {
    if (!user) {
      navigate('/login');
      return;
    }

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
  
  );
};

export default CourseDetails;