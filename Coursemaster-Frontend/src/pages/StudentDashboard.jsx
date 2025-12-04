import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { getMyEnrollments } from "../features/enrollments/enrollmentSlice";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { enrollments, isLoading, isError, message } = useSelector(
    (state) => state.enrollments
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyEnrollments());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="error mt-40 text-center">{message}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
        <h1 className="border w-fit mx-auto p-5 rounded-2xl text-3xl text-center mb-10 bg-white">
          Welcome to your Dashboard, {user?.name}!
        </h1>

        {enrollments.length === 0 ? (
          <div className="text-center ">
            <p className="my-10 text-4xl">
              You haven't enrolled in any courses yet.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment._id}
                to={`/course/consume/${enrollment._id}`}
                className="card hover:shadow-xl hover:scale-105 transition-all cursor-pointer block"
              >
                <h3 className="font-bold text-xl">{enrollment.course.title}</h3>
                <p className="text-muted">{enrollment.course.description}</p>
                <p>
                  <strong>Batch:</strong> {enrollment.batch}
                </p>
                <p>
                  <strong>Enrolled:</strong>{" "}
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>

                <div className="mb-3 mt-3">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${enrollment.progress}%` }}
                    >
                      {enrollment.progress}%
                    </div>
                  </div>
                </div>

                <p className="text-sm text-blue-400">Click to view course →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
