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

Lokal mit Emulatoren: `firebase emulators:start`

Voraussetzungen: Node 24 (siehe `.nvmrc`) und Java (für den Firestore-Emulator).

## Tests

`npm run test` (Unit-Tests für Domain-Logik).
...

## Deployment

Wir veröffentlichen die App mit **Firebase Hosting**, im selben Projekt wie Auth, Firestore und Storage.

```bash
npm run build
firebase deploy --only hosting,firestore:rules,firestore:indexes,storage
```
