const AssignmentForm = ({
  assignmentText,
  setAssignmentText,
  handleSubmitAssignment,
  assignmentSubmitting,
}) => {
  return (
    <div>
      <p className="text-sm text-muted mb-2">
       
      </p>
      <textarea
        placeholder="Submit link or text answer or feedback for this module."
        value={assignmentText}
        onChange={(e) => setAssignmentText(e.target.value)}
        rows={1}
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
