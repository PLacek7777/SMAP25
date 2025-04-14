let currentQuestion = 0;
let questions = [];

const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const modal = document.getElementById('helpModal');
const siteId = document.body.getAttribute('data-site-id');
const checkButton = document.getElementById("checkAnswer");

if (siteId != "menu") {
  fetch(`media/questions-${siteId}.json`)
  .then(response => response.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(error => {
    console.error("Błąd podczas ładowania pytań:", error);
    questionElement.textContent = "Nie udało się wczytać pytań.";
  });
}

function showQuestion() {
  const q = questions[currentQuestion];
  if (q.tag == "trivia") {
    questionElement.textContent = `Czy wiedziałeś, że ${q.text}?`;
    answerInput.style.display = 'none';
    checkButton.innerHTML = 'Dalej';
    feedback.textContent = '';
    feedback.style.color = '';
  }
  else if (q.tag == "question") {
  questionElement.textContent = `Pytanie ${currentQuestion + 1}: ${q.text}`;
  answerInput.style.display = 'block';
  checkButton.innerHTML = 'Sprawdź odpowiedź';
  answerInput.value = '';
  feedback.textContent = '';
  feedback.style.color = '';
  }
}

function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswers = questions[currentQuestion].answers;
  const tag = questions[currentQuestion].tag;
  console.log("Odpowiedź użytkownika:", userAnswer);

  if (correctAnswers.includes(userAnswer) || tag == "trivia") {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      document.getElementById("question-box").innerHTML = `
        ✅ <strong>Świetnie!</strong><br>
        Odpowiedziałeś poprawnie na wszystkie pytania.<br><br>
        🔍 <em>Wskazówka:</em><br>
        Następny punkt znajdziesz przy czerwonej altance nad strumieniem.
      `;
      document.getElementById("next-question-button").style.display = "block";
    }
  } else {
    feedback.textContent = "❌ To nie to. Spróbuj ponownie.";
    feedback.style.color = "#e74c3c";
  }
}

function displayHelp() {
  fetch("media/help.json")
    .then(response => response.json())
    .then(data => {
      const helpList = document.getElementById("helpList");
      helpList.innerHTML = "";

      data.forEach(helpItem => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>${helpItem.title}</strong>: ${helpItem.content}`;
        listItem.style.margin = "10px";
        helpList.appendChild(listItem);
      });

      modal.style.display = "block";
    })
    .catch(error => {
      console.error("Error loading help content:", error);
      const helpList = document.getElementById("helpList");
      helpList.innerHTML = "<li>Failed to load help content.</li>";
    });
}

showQuestion();