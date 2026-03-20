
let actualTaskNumber;
const siteId = document.body.getAttribute('data-site-id');
const modal = document.getElementById('helpModal');
let DoneTasks = [];

// =======================
// MENU STARTOWE
// =======================
if (siteId === "menu") {
  displayHelp();
}

// =======================
// STRONA STACJI / ZADANIA
// =======================
if (siteId === "stage" || siteId === "task") {
  if(siteId === "task")
  {
    displayTask();
    resizeIframe();
  }
  actualTaskNumber = parseInt(localStorage.getItem("taskNumber"));
  if (!isNaN(actualTaskNumber)) {
    writeData();
  } else {
    console.error("Brak taskNumber w localStorage!");
  }
}


// =======================
// LOSOWANIE STACJI
// =======================
function continueToNext() {
  while(DoneTasks.includes(actualTaskNumber) || actualTaskNumber === undefined) {
    actualTaskNumber = Math.floor(Math.random() * 10); // losujemy 0–9
  }
  actualTaskNumber = 5;
  localStorage.setItem("taskNumber", actualTaskNumber);
  window.location.assign("Stage.html");
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
      hintDiv.innerHTML = "<h3 style='text-align:center'>Podpowiedź:</h3>" + data[actualTaskNumber].Hint;

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

async function displayTask()
{
    const resp = await fetch("media/SzyfrowaneNazwyStacji.json");
    const data = await resp.json();

    const iframe = document.querySelector("#taskIframe");
    iframe.src = data[actualTaskNumber].Task;
    
    iframe.onload = () => {
      const doc = iframe.contentWindow.document;
      doc.body.style.backgroundColor = 'transparent';
      doc.body.style.margin = '0';
      const warp = doc.getElementById('warp');
      if (warp) warp.style.margin = '20px 0';

      // Add event listener to submit button
      const submitBtn = doc.getElementById('submitBtn');
      if (submitBtn) {
        // Wybierz odpowiednią funkcję sprawdzającą na podstawie numeru zadania
        if (actualTaskNumber === 5) {
          // Stacja 6
          submitBtn.onclick = checkStation6;
        } else {
          // Domyślna funkcja dla innych zadań
          submitBtn.onclick = () => {
            alert('Funkcja sprawdzająca dla tego zadania nie jest jeszcze zaimplementowana.');
          };
        }
      }
      
      iframe.style.height = doc.documentElement.scrollHeight + "px";
    };
}

function resizeIframe() {
  const iframe = document.getElementById("taskIframe");

  iframe.onload = () => {
    const doc = iframe.contentWindow.document;
    doc.body.style.backgroundColor = 'transparent';
    doc.body.style.margin = '0';
    const warp = doc.getElementById('warp');
    if (warp) warp.style.margin = '20px 0';
    iframe.style.height = doc.documentElement.scrollHeight + "px";
  };
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
