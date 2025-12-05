import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import assignmentService from "../services/assignmentService";
import { toast } from "react-toastify";

/**
 * Styled AdminAssignments
 * - Logic unchanged (kept your existing flow & DOM-getting for values)
 * - Added Tailwind styles for a clean admin panel look
 */
const AdminAssignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await assignmentService.getCourseAssignments(
          courseId,
          token
        );
        setAssignments(data);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, token]);

  const handleReview = async (id, grade, feedback) => {
    try {
      const res = await assignmentService.reviewAssignment(
        id,
        { grade: Number(grade), feedback },
        token
      );
      setAssignments((prev) => prev.map((a) => (a._id === id ? res : a)));
      toast.success("Review saved");
    } catch (e) {
      toast.error(e.response?.data?.error || e.message || "Failed to save");
    }
  };

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading assignments…</div>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Assignments for Course
        </h1>
        <Link
          to="/admin"
          className="inline-block px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
        >
          ← Back to Admin
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-gray-500">
          No assignments submitted yet.
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="bg-white shadow-sm border border-gray-100 rounded-xl p-5"
            >
              <div className="md:flex md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Student: </span>
                    {a.student?.name}{" "}
                    <span className="text-gray-400">({a.student?.email})</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Module: </span>
                    {a.module}
                  </p>
                  <p className="mt-3 text-gray-700">{a.submission}</p>
                  <p className="mt-2 text-md text-gray-400">
                    Submitted at: {new Date(a.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 md:w-1/3">
                  <label className="block text-sm font-medium text-gray-600">
                    Grade (0-100)
                  </label>
                  <input
                    type="number"
                    id={`grade-${a._id}`}
                    defaultValue={a.grade ?? ""}
                    className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    min={0}
                    max={100}
                  />

                  <label className="block text-sm font-medium text-gray-600 mt-3">
                    Feedback
                  </label>
                  <textarea
                    id={`feedback-${a._id}`}
                    defaultValue={a.feedback || ""}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        const grade = document.getElementById(
                          `grade-${a._id}`
                        ).value;
                        const feedback = document.getElementById(
                          `feedback-${a._id}`
                        ).value;
                        handleReview(a._id, grade, feedback);
                      }}
                      className="btn btn-primary w-full"
                    >
                      Save Review
                    </button>

                  
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;
