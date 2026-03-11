Linki:
quiz-oaza.pages.dev - strona startowa (bez pytań)
quiz-oaza.pages.dev/agHi98jg.html - 1 stacja
quiz-oaza.pages.dev/buH77687Jfeok9J.html - 2 stacja
quiz-oaza.pages.dev/cGeifhi657h.html - 3 stacja
quiz-oaza.pages.dev/diuhg8hujgHJ.html - 4 stacja

Hasła: 
q1 - alleluja
q2 - król
q3 - słuchaj
q4 - pustynia

Pełne odpowiedzi znajdują sie w plikach media/questions-q#.json

q1:
  "answers": ["mateusz"]
  "answers": ["duch święty"]
q2
  "answers": ["łukasz apostoł"]
  "answers": ["kapłańska"]
q3
  "answers": ["dawid"]
  "answers": ["prześladował chrześcijan"]
q4
  "answers": ["liturgia słowa"]
  "answers": ["hosanna"]

Każda stajca to osobna podstrona z własnym plikiem html i json. Kożystają z jednego pliku css i jednego js.

Każdy body ma id oznaczające na jakiej stacji jesteśmy: [menu, q1, q2, q3] odpowiadające plikowi json
np: stacja 3: q3 => questions-q3.json

Plik json składa się z dwóch częsci
  1. questions zawierające kolejne pytania/informacje do wyświetlenia oznaczone tagami
    a. passwd - hasło z poprzedniej stacji
    b. question - pytanie i odpowiedzi na nie
    c. trivia - informacje/ciekawostki do wyświetlenia
  2. tips zawiera informacje jak dostać się do kolejnej stacji oraz zadaie do wypełnienia w drodze

Plik help ma inną strukturę
Każdy wpis składający się z tytułu i treści to jeden punkt w menu pomocy dostępnego pod ptajnikiem (prawy dolny róg strony)