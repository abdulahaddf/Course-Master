import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import courseService from "../services/courseService";
import quizService from "../services/quizService";
import { toast } from "react-toastify";

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
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  console.log(courseId);
  // Fetch course modules on mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const course = await courseService.getCourseById(courseId);
        console.log(course);
        if (course.syllabus && Array.isArray(course.syllabus)) {
          setModules(course.syllabus);
        }
      } catch (error) {
        console.error("Failed to load modules:", error);
      } finally {
        setLoadingModules(false);
      }
    };
    fetchModules();
  }, [courseId]);

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
      toast.error("Title is required");
      return;
    }
    if (!module.trim()) {
      toast.error("Module is required");
      return;
    }
    if (!questions.length) {
      toast.error("At least one question is required");
      return;
    }

    // Validate all questions have text and options
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1}: Text is required`);
        return;
      }
      const nonEmptyOptions = q.options.filter((opt) => opt.trim());
      if (nonEmptyOptions.length < 2) {
        toast.error(
          `Question ${i + 1}: At least 2 non-empty options are required`
        );
        return;
      }
      if (q.correctIndex < 0 || q.correctIndex >= nonEmptyOptions.length) {
        toast.error(
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
      toast.success("Quiz created");
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
        toast.error(`${message}${details}`);
        console.error("Request URL:", err.config?.url || quizService.API_URL);
        return;
      }

      // Fallback to axios/network error info
      try {
        const info = err.toJSON ? err.toJSON() : { message: err.message };
        toast.error(info.message);
        console.error("Request URL:", err.config?.url || quizService.API_URL);
      } catch (err) {
        toast.error(err.message || "Network error");
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 mt-10">
      <h1 className="text-3xl font-semibold mb-4 text-gray-800">Create Quiz</h1>

      <Link
        to="/admin"
        className="inline-block mb-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
      >
        ⬅ Back
      </Link>

      <div className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6">
        {/* Module Dropdown */}
        <label className="block font-medium text-gray-700 mb-1">Module</label>

        {loadingModules ? (
          <p className="text-gray-500 mt-1">Loading modules...</p>
        ) : modules.length > 0 ? (
          <div className="relative mb-4">
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="
        w-full appearance-none 
        px-4 py-2 pr-10
        rounded-xl 
        border border-gray-300 
        bg-white/80 backdrop-blur-sm
        shadow-sm 
        text-gray-800
        focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
        transition
      "
            >
              <option value="">-- Select a module --</option>
              {modules.map((mod, idx) => (
                <option key={idx} value={mod.title}>
                  {mod.title}
                </option>
              ))}
            </select>

            {/* Custom dropdown icon */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-1">
            No modules available for this course
          </p>
        )}

        {/* Title */}
        <label className="block font-medium text-gray-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
        />

        {/* Description */}
        <label className="block font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full mt-1 mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
        />

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          Questions
        </h3>

        {questions.map((q, qi) => (
          <div
            key={qi}
            className="border border-gray-300 bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            {/* Question text */}
            <label className="block font-medium text-gray-700">
              Question Text
            </label>
            <input
              value={q.text}
              onChange={(e) => updateQuestion(qi, "text", e.target.value)}
              className="w-full mt-1 mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />

            {/* Options */}
            <label className="block font-medium text-gray-700">Options</label>
            {q.options.map((opt, oi) => (
              <input
                key={oi}
                value={opt}
                onChange={(e) => updateOption(qi, oi, e.target.value)}
                className="w-full mt-1 mb-2 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            ))}

            <button
              onClick={() => addOption(qi)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm mr-2 transition"
            >
              + Add Option
            </button>

            {/* Correct index */}
            <label className="block mt-3 font-medium text-gray-700">
              Correct Option Index
            </label>
            <input
              type="number"
              value={q.correctIndex}
              onChange={(e) =>
                updateQuestion(qi, "correctIndex", Number(e.target.value))
              }
              className="w-full mt-1 mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />

            <button
              onClick={() => removeQuestion(qi)}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
            >
              Remove Question
            </button>
          </div>
        ))}

        {/* Buttons */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={addQuestion}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
          >
            + Add Question
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
