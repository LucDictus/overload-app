# 💪 Progressive Overload App

## Backend starten
 
```bash
cd server
npm install
npm run dev
```
 
Server draait op: http://localhost:3001
 
## API Endpoints
 
| Method | Route                            | Beschrijving              |
|--------|----------------------------------|---------------------------|
| GET    | /api/health                      | Server check              |
| GET    | /api/exercises                   | Alle oefeningen           |
| POST   | /api/exercises                   | Nieuwe oefening           |
| GET    | /api/exercises/:id/history       | Progressie per oefening   |
| GET    | /api/workouts                    | Laatste 20 workouts       |
| POST   | /api/workouts                    | Nieuwe workout starten    |
| GET    | /api/workouts/:id/sets           | Sets van een workout      |
| POST   | /api/workouts/:id/sets           | Set toevoegen             |
| DELETE | /api/workouts/:id/sets/:setId    | Set verwijderen           |


Wat we bouwen — Iteratie 1
Een lokale workout tracker waar jij als enige gebruiker je training bijhoudt en de app je vertelt wanneer je zwaarder moet gaan.
De kern in één zin: Log je sets → de app onthoudt alles → volgende keer zie je wat je vorige keer deed + een suggestie om te progressen.

De 3 schermen
1. Start Workout
Kies oefeningen uit de lijst
Log sets (gewicht + reps)
Zie direct je vorige sessie ter referentie
Zie de progressive overload suggestie per oefening

2. Geschiedenis
Lijst van alle afgelopen workouts
Per workout: welke oefeningen, welke sets

3. Progressie
Kies een oefening
Zie een grafiek van gewicht over tijd

Stappenplan
Stap 2 — React + Vite opzetten
Basisproject aanmaken, React Router installeren, mappenstructuur client bepalen.
Stap 3 — API laag in de frontend
Eén bestand met alle fetch calls naar de backend, zodat je dit nooit door je components verspreidt.
Stap 4 — Scherm: Start Workout
Oefeningen selecteren, sets loggen, workout opslaan. Dit is het belangrijkste scherm.
Stap 5 — Vorige sessie + overload suggestie
Bij elke oefening tijdens de workout: wat deed je vorige keer, en wat suggereert de app nu?
Stap 6 — Scherm: Geschiedenis
Lijst van workouts, uitklapbaar per workout om sets te zien.
Stap 7 — Scherm: Progressie
Grafiek per oefening met Recharts. Gewicht over tijd.
Stap 8 — Navigatie & basis styling
React Router tussen de 3 schermen, nette maar simpele UI.
