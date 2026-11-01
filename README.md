# Mahlzeit

Mahlzeit ist ein persönliches Rezeptbuch als Single Page Application: Rezepte erfassen, nach Menüart, Ernährung, Saison und Dauer filtern und sortieren, Favoriten speichern, Portionen umrechnen.

CAS Front-End Engineering, Projekt 2. Team: Claudio und Marisa.

- Live-Version: TODO (Firebase-Hosting-URL)
- Repository: https://github.com/claudioForDev/mahlzeit

Hinweis: Für den Bild-Upload verwenden wir Firebase Storage.

## Module

1. **User** – Nutzung anonym oder mit Konto, Registrierung, Login/Logout, Profil
2. **Security** – Rollen (Normaler User, Anonymer User), Firestore Security Rules
3. **Rezept CRUD** – erfassen, einsehen, editieren, löschen
4. **Filterung und Suche** – Suche nach Titel, Filter nach Menüart, Ernährung, Dauer und Saison, Sortierung nach Datum, alles serverseitig als Firestore-Abfrage mit Seitenaufteilung
5. **Favorisieren** – Rezepte markieren (auch anonym), eigener Favoriten-Bereich

## Installation

```bash
git clone https://github.com/claudioForDev/mahlzeit.git
cd mahlzeit
nvm use
npm install
cp .env.example .env   # Firebase-Config eintragen
npm run dev
```

### Firebase Config

```bash
VITE_FIREBASE_API_KEY=AIzaSyBCeDe3FtjH9r_2n4-hmfXMhYztAQJwWT8
VITE_FIREBASE_AUTH_DOMAIN=fee-rezept-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fee-rezept-app
VITE_FIREBASE_STORAGE_BUCKET=fee-rezept-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=657210771975
VITE_FIREBASE_APP_ID=1:657210771975:web:610731ffc128b774b078a2
```

Voraussetzungen: Node 24 (siehe `.nvmrc`), Java (für den Firestore-Emulator) und die Firebase CLI (`npm install -g firebase-tools`).

### Lokale Entwicklung mit Emulatoren

Im Dev-Modus (`npm run dev`) verbindet sich die App automatisch mit den lokalen Firebase-Emulatoren statt mit dem echten Projekt (siehe `src/firebase.ts`). Die Emulatoren müssen deshalb **vor** dem Dev-Server laufen, sonst bleibt die App bei «Laden …» stehen.

In zwei Terminals starten:

```bash
# Terminal 1: Auth-, Firestore- und Storage-Emulator
npm run emulators

# Terminal 2: Vite Dev-Server
npm run dev
```

| Dienst      | Adresse               |
| ----------- | --------------------- |
| App         | http://localhost:5173 |
| Emulator UI | http://localhost:4000 |
| Auth        | localhost:9099        |
| Firestore   | localhost:8080        |
| Storage     | localhost:9199        |

In der **Emulator UI** sieht man die angelegten User, die Firestore-Dokumente und die hochgeladenen Bilder und kann sie bearbeiten oder löschen.

Die Testdaten bleiben erhalten: Beim Beenden mit `Ctrl` + `C` werden sie in den Ordner `emulator-data/` exportiert und beim nächsten Start wieder importiert. Der Ordner ist in `.gitignore`, die Daten sind also nur lokal vorhanden. Nach einem frischen Clone startet man mit leeren Emulatoren.

## Tests

`npm run test` (Unit-Tests für Domain-Logik).
...

## Deployment

Wir veröffentlichen die App mit **Firebase Hosting**, im selben Projekt wie Auth, Firestore und Storage.

```bash
npm run build
firebase deploy --only hosting,firestore:rules,firestore:indexes,storage
```
