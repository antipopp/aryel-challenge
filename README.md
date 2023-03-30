## Utilizzo

Impostare URL del server Mongo in `./app.ts` 

```typescript
mongoose.connect(
  "mongodb://<tuo-server>"
);
```

## Avvio

```bash
yarn
```

```bash
yarn start
```

## Endpoint

L'applicazione espone i seguenti endpoint:

- `GET /`: pagina iniziale del gioco
- `POST /api/save`: endpoint per salvare il punteggio del gioco
- `GET /leaderboard`: pagina della classifica completa
- `GET /search/:nickname`: pagina del punteggio del giocatore e dei giocatori circostanti