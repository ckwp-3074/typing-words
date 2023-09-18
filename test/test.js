//title,h4タグ記載

// テキストファイルから単語を読み込む関数
function loadWordFromFile(file, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, true);
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var word = xhr.responseText.trim();
        callback(word);
      }
    };
  
    xhr.send();
  }
  
  // 単語を表示するための関数
  function displayWord(word) {
    // タイトルの表示
    document.title = word + " - 用語タイピング";
  
    // h4タグの表示
    var h4Element = document.querySelector(".container h4");
    h4Element.textContent = "～" + word + "～";
  }
  
  // テキストファイルのパスを指定して単語を読み込みと表示を行う
  loadWordFromFile("name.txt", displayWord);
//ここまで  

//クイズ出題・正誤判定

// CSVファイルから問題と解答を読み込む関数
// 選択肢をランダムに生成する関数
function generateRandomChoices(correctAnswer, allAnswers) {
    // ランダムな順番で選択肢をシャッフル
    var choices = [correctAnswer].concat(allAnswers);
    shuffle(choices);
    return choices;
  }
  
  // 配列をランダムにシャッフルする関数
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  }
  
  // CSVファイルから問題と模範解答を読み込む関数
  function loadQuestionsFromCSV(file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, false);
    xhr.send();
  
    var lines = xhr.responseText.trim().split("\n");
    var questions = [];
  
    for (var i = 0; i < lines.length; i++) {
      var parts = lines[i].split(",");
      var question = {
        question: parts[0], // 問題文
        correctAnswer: parts[1], // 模範解答
        choices: generateRandomChoices(parts[1], [parts[2], parts[3], parts[4]]) // ランダムな選択肢を生成
      };
      questions.push(question);
    }
  
    return questions;
  }
  
  var questions = loadQuestionsFromCSV("questions.csv");
  var shuffledQuestions = [];
  var currentQuestion = 0;
  var score = 0;
  var maxQuestionCount = questions.length;
  var totalQuestionCount = questions.length;
  var retryButton = document.getElementById("retryButton");
  var skippedQuestionsElement = document.getElementById("skippedQuestions");
  var container = document.querySelector(".container");
  var skippedQuestions = [];
  
  function startQuiz() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("quizScreen").style.display = "block";
  
    shuffledQuestions = shuffle(questions);
  
    displayQuestion();
  }
  
  function displayQuestion() {
    var questionElement = document.getElementById("question");
    var choicesElement = document.getElementById("choices");
    var currentQuestionCountElement = document.getElementById("currentQuestionCount");
  
    questionElement.textContent = shuffledQuestions[currentQuestion].question;
    choicesElement.innerHTML = "";
  
    for (var i = 0; i < shuffledQuestions[currentQuestion].choices.length; i++) {
      var choice = document.createElement("li");
      choice.textContent = shuffledQuestions[currentQuestion].choices[i];
      choicesElement.appendChild(choice);
    }
  
    document.getElementById("answer").value = "";
    currentQuestionCountElement.textContent = "現在の出題問題数: " + (currentQuestion + 1) + "/" + totalQuestionCount;
    retryButton.style.display = "none";
  
    if (currentQuestion < 20) {
      container.style.backgroundColor = "white";
    } else if (currentQuestion < 40) {
      container.style.backgroundColor = "#e0f7fa"; // 水色
    } else if (currentQuestion < 60) {
      container.style.backgroundColor = "#2196f3"; // 青
    } else if (currentQuestion < 80) {
      container.style.backgroundColor = "#ff9800"; // オレンジ
    } else if (currentQuestion < 100) {
      container.style.backgroundColor = "#9c27b0"; // 紫
    } else {
      container.style.backgroundColor = "red";
    }
  }
  
  function checkAnswer() {
    var answer = document.getElementById("answer").value.trim();
    var correctAnswer = shuffledQuestions[currentQuestion].correctAnswer.trim();
  
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
  
  function nextQuestion() {
    currentQuestion++;
  
    if (currentQuestion >= maxQuestionCount) {
      finishQuiz();
    } else {
      displayQuestion();
    }
  }
  
  function clearResult() {
    var resultElement = document.getElementById("result");
    resultElement.textContent = "";
  }
  
  function retryQuestion() {
    document.getElementById("answer").value = "";
    retryButton.style.display = "none";
  }
  
  function finishQuiz() {
    var result = "おつかれさまです！" + currentQuestion + "問解きました！";
    alert(result);
  
    var skippedQuestionsHtml = "<h2>スキップされた問題と答え</h2>";
  
    for (var i = maxQuestionCount; i < totalQuestionCount; i++) {
      var skippedQuestion = shuffledQuestions[i].question;
      var skippedAnswer = shuffledQuestions[i].correctAnswer;
      skippedQuestionsHtml += "<p><strong>問題: </strong>" + skippedQuestion + "</p>";
      skippedQuestionsHtml += "<p><strong>答え: </strong>" + skippedAnswer + "</p>";
    }
  
    skippedQuestionsElement.innerHTML = skippedQuestionsHtml;
    skippedQuestionsElement.style.display = "block";
  
    document.getElementById("quizScreen").style.display = "none";
    currentQuestion = 0;
    score = 0;
    shuffledQuestions = shuffle(questions);
    skippedQuestionsElement.style.display = "none";
    document.getElementById("startScreen").style.display = "block";
  }
  
  function quitQuiz() {
    finishQuiz();
  }
  
  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      checkAnswer();
    }
  }
  
  // クイズ開始ボタンのイベントリスナーを追加
  document.getElementById("startButton").addEventListener("click", startQuiz);
  
  // 回答ボタンのイベントリスナーを追加
  document.getElementById("answerButton").addEventListener("click", checkAnswer);
  
  // 次の問題へボタンのイベントリスナーを追加
  document.getElementById("nextButton").addEventListener("click", nextQuestion);
  
  // クイズ終了ボタンのイベントリスナーを追加
  document.getElementById("quitButton").addEventListener("click", quitQuiz);
  
  // 「もう一度解く」ボタンのイベントリスナーを追加
  document.getElementById("retryButton").addEventListener("click", retryQuestion);
  
  // 配列をランダムにシャッフルする関数を追加
  Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
    return this;
  }
  
//ここまで
;