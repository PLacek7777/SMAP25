Linki:
quiz-oaza.pages.dev - strona startowa (bez pytań)
quiz-oaza.pages.dev/q1.html - 1 stacja

Hasła: 
q1 - pass

Odpowiedzi na pytania znajdują sie w plikach media/questions-q#.json

Każda stajca to osobna podstrona z własnym plikiem html i json.Wszystkie strony kożystają z jednego pliku css i jednego js.

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

Skrypt hasher.py pozwala na generowanie haseł
np:
python3 hasher.py hasło
=> 599459fdeddadcde274799c39b71cbd6caf83495b81ec36d3be9d0a187221e4d