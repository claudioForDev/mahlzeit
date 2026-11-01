import { Accordion } from '../../components/ui/Accordion/Accordion';
import { BackLink } from '../../components/ui/BackLink/BackLink';

const FAQ = [
  {
    question: 'Muss ich mich registrieren?',
    answer:
      'Nein. Du kannst alle Rezepte ohne Konto ansehen, Favoriten speichern und Notizen schreiben. Diese werden aber nur auf diesem Gerät gespeichert. Mit einem Konto bleiben sie dauerhaft erhalten und du kannst eigene Rezepte erstellen.',
  },
  {
    question: 'Wie speichere ich ein Rezept als Favorit?',
    answer:
      'Tippe auf der Rezeptseite auf das Herz-Symbol. Alle gespeicherten Rezepte findest du anschliessend unter «Favoriten» in der Navigation.',
  },
  {
    question: 'Wie erstelle ich ein eigenes Rezept?',
    answer:
      'Melde dich an und wähle in der Navigation «Erstellen». Ein Titel ist Pflicht, alle anderen Angaben wie Bild, Zutaten und Zubereitungsschritte sind freiwillig.',
  },
  {
    question: 'Kann ich die Zutaten für mehr Personen umrechnen?',
    answer:
      'Ja. Mit den Plus- und Minus-Knöpfen bei den Zutaten änderst du die Anzahl Portionen, die Mengen werden automatisch angepasst.',
  },
  {
    question: 'Wer sieht meine Notizen zu einem Rezept?',
    answer:
      'Nur du. Notizen sind privat und werden in deinem Konto gespeichert. Andere Nutzerinnen und Nutzer sehen sie nicht.',
  },
  {
    question: 'Ich habe mein Passwort vergessen. Was nun?',
    answer:
      'Gib im Anmeldeformular deine E-Mail-Adresse ein und klicke auf «Passwort vergessen?». Du erhältst dann eine E-Mail mit einem Link zum Zurücksetzen.',
  },
  {
    question: 'Wie ändere ich meinen Namen oder mein Profilbild?',
    answer:
      'Unter «Profil» > «Profil bearbeiten» kannst du Name, Profilbild und Passwort ändern.',
  },
  {
    question: 'Kann ich mein Konto löschen?',
    answer:
      'Ja, unter «Profil bearbeiten» im Bereich «Konto». Zur Bestätigung musst du dein Passwort eingeben. Deine Favoriten und Notizen werden dabei unwiderruflich gelöscht.',
  },
];

export function HelpPage() {
  return (
    <>
      <title>Hilfe & Support | mahlzeit</title>

      <BackLink fallback="/profil">Zurück</BackLink>

      <h1>Hilfe & Support</h1>

      {FAQ.map((item) => (
        <Accordion
          key={item.question}
          title={item.question}
          content={item.answer}
        />
      ))}
    </>
  );
}
