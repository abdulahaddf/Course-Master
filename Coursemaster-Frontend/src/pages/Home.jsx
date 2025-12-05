import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import Loading from "../components/Loading";
import { getCourses } from "../features/courses/courseSlice";

const CourseCard = React.memo(({ course }) => {
  return (
    <div className="card">
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
  );
});

const Home = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, isError, message, meta } = useSelector(
    (state) => state.courses
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce searchTerm
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch courses
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      q: debouncedSearchTerm,
      category,
      sort: sortBy,
    };
    dispatch(getCourses(params));
  }, [dispatch, currentPage, debouncedSearchTerm, category, sortBy]);

  // Memoized handlers
  const handlePageChange = useCallback(
    (page) => {
      if (page < 1) return;
      if (meta && page > meta.pages) return;
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    },
    [meta]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setDebouncedSearchTerm(searchTerm);
  };

  if (isError) {
    return <div className="error">{message}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="my-18 md:my-5">
        <img
          src={heroImage}
          alt="Hero"
          className="mx-auto mt-6 rounded-lg shadow-lg"
        />
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 ">
        <div className="card" role="search">
          <h1 className="text-center mb-5 text-3xl">
            Find Your Desired Courses
          </h1>
          <form onSubmit={handleSearch} className="grid grid-3 gap-4">
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
            {/* <div className="form-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={triggerImmediateSearch}
              >
                Search
              </button>
            </div> */}
          </form>
        </div>

        <div className="grid grid-2 gap-4 mt-6">
          {isLoading ? (
            <div className="col-span-full">
              <Loading />
            </div>
          ) : courses?.length ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 col-span-full">
              No courses found.
            </div>
          )}
        </div>

        {meta && meta.pages > 1 && (
          <div className="pagination mt-4 flex items-center justify-center">
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
