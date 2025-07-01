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
3. Imposta le variabili d'ambiente `NOTION_API_KEY` e `NOTION_DATABASE_ID` con i valori del tuo account Notion. Puoi creare un file `.env` (vedi `.env.example`) per caricarle automaticamente in locale tramite [dotenv](https://github.com/motdotla/dotenv).
4. Avvia il server con `node server.js` e visita `http://localhost:3000` in un browser per visualizzare il sito.

Assicurati di usare **Node.js 18 o superiore**, necessario per l'API `fetch` integrata. Se riscontri errori di `fetch`, installa il pacchetto `node-fetch` oppure aggiorna la tua versione di Node.



La mappa utilizza il servizio di geocodifica di [Nominatim](https://nominatim.openstreetmap.org/); assicurati di avere una connessione Internet quando il sito effettua la ricerca delle località.
