## Utilizzo

Impostare URI del server Mongo creando un file .env o via bash

```bash
MONGODB_URI="MY_URI_HERE"
```

## Avvio

```bash
yarn && yarn start
```

## Endpoint

L'applicazione espone i seguenti endpoint:

- `GET /`: pagina iniziale del gioco
- `POST /api/save`: endpoint per salvare il punteggio del gioco
- `GET /leaderboard`: pagina della classifica completa
- `GET /search/:nickname`: pagina del punteggio del giocatore e dei giocatori circostanti