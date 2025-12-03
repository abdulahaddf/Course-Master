import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../features/courses/courseSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, isError, message, meta } = useSelector((state) => state.courses);
  console.log(courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      q: searchTerm,
      category,
      sort: sortBy
    };
    dispatch(getCourses(params));
  }, [dispatch, searchTerm, category, sortBy, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = {
      page: 1,
      limit: 10,
      q: searchTerm,
      category,
      sort: sortBy
    };
    dispatch(getCourses(params));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (isError) {
    return <div className="error">{message}</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Available Courses</h1>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="grid grid-3">
            <div className="form-group">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
              </select>
            </div>
            <div className="form-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
              >
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="grid grid-2">
          {courses?.map((course) => (
            <div key={course._id} className="card">
              <h3 className="card-title">{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Instructor:</strong> {course.instructor?.name}</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Price:</strong> ${course.price}</p>
              <div className="mt-3">
                <Link to={`/course/${course.slug}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {meta && meta.pages > 1 && (
          <div className="pagination mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-secondary mr-2"
            >
              Previous
            </button>
            <span className="mx-3">
              Page {currentPage} of {meta.pages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === meta.pages}
              className="btn btn-secondary ml-2"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;