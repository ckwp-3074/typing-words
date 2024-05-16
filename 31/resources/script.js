// CSVファイルから問題を読み込む関数
function loadQuestionsFromCSV(file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, false);
    xhr.send();
  
    var lines = xhr.responseText.trim().split("\n");
    var questions = [];
  
    for (var i = 0; i < lines.length; i++) {
      var parts = lines[i].split(",");
      var question = {
        question: parts[1], // Use the second column as the question
        answer: parts[0]    // Use the first column as the answer
      };
      questions.push(question);
    }
  
    return questions;
  }
  
  // テキストファイルのパスを指定して単語を読み込みと表示を行う
  loadWordFromFile("name.txt", displayWord);
  
  var questions = loadQuestionsFromCSV("questions.csv");
  var shuffledQuestions = [];
  var currentQuestion = 0;
  var score = 0;
  var maxQuestionCount = questions.length; // 出題最高問題数をCSVファイルの問題数に制限
  var totalQuestionCount = questions.length; // 問題の総数
  var retryButton = document.getElementById("retryButton");
  var skippedQuestionsElement = document.getElementById("skippedQuestions");
  var container = document.querySelector(".container");
  var skippedQuestions = [];
  
  // Display function modified to remove choices
  function displayQuestion() {
    var questionElement = document.getElementById("question");
    var currentQuestionCountElement = document.getElementById("currentQuestionCount");
  
    questionElement.textContent = shuffledQuestions[currentQuestion].question;
  
    document.getElementById("answer").value = ""; // 解答欄をリセット
    currentQuestionCountElement.textContent = "現在の出題問題数: " + (currentQuestion + 1) + "/" + totalQuestionCount;
    retryButton.style.display = "none"; // 「もう一度解く」ボタンを非表示
  
    // 背景色の設定
    if (currentQuestion < 20) {
      container.style.backgroundColor = "white";
    } else if (currentQuestion < 40) {
      container.style.backgroundColor = "white"; // 水色
    } else if (currentQuestion < 60) {
      container.style.backgroundColor = "white"; // 青
    } else if (currentQuestion < 80) {
      container.style.backgroundColor = "white"; // オレンジ
    } else if (currentQuestion < 100) {
      container.style.backgroundColor = "white"; // 紫
    } else {
      container.style.backgroundColor = "white";
    }
  }
  
  // Modified function to check the answer
  function checkAnswer() {
    var answer = document.getElementById("answer").value.trim();
    var correctAnswer = shuffledQuestions[currentQuestion].answer.trim();
  
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      score++;
      alert("正解！");
      nextQuestion();
    } else {
      alert("違うぞっ！！");
      document.getElementById("answer").value = "";
      retryButton.style.display = "inline-block";
    }
  }
  