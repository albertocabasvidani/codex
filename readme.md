# Tribute Band Website

Questo repository contiene un esempio di sito web per una tribute band.

## Contenuto del sito

- **Bio**: una sezione dove inserire una breve biografia della band.
- **Prossimi concerti**: eventi caricati da un calendario su Notion tramite le API.
- **Concerti passati**: elenco delle date già eseguite.
- **Mappa**: posizione dei luoghi in cui la band ha suonato, visualizzati tramite Leaflet.

## Configurazione

1. Crea un database in Notion con i campi `Name`, `Data` (di tipo *date*) e `Location` (testo). Utilizza la vista *Calendar* per gestire gli eventi.
2. Ottieni un token di integrazione da Notion e condividi il database con l'integrazione.
3. Nel file `script.js` sono già impostati un esempio di token e di ID del database: sostituiscili se necessario con i tuoi valori.
4. Apri `index.html` in un browser per visualizzare il sito.

La mappa utilizza il servizio di geocodifica di [Nominatim](https://nominatim.openstreetmap.org/); assicurati di avere una connessione Internet quando il sito effettua la ricerca delle località.
