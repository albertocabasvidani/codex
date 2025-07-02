# Tribute Band Website

Questo repository contiene un esempio di sito web per una tribute band.

## Contenuto del sito

- **Bio**: una sezione dove inserire una breve biografia della band.
- **Prossimi concerti**: eventi caricati da un file `events.json`.
- **Concerti passati**: elenco delle date già eseguite.
- **Mappa**: posizione dei luoghi in cui la band ha suonato, visualizzati tramite Leaflet.

## Configurazione

1. Clona il repository in locale.
2. Avvia il server con `node server.js` e visita `http://localhost:3000` in un browser per visualizzare il sito.
   Gli eventi vengono letti dal file `events.json` presente nella radice del progetto.

Assicurati di usare **Node.js 18 o superiore**, necessario per l'API `fetch` integrata. Se riscontri errori di `fetch`, installa il pacchetto `node-fetch` oppure aggiorna la tua versione di Node.



La mappa utilizza il servizio di geocodifica di [Nominatim](https://nominatim.openstreetmap.org/); assicurati di avere una connessione Internet quando il sito effettua la ricerca delle località.
