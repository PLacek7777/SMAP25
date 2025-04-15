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
    questions = data["questions"];
    tips = data["tips"];
    showQuestion();
  })
  .catch(error => {
    console.error("Błąd podczas ładowania pytań:", error);
    questionElement.textContent = "Nie udało się wczytać danych.";
  });
}

function showQuestion() {
  const q = questions[currentQuestion];
  if (q.tag == "trivia") {
    questionElement.innerHTML = q.text.replace(/\n/g, '<br>'); // Replace \n with <br>
    answerInput.style.display = 'none';
    checkButton.innerHTML = 'Dalej';
    feedback.textContent = '';
    feedback.style.color = '';
  }
  else if (q.tag == "question") {
    questionElement.innerHTML = `Pytanie: ${q.text.replace(/\n/g, '<br>')}`; // Replace \n with <br>
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

  if (correctAnswers.includes(userAnswer) || tag == "trivia") {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } 
    else {
      document.getElementById("question-box").innerHTML = `
        ✅ <strong>Dotarłeś do końca tej stacji</strong><br>
              ${tips[0].text}<br><br>
        🔍 <em>Wskazówka:</em><br>
        ${tips[0].tip}
      `;
    }
  } 
  else {
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