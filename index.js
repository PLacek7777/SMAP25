
let actualTaskNumber;
const siteId = document.body.getAttribute('data-site-id');
const modal = document.getElementById('helpModal');
let DoneTasks = [];

// =======================
// MENU STARTOWE
// =======================
if (siteId === "menu") {
  displayHelp();
  localStorage.setItem("DoneTasks", JSON.stringify([]));
}
else if(siteId === "endScreen") {
  DoneTasks = JSON.parse(localStorage.getItem("DoneTasks")) ?? [];
  document.getElementById("WykonaneZadania").innerHTML += DoneTasks.map(num => `Stacja ${num + 1}`).join(", ");
}

// =======================
// STRONA STACJI / ZADANIA
// =======================
if (siteId === "stage" || siteId === "task") {

  actualTaskNumber = parseInt(localStorage.getItem("taskNumber"));

  if (!isNaN(actualTaskNumber)) {

    if(siteId === "task") {
      displayTask();
      resizeIframe();
    }

    writeData();

  } else {
    console.error("Brak taskNumber w localStorage!");
  }
}


// =======================
// LOSOWANIE STACJI
// =======================
function continueToNext() {


  DoneTasks = JSON.parse(localStorage.getItem("DoneTasks")) ?? [];
 if (DoneTasks.length >= 10) {
  window.location.assign("endScreen31244121231.html");
  }
  else
  {
    while(DoneTasks.includes(actualTaskNumber) || actualTaskNumber === undefined) {
      actualTaskNumber = Math.floor(Math.random() * 10); // losujemy 0–9
    }
    localStorage.setItem("taskNumber", actualTaskNumber);
    DoneTasks.push(actualTaskNumber);
    localStorage.setItem("DoneTasks", JSON.stringify(DoneTasks));
    window.location.assign("Stage.html");
  }
}
// =======================
// WYŚWIETLANIE DANYCH STACJI
// =======================
async function writeData() {
  try {
    const response = await fetch("media/SzyfrowaneNazwyStacji.json");
    const data = await response.json();
    const station = data[actualTaskNumber];
    if (!station) return;

    document.title = station.Characters;
    const el = document.querySelector("#NazwaStacji");
    if (el) {
      el.innerHTML = station.Characters + (siteId === "stage" ? " - Szukaj Stacji" : siteId === "task" ? " - Rozwiąż Zadanie" : "");
    }
  } catch (err) {
    console.error("Błąd wczytywania JSON:", err);
  }
}

// =======================
// PODPOWIEDŹ
// =======================
function showHint() {
  fetch("media/SzyfrowaneNazwyStacji.json")
    .then(res => res.json())
    .then(data => {
      const hintDiv = document.getElementById("hint");
      const btn = document.getElementById("btnShowHint");
      if (!hintDiv || !btn) return;

      btn.innerHTML = "";

      hintDiv.innerHTML = `
        <h3 style="text-align:center">Podpowiedź:</h3>
        ${data[actualTaskNumber].Hint}
        <div style="
          height: 200px;
          width: 300px;
          background-image: url('${data[actualTaskNumber].Img}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          margin-left:auto;
          margin-right:auto;
        "></div>
      `;

      const passDiv = document.getElementById("showPassDiv");
      const loginBtn = document.getElementById("loginbtn");
      if (passDiv) passDiv.style.display = "block";
      if (loginBtn) loginBtn.style.display = "block";
    });
}

// =======================
// SPRAWDZENIE HASŁA
// =======================
function enterPassword() {
  const password = document.getElementById("passwordInpt")?.value;
  if (!password) return;

  fetch("media/SzyfrowaneNazwyStacji.json")
    .then(res => res.json())
    .then(data => {
      if (password === data[actualTaskNumber].Password) {
        ShowTask();
      } else {
        if (!document.getElementById("badpassword")) {
          const wrap = document.getElementById("wrap");
          wrap.innerHTML += "<p id='badpassword' style='color:red;font-weight:bold;text-align:center'>❌ Złe Hasło</p>";
        }
      }
    });
}

// =======================
// PRZEJŚCIE DO ZADANIA
// =======================
function ShowTask() {
  fetch("media/SzyfrowaneNazwyStacji.json")
    .then(res => res.json())
    .then(data => {
      const hintDiv = document.getElementById("hint");
      const passDiv = document.getElementById("showPassDiv");
      const loginBtn = document.getElementById("loginbtn");
      if (hintDiv) hintDiv.innerHTML = "";
      if (passDiv) passDiv.style.display = "none";
      if (loginBtn) loginBtn.style.display = "none";

      window.location.assign("Task.html");
    });
}

// =======================
// POMOC (WSPÓLNA DLA WSZYSTKICH STRON)
// =======================
function displayHelp() {
  fetch("media/help.json")
    .then(res => res.json())
    .then(data => {
      const helpList = document.getElementById("helpList");
      if (!helpList) return;

      helpList.innerHTML = "";
      data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.title}</strong>: ${item.content}`;
        li.style.margin = "10px";
        helpList.appendChild(li);
      });
      if (modal) modal.style.display = "block";
    });
}

function adjustIframeHeight(iframe, attempt = 0) {
  if (!iframe || !iframe.contentWindow || !iframe.contentWindow.document) return;

  try {
    const doc = iframe.contentWindow.document;
    const body = doc.body;
    const html = doc.documentElement;

    const bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight);
    const htmlHeight = Math.max(html.scrollHeight, html.offsetHeight, html.clientHeight);
    const newHeight = Math.max(bodyHeight, htmlHeight);

    if (newHeight > 0) {
      iframe.style.height = newHeight + "px";
    } else {
      iframe.style.height = "auto";
    }

    if (attempt < 12) {
      // sprawdź ponownie po krótkim czasie, bo niektóre elementy mogą się dopiero pojawić (grafiki, czcionki)
      setTimeout(() => adjustIframeHeight(iframe, attempt + 1), 150);
    }
  } catch (e) {
    console.warn('Cannot adjust iframe height yet:', e);
  }
}

async function displayTask() {
  const resp = await fetch("media/SzyfrowaneNazwyStacji.json");
  const data = await resp.json();

  const iframe = document.querySelector("#taskIframe");
  iframe.src = data[actualTaskNumber].Task;
}

function resizeIframe() {
  const iframe = document.getElementById("taskIframe");
  if (!iframe) return;

  const onIframeLoad = () => {
    try {
      const doc = iframe.contentWindow.document;
      doc.body.style.backgroundColor = 'transparent';
      doc.body.style.margin = '0';
      doc.body.style.height = 'auto';
      doc.documentElement.style.height = 'auto';
      const warp = doc.getElementById('warp');
      if (warp) warp.style.margin = '20px 0';

      setupTaskSubmitButton(doc);
      adjustIframeHeight(iframe);

      const observer = new MutationObserver(() => adjustIframeHeight(iframe));
      observer.observe(doc.documentElement || doc.body, { childList: true, subtree: true, attributes: true });
    } catch (error) {
      console.warn('Iframe load handler error:', error);
    }
  };

  iframe.addEventListener('load', onIframeLoad);

  window.addEventListener('resize', () => {
    adjustIframeHeight(iframe);
  });
}

function setupTaskSubmitButton(doc) {
  const submitBtn = doc.getElementById('submitBtn');
  if (!submitBtn) return;
  
  if(actualTaskNumber === 0) {
    submitBtn.onclick = checkStation1;
  }
  else if (actualTaskNumber === 1) {
    submitBtn.onclick = checkStation2;
    
  }
  else if (actualTaskNumber === 2) {
    submitBtn.onclick = checkStation3;
  }
  else if (actualTaskNumber === 3) {
    submitBtn.onclick = checkStation4;
  }
  else if (actualTaskNumber === 4) {
    submitBtn.onclick = checkStation5;
  }
  else if (actualTaskNumber === 5) {
    submitBtn.onclick = checkStation6;
  }
  else if (actualTaskNumber === 6) {
    submitBtn.onclick = checkStation7;
  } else if (actualTaskNumber === 7) {
    submitBtn.onclick = checkStation8;
  } 
  else if (actualTaskNumber === 8) {
    submitBtn.onclick = checkStation9;
  }
  else if (actualTaskNumber === 9) {
    submitBtn.onclick = checkStation10;
  }
  else {
    submitBtn.onclick = () => {
      alert('Funkcja sprawdzająca dla tego zadania nie jest jeszcze zaimplementowana.');
    };
  }
}

function checkStation9() {
  const iframe = document.getElementById("taskIframe");
  if (!iframe || !iframe.contentWindow) return;

  const doc = iframe.contentWindow.document;
  const foundCount = Number(doc.getElementById('foundCount')?.innerText || 0);
  const totalWords = Number(doc.getElementById('totalWords')?.innerText || 0);

  if (foundCount === totalWords && totalWords > 0) {
    alert('Brawo! Wykreślanka rozwiązana poprawnie. Możesz przejść dalej.');
    DoneTasks.push(actualTaskNumber);
    continueToNext();
  } else {
    alert(`Wykreślono ${foundCount}/${totalWords} słów. Kontynuuj szukanie i spróbuj ponownie.`);
  }
}

// ===========================
// FUNKCJE SPRAWDZAJĄCE ZADANIA
// ===========================

// Stacja 6 - Quiz
function checkStation6() {
  const iframe = document.getElementById("taskIframe");
  if (!iframe || !iframe.contentWindow) return;

  const doc = iframe.contentWindow.document;
  const q1 = doc.querySelector('input[name="question1"]:checked')?.value;
  const q2 = doc.querySelector('input[name="question2"]:checked')?.value;

  if (q1 === 'b' && q2 === 'c') {
    alert('Poprawna odpowiedź! Możesz przejść dalej.');
    DoneTasks.push(actualTaskNumber);
    continueToNext();
  } else {
    alert('Zła odpowiedź. Spróbuj ponownie.');
  }
}

// Stacja 7 - Quiz
function checkStation7() {
  const iframe = document.getElementById("taskIframe");
  if (!iframe || !iframe.contentWindow) return;

  const doc = iframe.contentWindow.document;
  const q1 = doc.querySelector('input[name="question1"]:checked')?.value;
  const q2 = doc.querySelector('input[name="question2"]:checked')?.value;

  if (q1 === 'b' && q2 === 'a') {
    alert('Poprawna odpowiedź! Możesz przejść dalej.');
    DoneTasks.push(actualTaskNumber);
    continueToNext();
  } else {
    alert('Zła odpowiedź. Spróbuj ponownie.');
  }
}

function checkStation8()
{
  const iframe = document.getElementById("taskIframe");
  if (!iframe || !iframe.contentWindow) return;

  const doc = iframe.contentWindow.document;
  const answerInput = doc.getElementById('hasloInput');
  if (!answerInput) return;
  if(answerInput.value.trim().toLowerCase() === 'ja was powoluje') {
    alert('Poprawna odpowiedź! Możesz przejść dalej.');
    DoneTasks.push(actualTaskNumber);
    continueToNext();
  } else {
    alert('Zła odpowiedź. Spróbuj ponownie.');
  }
}

function checkStation1()
{

const iframe = document.getElementById("taskIframe");
if (!iframe || !iframe.contentWindow) return;
const doc = iframe.contentWindow.document;
const q1 = doc.querySelector('input[name="question1"]:checked')?.value;
const q2 = doc.querySelector('input[name="question2"]:checked')?.value;
const q3 = doc.querySelector('input[name="question3"]:checked')?.value;
const q4 = doc.querySelector('input[name="question4"]:checked')?.value;
const q5 = doc.querySelector('input[name="question5"]:checked')?.value;
const q6 = doc.querySelector('input[name="question6"]:checked')?.value;

if(q1 === 'b' && q2 === 'a' && q3 === 'a' && q4 === 'a' && q5 === 'b' && q6 === 'a') {
  alert('Poprawna odpowiedź! Możesz przejść dalej.');
  DoneTasks.push(actualTaskNumber);
  continueToNext();
}
else {
  alert('Zła odpowiedź. Spróbuj ponownie.');
}
}
function checkStation3()
{
  const iframe = document.getElementById("taskIframe");
  if (!iframe || !iframe.contentWindow) return;
  const doc = iframe.contentWindow.document;
  const answerInput = doc.getElementById('hasloInput');
  if (!answerInput) return;
  if(answerInput.value.trim().toUpperCase() == "ANANIASZ") {
    alert('Poprawna odpowiedź! Możesz przejść dalej.');
    DoneTasks.push(actualTaskNumber);
    continueToNext();
  } else {
    alert('Zła odpowiedź. Spróbuj ponownie.');
  }
}
function checkStation2() {
    const iframe = document.getElementById("taskIframe");
    if (!iframe || !iframe.contentWindow) return;

    const doc = iframe.contentWindow.document;
    let correct = true;

    const slots = doc.querySelectorAll(".puzzle-slot");

    for (let i = 0; i < 20; i++) {
        const slot = slots[i];
        const slotImg = slot.querySelector("img");

        // Sprawdzamy, czy slot zawiera obrazek i czy ma poprawny src
        const expectedSrc = `media/Puzzle ${i + 1}.jpg`;
        if (!slotImg || slotImg.getAttribute('src') !== expectedSrc) {
            correct = false;
            break; // Jeśli jeden puzzel jest niepoprawny, nie trzeba sprawdzać dalej
        }
    }

    if (correct) {
        alert('Poprawna odpowiedź! Możesz przejść dalej.');
        DoneTasks.push(actualTaskNumber);
        continueToNext();
    } else {
        alert('Zła odpowiedź. Spróbuj ponownie.');
    }
}
function checkStation5(isDone)
{
   
if(isDone) {
     alert('Poprawna odpowiedź! Możesz przejść dalej.');
        DoneTasks.push(actualTaskNumber);
        continueToNext();
  } 
}
function checkStation4()
{
  
  const iframe = document.getElementById("taskIframe");
  if (!iframe || !iframe.contentWindow) alert("blad");
  const doc = iframe.contentWindow.document;
  const answerInput = doc.getElementById('hasloInput');
  if (!answerInput) return;
  if(answerInput.value.trim().toLowerCase() == 'narodzić się na nowo') {
    alert('Poprawna odpowiedź! Możesz przejść dalej.');
    DoneTasks.push(actualTaskNumber);
    continueToNext();
  } else {
    alert('Zła odpowiedź. Spróbuj ponownie.');
  }
}
function checkStation10()
{  
    DoneTasks.push(actualTaskNumber);
    continueToNext();

  
}