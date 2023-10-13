import { useState, useEffect } from "react"
import Home from "./components/Home"
import Question from "./components/Question"
import Button from "./components/Button"
import { nanoid } from "nanoid"
import he from "he"

export default function App() {
  const [quizOptions, setQuizOptions] = useState({
    category: "9", // Default to General Knowledge
    difficulty: "easy", // Default to Easy
    numQuestions: "5", // Default to 5
  })
  const [questions, setQuestions] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizInProgress, setQuizInProgress] = useState(false)
  const [quizGraded, setQuizGraded] = useState(false)
  const [score, setScore] = useState("")
  const [error, setError] = useState("")

  // Initially this function was created and called inside the useEffect. But we need it outside the useEffect for playAgain. So when the app loads the very first time, the useEffect that calls this function inside will run. And since quizInProgress evaluates to false, the Home comonent is rendered. And the user clicks on startQuiz to change quizInProgress to true and render the Question Component however many times it needs to. At the end, when user decides to play again, we don't user taken to home page. So we create the playAgain function which fetches the questions and updates the states that we need to update. Since we still keep quizInProgress as true, we are able to bypass the Home component. There are possible upgrades like setting isLoading for UX. But for now this works. I have a handle on it.
  const fetchQuestions = async (url) => {
    try {
      const apiUrl = `https://opentdb.com/api.php?amount=${quizOptions.numQuestions}&difficulty=${quizOptions.difficulty}&category=${quizOptions.category}`

      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch")
      }
      const data = await response.json()
      const questionsWithIds = data.results.map((questionObj) => ({
        ...questionObj,
        key: nanoid(),
        id: nanoid(),
        question: he.decode(questionObj.question),
        correct_answer: he.decode(questionObj.correct_answer),
        incorrect_answers: questionObj.incorrect_answers.map((answer) =>
          he.decode(answer)
        ),
      }))

      setQuestions(questionsWithIds)
    } catch (e) {
      setError(e.message)
      console.log("Error", e.message)
    }
  }
  useEffect(() => {
    fetchQuestions() // Fetch questions when the component mounts
  }, [quizOptions])

  const handleQuizOptionChange = (optionName, value) => {
    setQuizOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }))
  }

  function startQuiz() {
    setQuizInProgress(true)
  }
  // How do we handle bypassing Home component on play again? VERY Important.
  function playAgain() {
    setQuizGraded(false) // Reset the quizGraded state
    setScore("") // Reset the score state
    setSelectedAnswers({}) // Reset selectedAnswers state
    fetchQuestions() // Fetch new questions to start a new quiz
  }
  // This function will work to re-render the Home component so user can choose new Quiz options
  function changeQuiz() {
    setQuizInProgress(false)
    setQuizGraded(false)
  }
  // Update selectedAnwers as user clicks
  function updateSelectedAnswers(questionId, answer) {
    setSelectedAnswers((prevSelectedAnswers) => {
      return {
        ...prevSelectedAnswers,
        [questionId]: answer,
      }
    })
  }
  function scoreQuiz(e) {
    e.preventDefault()
    let rightAnswers = 0
    questions.forEach((obj) => {
      if (obj.correct_answer === selectedAnswers[obj.id]) {
        rightAnswers++
      }
    })
    setQuizGraded(true)
    setScore(rightAnswers)
  }

  const questionElements = questions.map((questionObject) => {
    return (
      <Question
        key={questionObject.id}
        id={questionObject.id}
        question={questionObject.question}
        correctAnswer={questionObject.correct_answer}
        incorrectAnswers={questionObject.incorrect_answers}
        selectedAnswer={selectedAnswers[questionObject.id] || ""}
        quizGraded={quizGraded}
        updateSelectedAnswers={updateSelectedAnswers}
      />
    )
  })

  return (
    <div className="container">
      <div className="images-div">
        <img
          src="src/assets/blob-baby.png"
          alt="baby-blob"
          className="img baby"
        />
        <img
          src="src/assets/blob-lemony.png"
          alt="lemony-blob"
          className="img lemony"
        />
      </div>
      {error && <h3>Something went wrong! :( {error}</h3>}
      {!quizInProgress && !error && (
        <Home
          startQuiz={startQuiz}
          quizOptions={quizOptions}
          onQuizOptionsChange={handleQuizOptionChange}
        />
      )}
      {!error && quizInProgress && <>{questionElements}</>}
      {quizInProgress && !quizGraded && (
        <>
          <Button scoreQuiz={scoreQuiz} />
        </>
      )}

      {quizGraded && (
        <div className="score-div">
          <button className="change-quiz-params-btn" onClick={changeQuiz}>
            Change Quiz Options
          </button>
          <h3>
            You got {score} out of {questions.length} right
          </h3>
          <button className="play-again-btn" onClick={playAgain}>
            Play again
          </button>
        </div>
      )}
    </div>
  )
}
