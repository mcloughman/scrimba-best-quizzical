export default function Home(props) {
  const { startQuiz } = props
  return (
    <div className="home">
      <h1>Quizzical</h1>
      <h3>Test your trivia knowledge</h3>
      <div className="dropdowns">
        <div className="category dropdown">
          <label htmlFor="category">Category-----------</label>
          <select
            name="category"
            id="category"
            value={props.quizOptions.category}
            onChange={(e) =>
              props.onQuizOptionsChange("category", e.target.value)
            }
          >
            <option value="9">General</option>
            <option value="21">Sports</option>
            <option value="22">Geography</option>
            <option value="23">History</option>
            <option value="10">Books</option>
            <option value="11">Movies</option>
            <option value="14">TV</option>
            <option value="27">Animals</option>
          </select>
        </div>
        <div className="level dropdown">
          <label htmlFor="level">Difficulty Level-------</label>
          <select
            name="level"
            id="level"
            value={props.quizOptions.difficulty}
            onChange={(e) =>
              props.onQuizOptionsChange("difficulty", e.target.value)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="num-questions dropdown">
          <label htmlFor="num-questions">Number of Questions-----</label>
          <select
            name="numQuestions"
            id="num-questions"
            value={props.quizOptions.numQuestions}
            onChange={(e) =>
              props.onQuizOptionsChange("numQuestions", e.target.value)
            }
          >
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
      <button className="start-btn" onClick={props.startQuiz}>
        Start Quiz
      </button>
    </div>
  )
}
