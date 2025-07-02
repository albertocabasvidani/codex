# Tribute Band Website

Questo repository contiene un esempio di sito web per una tribute band.

## Contenuto del sito

- **Bio**: una sezione dove inserire una breve biografia della band.
- **Prossimi concerti**: eventi caricati da un file `events.json`.
- **Concerti passati**: elenco delle date già eseguite.
- **Mappa**: posizione dei luoghi in cui la band ha suonato, visualizzati tramite Leaflet.

## Configurazione

1. Clona il repository in locale.
2. Avvia un semplice server HTTP dalla radice del progetto (ad esempio `python -m http.server`) e visita `http://localhost:8000` in un browser per visualizzare il sito.
   Gli eventi vengono letti dal file `events.json` presente nella radice del progetto.



La mappa utilizza il servizio di geocodifica di [Nominatim](https://nominatim.openstreetmap.org/); assicurati di avere una connessione Internet quando il sito effettua la ricerca delle località.
