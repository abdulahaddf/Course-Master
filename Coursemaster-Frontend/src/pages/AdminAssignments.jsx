import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import assignmentService from "../services/assignmentService";

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
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl mb-4">Assignments for Course</h1>
      <Link to="/admin" className="btn btn-secondary mb-4">
        Back to Admin
      </Link>
      {assignments.length === 0 ? (
        <p>No assignments submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <div key={a._id} className="card p-4">
              <p>
                <strong>Student:</strong> {a.student?.name} ({a.student?.email})
              </p>
              <p>
                <strong>Module:</strong> {a.module}
              </p>
              <p className="mt-2">{a.submission}</p>
              <p className="text-sm text-muted">
                Submitted: {new Date(a.submittedAt).toLocaleString()}
              </p>
              <div className="mt-3">
                <label className="block">Grade (0-100)</label>
                <input
                  type="number"
                  id={`grade-${a._id}`}
                  defaultValue={a.grade ?? ""}
                  className="mb-2"
                />
                <label className="block">Feedback</label>
                <textarea
                  id={`feedback-${a._id}`}
                  defaultValue={a.feedback || ""}
                  rows={3}
                  className="mb-2"
                />
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
                  className="btn btn-primary"
                >
                  Save Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;
