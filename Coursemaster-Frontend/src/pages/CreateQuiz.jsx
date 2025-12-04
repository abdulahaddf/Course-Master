import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import quizService from "../services/quizService";

const CreateQuiz = () => {
  const { courseId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", ""], correctIndex: 0 },
  ]);

  const addQuestion = () =>
    setQuestions((prev) => [
      ...prev,
      { text: "", options: ["", ""], correctIndex: 0 },
    ]);
  const removeQuestion = (i) =>
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  const addOption = (qIdx) =>
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qIdx ? { ...q, options: [...q.options, ""] } : q
      )
    );
  const updateQuestion = (qIdx, field, value) =>
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === qIdx ? { ...q, [field]: value } : q))
    );
  const updateOption = (qIdx, optIdx, value) =>
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qIdx
          ? {
              ...q,
              options: q.options.map((o, oi) => (oi === optIdx ? value : o)),
            }
          : q
      )
    );

  const handleCreate = async () => {
    // Validate required fields
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!module.trim()) {
      alert("Module is required");
      return;
    }
    if (!questions.length) {
      alert("At least one question is required");
      return;
    }

    // Validate all questions have text and options
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Question ${i + 1}: Text is required`);
        return;
      }
      const nonEmptyOptions = q.options.filter((opt) => opt.trim());
      if (nonEmptyOptions.length < 2) {
        alert(`Question ${i + 1}: At least 2 non-empty options are required`);
        return;
      }
      if (q.correctIndex < 0 || q.correctIndex >= nonEmptyOptions.length) {
        alert(
          `Question ${i + 1}: Correct option index must be between 0 and ${
            nonEmptyOptions.length - 1
          }`
        );
        return;
      }
    }

    try {
      const payload = {
        course: courseId,
        module,
        title,
        description,
        questions,
      };
      console.log("POST ->", quizService.API_URL, payload);
      await quizService.createQuiz(payload, token);
      alert("Quiz created");
      navigate("/admin");
    } catch (err) {
      // Show full error info to help debugging validation / server responses
      console.error("CreateQuiz error:", err);
      console.error("Full response:", err.response);

      // If server returned a JSON response, surface it to the user
      const serverData = err.response?.data;
      if (serverData) {
        console.error("Server response data:", serverData);
        const message =
          serverData.error || serverData.message || JSON.stringify(serverData);
        const details = serverData.details
          ? `\nDetails: ${serverData.details.join("; ")}`
          : "";
        alert(
          `Error: ${message}${details}\nRequest URL: ${
            err.config?.url || quizService.API_URL
          }`
        );
        return;
      }

      // Fallback to axios/network error info
      try {
        const info = err.toJSON ? err.toJSON() : { message: err.message };
        alert(
          `Error: ${info.message}\nRequest URL: ${
            err.config?.url || quizService.API_URL
          }`
        );
      } catch (err) {
        alert(err.message || "Network error");
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl mb-4">Create Quiz</h1>
      <Link to="/admin" className="btn btn-secondary mb-4">
        Back
      </Link>
      <div className="card p-4">
        <label className="block">Module</label>
        <input
          value={module}
          onChange={(e) => setModule(e.target.value)}
          placeholder="Module title (must match module title)"
          className="mb-2"
        />
        <label className="block">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mb-2"
        />

        <h3 className="mt-4">Questions</h3>
        {questions.map((q, qi) => (
          <div key={qi} className="border p-3 mb-2">
            <label>Question Text</label>
            <input
              value={q.text}
              onChange={(e) => updateQuestion(qi, "text", e.target.value)}
              className="mb-2"
            />
            <label>Options</label>
            {q.options.map((opt, oi) => (
              <input
                key={oi}
                value={opt}
                onChange={(e) => updateOption(qi, oi, e.target.value)}
                className="mb-2"
              />
            ))}
            <button
              onClick={() => addOption(qi)}
              className="btn btn-secondary btn-sm mr-2"
            >
              Add Option
            </button>
            <label className="block mt-2">Correct Option Index</label>
            <input
              type="number"
              value={q.correctIndex}
              onChange={(e) =>
                updateQuestion(qi, "correctIndex", Number(e.target.value))
              }
              className="mb-2"
            />
            <button
              onClick={() => removeQuestion(qi)}
              className="btn btn-danger btn-sm"
            >
              Remove Question
            </button>
          </div>
        ))}
        <button onClick={addQuestion} className="btn btn-primary mr-2">
          Add Question
        </button>
        <button onClick={handleCreate} className="btn btn-success">
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
