import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCourses } from "../features/courses/courseSlice";
import heroImage from '../assets/hero.png';

const Home = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, isError, message, meta } = useSelector(
    (state) => state.courses
  );
  console.log(courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // handle search, category, sort changes with debounce
  // and fetch first page
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const params = {
        page: 1,
        limit: 10,
        q: searchTerm,
        category,
        sort: sortBy,
      };
      setCurrentPage(1);
      dispatch(getCourses(params));
    }, 500); 

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, category, sortBy, dispatch]);

  // Effect: handle pagination separately 
  useEffect(() => {
    if (currentPage > 1) {
      const params = {
        page: currentPage,
        limit: 10,
        q: searchTerm,
        category,
        sort: sortBy,
      };
      dispatch(getCourses(params));
    }
  }, [currentPage, dispatch]);

// Handle form submit to prevent page reload
  const handleSearch = (e) => {
    e.preventDefault();

    const params = {
      page: 1,
      limit: 10,
      q: searchTerm,
      category,
      sort: sortBy,
    };
    setCurrentPage(1);
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
      <div className="my-18 md:my-5">
       
        <img src={heroImage} alt="Hero" className="mx-auto mt-6 rounded-lg shadow-lg" />
        
      </div>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 ">

        <form onSubmit={handleSearch} className="card">
        <h1 className="text-center mb-5 text-3xl">Find Your Desired Courses</h1>
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
                <option value="Frontend Development">
                  Frontend Development
                </option>
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
         
        </form>

        <div className="grid grid-2 ">
          {courses?.map((course) => (
            <div key={course._id} className="card">
              <h3 className="font-bold text-xl">{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Instructor:</strong> {course.instructor?.name}
              </p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <p>
                <strong>Price:</strong> ${course.price}
              </p>
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
