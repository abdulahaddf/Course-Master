const AssignmentForm = ({
  assignmentText,
  setAssignmentText,
  handleSubmitAssignment,
  assignmentSubmitting,
}) => {
  return (
    <div>
      <p className="text-sm text-muted mb-2">
        Submit a Google Drive link or a text answer for this module.
      </p>
      <textarea
        placeholder="Paste Drive link or write your answer here"
        value={assignmentText}
        onChange={(e) => setAssignmentText(e.target.value)}
        rows={3}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={handleSubmitAssignment}
        disabled={assignmentSubmitting}
        className="btn btn-primary"
      >
        {assignmentSubmitting ? "Submitting..." : "Submit Assignment"}
      </button>
    </div>
  );
};

export default AssignmentForm;
