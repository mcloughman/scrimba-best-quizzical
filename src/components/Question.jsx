import { useEffect, useState } from "react"

export default function Question(props) {
  const [allAnswers, setAllAnswers] = useState([])

  const {
    correctAnswer,
    incorrectAnswers,
    updateSelectedAnswers,
    selectedAnswer,
    id,
    quizGraded,
    question,
  } = props

  // I prefer setting the answers this way. It makes sense
  useEffect(() => {
    const allPossibleAnswers = [...incorrectAnswers]

    const randomIndex = Math.floor(
      Math.random() * allPossibleAnswers.length + 1
    )

    if (allPossibleAnswers.length === 1) {
      allPossibleAnswers.push(correctAnswer)
      allPossibleAnswers.sort((a, b) => a - b)
    } else if (!allPossibleAnswers[randomIndex]) {
      allPossibleAnswers.push(correctAnswer)
    } else {
      allPossibleAnswers.splice(randomIndex, 0, correctAnswer)
    }
    setAllAnswers(allPossibleAnswers)
  }, [])

  return (
    <div className="q-a-container">
      <h3>{question}</h3>
      <div className="answers-container">
        {allAnswers.map((answer, i) => {
          const inputId = `question-${id}-answer-${i}`
          const isThisAnswerCorrect = answer === correctAnswer
          const isSelectedAnswer = answer === selectedAnswer

          const buttonClass = quizGraded
            ? isThisAnswerCorrect
              ? "correct-answer"
              : isSelectedAnswer
              ? "incorrect-answer"
              : ""
            : ""
          return (
            <div key={i}>
              <input
                type="radio"
                id={inputId}
                name={`question-${id}`}
                value={answer}
                checked={selectedAnswer === answer}
                onChange={updateSelectedAnswers}
              />
              <label
                onClick={() => updateSelectedAnswers(id, answer)}
                htmlFor={inputId}
                className={`radio-btn ${buttonClass} id="hello"`}
              >
                {answer}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
