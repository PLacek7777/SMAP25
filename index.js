let actualTaskNumber;
const siteId = document.body.getAttribute('data-site-id');
const modal = document.getElementById('helpModal');

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
  actualTaskNumber = Math.floor(Math.random() * 10); // losujemy 0–9
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
      
      const taskAdress = data[actualTaskNumber].TaskAdress;
      window.location.assign(taskAdress);
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