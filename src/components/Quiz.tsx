import { useState } from 'react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
}

export default function Quiz({ title = 'Quiz', questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="not-content my-6 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          {title} - Results
        </h3>
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl font-bold text-purple-600 dark:text-purple-400">
            {score} / {questions.length}
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {percentage}% correct
          </div>
          <div className="mt-4 text-lg">
            {percentage === 100
              ? 'Perfect score!'
              : percentage >= 70
                ? 'Great job!'
                : percentage >= 50
                  ? 'Good effort! Review the material and try again.'
                  : 'Keep studying and try again!'}
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="not-content my-6 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full bg-purple-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <p className="mb-4 text-lg text-slate-800 dark:text-slate-200">
        {currentQuestion.question}
      </p>

      {/* Options */}
      <div className="mb-4 space-y-2" role="radiogroup">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === currentQuestion.correctIndex;

          let optionClasses =
            'w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ';

          if (showExplanation) {
            if (isCorrectOption) {
              optionClasses +=
                'border-green-500 bg-green-50 dark:bg-green-900/30';
            } else if (isSelected && !isCorrectOption) {
              optionClasses += 'border-red-500 bg-red-50 dark:bg-red-900/30';
            } else {
              optionClasses +=
                'border-slate-200 dark:border-slate-600 opacity-50';
            }
          } else if (isSelected) {
            optionClasses +=
              'border-purple-500 bg-purple-50 dark:bg-purple-900/30';
          } else {
            optionClasses +=
              'border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={optionClasses}
              disabled={showExplanation}
              role="radio"
              aria-checked={isSelected}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {option}
                </span>
                {showExplanation && isCorrectOption && (
                  <span className="ml-auto text-green-600 dark:text-green-400">
                    Correct
                  </span>
                )}
                {showExplanation && isSelected && !isCorrectOption && (
                  <span className="ml-auto text-red-600 dark:text-red-400">
                    Incorrect
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div
          className={`mb-4 rounded-lg p-4 ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-amber-50 dark:bg-amber-900/20'
          }`}
        >
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Action button */}
      {!showExplanation ? (
        <button
          onClick={handleCheck}
          disabled={selectedAnswer === null}
          className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}
