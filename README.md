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