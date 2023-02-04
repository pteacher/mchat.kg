const progressBar = $('#progress-bar');

function updateProgressBar(currentQuestion, totalQuestions) {
  const percentage = (currentQuestion / totalQuestions) * 100;
  progressBar.width(`${percentage}%`);
  progressBar.attr('aria-valuenow', percentage);
}

let deferredPrompt;
const addBtn = document.querySelector(".add-button");
addBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = "block";
  
    addBtn.addEventListener("click", (e) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = "none";
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    });
  });

// Load the questions from the JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(questions => {
    // Store the questions in a variable
    let currentQuestion = 0;
    let points = 17;

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
        let risk = "НИЗКИЙ РИСК";
        if (points > 2 & points < 8) { risk = "СРЕДНИЙ РИСК" }
        else if (points > 8) { risk = "ВЫСОКИЙ РИСК"}
        $('#testResult').text(risk + ` (${points} баллов)`);
        $('#resultModal').modal('toggle')
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
        let risk = "НИЗКИЙ РИСК";
        if (points > 2 & points < 8) { risk = "СРЕДНИЙ РИСК" }
        else if (points > 8) { risk = "ВЫСОКИЙ РИСК"}
        $('#testResult').text(risk + ` (${points} баллов)`);
        $('#resultModal').modal('toggle')
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
