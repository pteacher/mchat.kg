const progressBar = $('#progress-bar');

function updateProgressBar(currentQuestion, totalQuestions) {
  const percentage = (currentQuestion / totalQuestions) * 100;
  progressBar.width(`${percentage}%`);
  progressBar.attr('aria-valuenow', percentage);
}


// Load the questions from the JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(questions => {
    // Store the questions in a variable
    let currentQuestion = 0;
    let points = 20;

    // Function to display the next question
    const displayQuestion = () => {
      // Update the question container with the next question
      document.querySelector('#questionText').innerHTML = questions[currentQuestion].question;
    };

    // Function to handle the yes button click
    const handleYesButton = () => {
        updateProgressBar(currentQuestion + 1, questions.length);
      // Increment the points
      points += questions[currentQuestion].points;

      // Move to the next question
      currentQuestion++;

      // If there are no more questions, show a message
      if (currentQuestion === questions.length) {
        alert(`You have earned ${points} points!`);
        return;
      }

      // Display the next question
      displayQuestion();
    };

    // Function to handle the no button click
    const handleNoButton = () => {
      // Move to the next question
      updateProgressBar(currentQuestion + 1, questions.length);
      currentQuestion++;

      // If there are no more questions, show a message
      if (currentQuestion === questions.length) {
        alert(`You have earned ${points} points!`);
        return;
      }

      // Display the next question
      displayQuestion();
    };

    // Add event listeners to the buttons
    document.querySelector('#yesBtn').addEventListener('click', handleYesButton);
    document.querySelector('#noBtn').addEventListener('click', handleNoButton);

    // Display the first question
    displayQuestion();
  });
