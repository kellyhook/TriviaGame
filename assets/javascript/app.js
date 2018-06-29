// * You'll create a trivia form with multiple choice or true/false options (your choice).
//
// * The player will have a limited amount of time to finish the quiz.
//
// * The game ends when the time runs out. The page will reveal the number of questions that players answer correctly and incorrectly.
//
// * Don't let the player pick more than one answer per question.
//
// * Don't forget to include a countdown timer.

$(document).ready(function() {

  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click', '.option', trivia.guessChecker);

})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId: '',
  // questions options and answers data
  questions: {
    q1: 'What is a dApp?',
    q2: 'What is the term for when a Blockchain splits?',
    q3: 'What is a genesis block?',
    q4: 'What powers Ethereum?',
    q5: 'What is UTXO?',
    q6: "Who invented Ethereum?",
    q7: 'What characteristic makes blockchain tamper-proof?',
  },
  options: {
    q1: ['Cryptocurrency', 'A blockchain', 'Nonrefundable transaction', 'Decentralized application'],
    q2: ['A fork', 'A split', 'A simultaneous block', 'New venture'],
    q3: ["The first block a miner creates", 'A Satoshi Nakamoto', 'The first block of a blockchain', 'A hash'],
    q4: ['Ether', 'Bitcoin', 'Gas', 'Wei'],
    q5: ['Unspent Transaction Output', 'United Transaction Outreach', 'Universal Transaction Output', 'Union Transaction Origin'],
    q6: ['Nick Szabo', 'Ralph Wiggum', 'Ralph Merkle', 'Vitalik Buterin'],
    q7: ['VPN', 'Cryptocurrency', 'Immutability', 'Government']
  },
  answers: {
    q1: 'Decentralized application',
    q2: 'A fork',
    q3: 'The first block of a blockchain',
    q4: 'Gas',
    q5: 'Unspent Transaction Output',
    q6: 'Vitalik Buterin',
    q7: 'Immutability'
  },
  // trivia methods
  // method to initialize game
  startGame: function() {
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);

    // show game section
    $('#game').show();

    //  empty last results
    $('#results').html('');

    // show timer
    $('#timer').text(trivia.timer);

    // remove start button
    $('#start').hide();

    $('#remaining-time').show();

    // ask first question
    trivia.nextQuestion();

  },
  // method to loop through and display questions and options
  nextQuestion: function() {

    // set timer to 20 seconds each question
    trivia.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);

    // to prevent timer speed up
    if (!trivia.timerOn) {
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }

    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);

    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];

    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key) {
      $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
    })

  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning: function() {
    // if timer still has time left and there are still questions left to ask
    if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
      $('#timer').text(trivia.timer);
      trivia.timer--;
      if (trivia.timer === 4) {
        $('#timer').addClass('last-seconds');
      }
    }
    // the time has run out and increment unanswered, run result
    else if (trivia.timer === -1) {
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if (trivia.currentSet === Object.keys(trivia.questions).length) {

      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>' +
          '<p>Correct: ' + trivia.correct + '</p>' +
          '<p>Incorrect: ' + trivia.incorrect + '</p>' +
          '<p>Unaswered: ' + trivia.unanswered + '</p>' +
          '<p>Please play again!</p>');

      // hide game sction
      $('#game').hide();

      // show start button to begin a new game
      $('#start').show();
    }

  },
  // method to evaluate the option clicked
  guessChecker: function() {

    // timer ID for gameResult setTimeout
    var resultId;

    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

    // if the text of the option picked matches the answer of the current question, increment correct
    if ($(this).text() === currentAnswer) {
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');

      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else {
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');

      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! ' + currentAnswer + '</h3>');
    }

  },
  // method to remove previous question results and options
  guessResult: function() {

    // increment to next question set
    trivia.currentSet++;

    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();

    // begin next question
    trivia.nextQuestion();

  }

}