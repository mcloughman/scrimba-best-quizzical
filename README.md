# Quizzical
Technologies used - React, Javascript, CSS, HTML

Trivia API that gives user the choice of subject, difficulty level, and number of questions.

The focal point of the project is the React.useState hook. The array of question objects received from the API is saved to state. This builds on the Scrimba course teachings that, while more complex, it is better to maintain state for the entire array on the App component rather than letting the child component control it's own state. 

Since the API provider put a five second rate limit on the calls, a refactor was needed to adhere to that limit.
As the user has choices of what type of quiz they want to take, it was not necessary to utilize the useEffect hook. There's no good reason to call the API until the user has clicked the Start Quiz button.
Also, the situation called for the implementation of a function which tracks the time of the last API call and also prevents a subsequent call until there has been at least 5 seconds from last call.



  

 

 
