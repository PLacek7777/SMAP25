let currentQuestion = 0;
let questions = [];
let tips = [];

const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const modal = document.getElementById('helpModal');
const siteId = document.body.getAttribute('data-site-id');
const checkButton = document.getElementById("checkAnswer");
const map = document.getElementById("map");
const divmap = document.getElementById("divmap");

//Czy nie znajdujemy się na stacji menu
if (siteId != "menu") {
  
  //Wczytanie pliku json
  fetch(`media/questions-${siteId}.json`)
  .then(response => response.json())
  .then(data => {
    questions = data["questions"]; //Pytań
    tips = data["tips"]; //Zakończenia
    if(document.cookie.split(` ${siteId}=`).pop().split(";").shift() == 1){
      end();
    }
    showQuestion(); //Pokazuje pierwsze pytanie danej stacji
  })
  //Error wczytywania
  .catch(error => {
    console.error("Błąd podczas ładowania pytań:", error);
    questionElement.textContent = "Nie udało się wczytać danych.";
  });
}

//Jeśli znajduemy się na staji menu wyświetla help
else if (siteId == "menu") {
  displayHelp();
}


function end() {
  document.getElementById("question-box").innerHTML = `
        ✅ <strong>Dotarłeś do końca tej stacji, wyzwanie:</strong><br>
              ${tips[0].text}<br><br>
        🔍 <em>Wskazówka:</em><br>
        ${tips[0].tip}
      `;
      document.cookie = `${siteId}=1`;
      window.addEventListener("beforeunload", event => {
        const message = "Czy na pewno chcesz opuścić stronę?";
        alert(message);
        event.returnValue = message;
        return message;
      })
      try{
        map.style.display = 'block';
        divmap.style.display = 'block';
      }
      finally{}
}


function showQuestion() {
  const q = questions[currentQuestion];
  try{ //Sprawdzanie tagu pytania
    switch(q.tag){
      case "trivia":
        questionElement.innerHTML = q.text.replace(/\n/g, '<br>'); // Zamienia \n na <br>
        answerInput.style.display = 'none';
        checkButton.innerHTML = 'Dalej';
        checkButton.onclick = checkAnswer;
        feedback.textContent = '';
        feedback.style.color = '';
        break;
      case "question": 
        questionElement.innerHTML = `Pytanie: ${q.text.replace(/\n/g, '<br>')}`; // Zamienia \n na <br>
        answerInput.style.display = 'block';
        checkButton.innerHTML = 'Sprawdź odpowiedź';
        checkButton.onclick = checkAnswer;
        answerInput.value = '';
        feedback.textContent = '';
        feedback.style.color = '';
        break;
      case "passwd": 
      questionElement.innerHTML = `${q.text.replace(/\n/g, '<br>')}`; // Zamienia \n na <br>
      answerInput.placeholder = "Wpisz hasło...";
      answerInput.style.display = 'block';
      checkButton.innerHTML = 'Sprawdź hasło';
      checkButton.onclick = checkPassword;
      answerInput.value = '';
      feedback.textContent = '';
      feedback.style.color = '';
      break;
    }
  }

  finally{
    console.log("error");
  }
}

//Zabezpieczenie hasła
async function hash(tekst) {
  const encoder = new TextEncoder();
  const data = encoder.encode(tekst);
  const hash = await crypto.subtle.digest("SHA-256", data);

  // Zamiana ArrayBuffer → hex string
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}


function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase(); //przycina i obniża udzieloną odpowiedź
  const correctAnswers = questions[currentQuestion].answers; //pobiera poprawne odpowiedzi
  const tag = questions[currentQuestion].tag;
  
  //sprawdzenie poprawdności odpowiedzi
  if (correctAnswers.includes(userAnswer) || tag == "trivia") {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion(); //pokazanie kolejnego pytania
    } 
    else {
      document.cookie = `${siteId}=1`;
      end(); //jeśli nie ma już pytań pokaż zakończenie
    }
  } 
  //błędna odpowiedź
  else {
    feedback.textContent = "❌ To nie to. Spróbuj ponownie.";
    feedback.style.color = "#e74c3c";
  }
}

//sprawdzenie hasła 
function checkPassword() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswers = questions[currentQuestion].answers;
  const tag = questions[currentQuestion].tag;
  hash(userAnswer).then(hash => {
    if(correctAnswers.includes(hash)){
      currentQuestion++;
      showQuestion();
    }
    //niepoprawne hasło
    else {
      feedback.textContent = "❌ To nie to. Spróbuj ponownie.";
      feedback.style.color = "#e74c3c";
    }
  });
}

//pokazuję menu help (to samo co na początku)
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

//---------------------------Dla index.html

//Wskazówka do pierwszej stacji
function continueToNext() {
  const text = document.getElementById("text");
  text.innerHTML = `Oto wskazówka do pierwszej stacji: Na dole schodów. Hasło: Alleluja`;
  map.style.display = 'block';
  divmap.style.display = 'block'; 
}