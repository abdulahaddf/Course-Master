const QuizPanel = ({
  quiz,
  quizAnswers,
  handleQuizAnswer,
  handleSubmitQuiz,
  quizResult,
}) => {
  if (!quiz)
    return <p className="text-sm text-muted">No quiz for this module.</p>;

  return (
    <div>
      {quiz.questions.map((q, qi) => (
        <div key={qi} className="mb-3">
          <p className="font-medium">
            {qi + 1}. {q.text}
          </p>
          {q.options.map((opt, oi) => (
            <label key={oi} className="block">
              <input
                type="radio"
                name={`q-${qi}`}
                checked={quizAnswers[qi] === oi}
                onChange={() => handleQuizAnswer(qi, oi)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmitQuiz} className="btn btn-primary mr-2">
        Submit Quiz
      </button>
      {quizResult && (
        <div className="mt-2 p-2 bg-green-100 rounded">
          Score: {quizResult.score}% — {quizResult.correctAnswers}/
          {quizResult.total}
        </div>
      )}
    </div>
  );
};

export default QuizPanel;
