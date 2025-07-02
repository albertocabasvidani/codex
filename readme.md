# Tribute Band Website

Questo repository contiene un esempio di sito web per una tribute band.

## Contenuto del sito

- **Bio**: una sezione dove inserire una breve biografia della band.
- **Prossimi concerti**: eventi caricati da un calendario su Notion tramite le API.
- **Concerti passati**: elenco delle date già eseguite.
- **Mappa**: posizione dei luoghi in cui la band ha suonato, visualizzati tramite Leaflet.

## Configurazione

1. Crea un database in Notion con i campi `Name`, `Data` (di tipo *date*) e `Location` (testo). Utilizza la vista *Calendar* per gestire gli eventi.
2. Uno script nel repository aggiorna periodicamente `public/notion.json` con i dati del database.
   Se vuoi eseguire l'aggiornamento in locale imposta le variabili `NOTION_API_KEY` e
   `NOTION_DATABASE_ID` in un file `.env`.

3. Apri `index.html` in un browser oppure utilizza un semplice server statico
   (ad esempio `python -m http.server`) per testare il sito in locale.



La mappa utilizza il servizio di geocodifica di [Nominatim](https://nominatim.openstreetmap.org/); assicurati di avere una connessione Internet quando il sito effettua la ricerca delle località.
