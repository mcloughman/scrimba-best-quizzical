# Quizzical

Trivia application built with React, using technologies such as JavaScript, CSS, and HTML.

## Live Demo
https://quizzical-michaelloughman.netlify.app/

## Technologies Used

- React
- JavaScript
- CSS
- HTML

## Project Overview

Quizzical is a trivia application that allows users to choose a subject, difficulty level, and the number of questions for their quiz. The primary focus of the project is the utilization of the React `useState` hook. The array of question objects retrieved from the Trivia API is stored in the component's state. This design decision aligns with the principles taught in the Scrimba course, emphasizing the maintenance of state for the entire array in the `App` component rather than letting the child component manage its own state.

## Rate Limit Refactor

Due to a five-second rate limit imposed by the API provider, a refactor was necessary to adhere to this limitation. To optimize API calls and user experience, the implementation avoids unnecessary calls until the user clicks the "Start Quiz" button. The absence of a need for the `useEffect` hook stems from the user's ability to choose the quiz type. Consequently, API calls are only made when initiated by the user. A function was introduced to track the time of the last API call and prevent subsequent calls until at least 5 seconds have passed.





  

 

 
