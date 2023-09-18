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
function loadQuestionsFromCSV(file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, false);
    xhr.send();
  
    var lines = xhr.responseText.trim().split("\n");
    var questions = [];
  
    for (var i = 0; i < lines.length; i++) {
      var parts = lines[i].split(",");
      var question = {
        question: parts[0],                  // 問題文
        correctAnswer: parts[1],             // 模範解答
        choices: generateRandomChoices(parts.slice(1), parts[1])  // ランダムな選択肢を生成
      };
      questions.push(question);
    }
  
    return questions;
  }
  
  // 問題を表示する関数
  function displayQuestion() {
    var questionElement = document.getElementById("question");
    var choicesElement = document.getElementById("choices");
  
    var currentQuestionData = shuffledQuestions[currentQuestion];
  
    questionElement.textContent = currentQuestionData.question;
  
    // 選択肢を表示
    choicesElement.innerHTML = ""; // 選択肢をクリア
  
    for (var i = 0; i < currentQuestionData.choices.length; i++) {
      var choice = document.createElement("li");
      choice.textContent = currentQuestionData.choices[i];
      choicesElement.appendChild(choice);
    }
  }
  
  
  // 問題文と解答群をシャッフルする関数
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  function generateRandomChoices(allAnswers, correctAnswer) {
  // 全ての模範解答から正解を除いた配列を作成
  var choicesWithoutCorrect = allAnswers.filter(answer => answer !== correctAnswer);

  // ランダムに3つの選択肢を選ぶ
  var randomChoices = [];
  while (randomChoices.length < 3 && choicesWithoutCorrect.length > 0) {
    var randomIndex = Math.floor(Math.random() * choicesWithoutCorrect.length);
    randomChoices.push(choicesWithoutCorrect.splice(randomIndex, 1)[0]);
  }

  // 正解を含めて選択肢をシャッフル
  randomChoices.push(correctAnswer);
  randomChoices = shuffle(randomChoices);

  return randomChoices;
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

  return array;
}

function generateRandomChoices(allAnswers, correctAnswer) {
    // 全ての模範解答から正解を除いた配列を作成
    var choicesWithoutCorrect = allAnswers.filter(answer => answer !== correctAnswer);
  
    // ランダムに3つの選択肢を選ぶ
    var randomChoices = [];
    while (randomChoices.length < 3 && choicesWithoutCorrect.length > 0) {
      var randomIndex = Math.floor(Math.random() * choicesWithoutCorrect.length);
      randomChoices.push(choicesWithoutCorrect.splice(randomIndex, 1)[0]);
    }
  
    // 正解を含めて選択肢をシャッフル
    randomChoices.push(correctAnswer);
    randomChoices = shuffle(randomChoices);
  
    return randomChoices;
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
  
    return array;
  }
  
  
  var questions = loadQuestionsFromCSV("questions.csv");
  var shuffledQuestions = shuffle(questions);
  var currentQuestion = 0;
  displayQuestion();
  

function startQuiz() {
  document.getElementById("startScreen").style.display = "none"; // スタート画面を非表示
  document.getElementById("quizScreen").style.display = "block"; // クイズ画面を表示

  // 問題をランダムにシャッフル
  shuffledQuestions = shuffle(questions);

  displayQuestion();
}

function displayQuestion() {
    var questionElement = document.getElementById("question");
    var choicesElement = document.getElementById("choices");
    var currentQuestionCountElement = document.getElementById("currentQuestionCount");
  
    questionElement.textContent = shuffledQuestions[currentQuestion].question;
    //choicesElement.innerHTML = ""; // 解答群をクリア
  
    var choices = shuffledQuestions[currentQuestion].choices;
    for (var i = 0; i < choices.length; i++) {
      var choice = document.createElement("li");
      choice.textContent = choices[i];
      choice.addEventListener("click", function () {
        checkAnswer(this.textContent); // 解答をクリックしたときに正誤判定を行う
      });
      choicesElement.appendChild(choice);
    }
  
    document.getElementById("answer").value = ""; // 解答欄をリセット
    currentQuestionCountElement.textContent = "現在の出題問題数: " + (currentQuestion + 1) + "/" + totalQuestionCount;
    retryButton.style.display = "none"; // 「もう一度解く」ボタンを非表示
  
    // 背景色の設定
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
    
  function checkAnswer(selectedAnswer) {
    var correctAnswer = shuffledQuestions[currentQuestion].correctAnswer;
  
    if (selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      score++;
      alert("正解！");
    } else {
      alert("違うぞっ！！");
    }
  
    nextQuestion();
  }
  
function displayResult(isCorrect) {
if (isCorrect) {
setTimeout(function() {
  nextQuestion();
}, 1000);
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

function displayCorrectAnswer() {
var correctAnswer = shuffledQuestions[currentQuestion - 1].correctAnswer;
alert("正解は: " + correctAnswer);
}


function nextQuestion() {
var correctAnswer = shuffledQuestions[currentQuestion].correctAnswer;
alert("正解: " + correctAnswer);

currentQuestion++;

if (currentQuestion >= maxQuestionCount) {
finishQuiz();
} else {
displayQuestion();
clearResult();
}
}


// function displayCorrectAnswer() {
//    var correctAnswer = shuffledQuestions[currentQuestion - 1].correctAnswer;
//    alert("正解は: " + correctAnswer);
// }

function isAnswerCorrect() {
var answer = document.getElementById("answer").value.trim();
var correctAnswer = shuffledQuestions[currentQuestion - 1].correctAnswer.trim();
return answer.toLowerCase() === correctAnswer.toLowerCase();
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

  // スキップされた問題と答えの一覧を表示
  var skippedQuestionsHtml = "<h2>スキップされた問題と答え</h2>";

  for (var i = maxQuestionCount; i < totalQuestionCount; i++) {
    var skippedQuestion = shuffledQuestions[i].question;
    var skippedAnswer = shuffledQuestions[i].correctAnswer;
    skippedQuestionsHtml += "<p><strong>問題: </strong>" + skippedQuestion + "</p>";
    skippedQuestionsHtml += "<p><strong>答え: </strong>" + skippedAnswer + "</p>";
  }

  skippedQuestionsElement.innerHTML = skippedQuestionsHtml;
  skippedQuestionsElement.style.display = "block";

  document.getElementById("quizScreen").style.display = "none"; // クイズ画面を非表示
  currentQuestion = 0; // 全問題を出題し終わったら最初の問題に戻る
  score = 0; // スコアをリセット
  shuffledQuestions = shuffle(questions); // 問題を再度ランダムにシャッフル
  skippedQuestionsElement.style.display = "none"; // スキップされた問題と答えを非表示
  document.getElementById("startScreen").style.display = "block"; // スタート画面を表示
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

  return array;
}
//ここまで
;