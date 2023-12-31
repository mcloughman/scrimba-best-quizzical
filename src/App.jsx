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
  const [lastAPICallTime, setLastAPICallTime] = useState(null)
  // Since the API has rate limits, the UI should use isLoading when appropriate
  const [isLoading, setIsLoading] = useState(false)
  // Initially this function was created and called inside the useEffect.
  // But we need it outside the useEffect for playAgain.
  // So when the app loads the very first time,
  // the useEffect that calls this function inside will run.
  // And since quizInProgress evaluates to false, the Home comonent is rendered.
  // And the user clicks on startQuiz to change quizInProgress to true
  // and render the Question Component however many times it needs to.
  // At the end, when user decides to play again, we don't user taken to home page.
  // So we create the playAgain function which fetches the questions and updates
  // the states that we need to update. Since we still keep quizInProgress as true,
  // we are able to bypass the Home component. There are possible upgrades like
  // setting isLoading for UX. But for now this works. I have a handle on it.

  // We need to respect API rate limits and this function will help
  const calculateWaitTime = () => {
    let waitTime

    if (lastAPICallTime === null) {
      waitTime = 0
    } else {
      const differenceInMilliseconds = Date.now() - lastAPICallTime
      waitTime =
        differenceInMilliseconds > 5000 ? 0 : 5001 - differenceInMilliseconds
    }

    return waitTime
  }

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      setLastAPICallTime(Date.now())
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuizOptionChange = (optionName, value) => {
    setQuizOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }))
  }

  const startQuiz = () => {
    const waitTime = calculateWaitTime()

    setTimeout(() => {
      fetchQuestions() // Fetch questions to start the quiz
      setQuizInProgress(true)
    }, waitTime)
  }

  // How do we handle bypassing Home component on play again? VERY Important.
  function playAgain() {
    const waitTime = calculateWaitTime()
    setTimeout(async () => {
      setQuizGraded(false) // Reset the quizGraded state
      setScore("") // Reset the score state
      setSelectedAnswers({}) // Reset selectedAnswers state
      fetchQuestions() // Fetch new questions to start a new quiz
    }, waitTime)
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
        <img src="assets/blob-baby.png" alt="" className="img baby" />
        <img src="assets/blob-lemony.png" alt="" className="img lemony" />
      </div>
      {isLoading && <h3>Loading...</h3>}
      {error && <h3>Something went wrong! :( {error}</h3>}
      {!quizInProgress && !error && (
        <Home
          startQuiz={startQuiz}
          quizOptions={quizOptions}
          onQuizOptionsChange={handleQuizOptionChange}
        />
      )}
      {!error && !isLoading && quizInProgress && <>{questionElements}</>}
      {quizInProgress && !quizGraded && !isLoading && (
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
