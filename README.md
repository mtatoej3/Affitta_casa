# 🏠 Turista Facoltoso: Documentazione Integrale del Progetto

Benvenuti nella documentazione ufficiale di **Turista Facoltoso**, un ecosistema digitale avanzato progettato per la gestione operativa di affitti brevi. Questa documentazione analizza a fondo ogni strato tecnologico, dalla persistenza dei dati alla logica di business del backend, fino all'interfaccia utente moderna.

---

## 📖 1. Scenario e Visione di Business

Il progetto nasce per soddisfare le esigenze di un **Operatore di Backoffice**. A differenza delle classiche app consumer, qui il focus non è sull'utente finale (turista), ma sull'amministratore che deve orchestrare i dati provenienti da molteplici fonti.

### Il Concept
Immaginiamo una suite gestionale dove un operatore può:
1. Registrare nuovi utenti e qualificarli come Host o Guest.
2. Catalogare immobili con caratteristiche granulari.
3. Configurare calendari di disponibilità con prezzi dinamici.
4. Monitorare il flusso delle prenotazioni in tempo reale.
5. Analizzare dati statistici per premiare l'eccellenza (Super-host) e monitorare i trend di mercato.

---

## 🗄️ 2. Deep Dive: Il Database (PostgreSQL)

La persistenza è affidata a **PostgreSQL**, scelto per la sua robustezza e il supporto nativo a tipi complessi (ENUM) e integrità referenziale avanzata.

### Schema Relazionale e Logica dei Vincoli

#### A. Tabella `utente`
Non è solo un'anagrafica, ma il cardine dei ruoli.
- **`ruolo` (ruolo_utente)**: Un tipo custom ENUM che impedisce inserimenti di ruoli non previsti (es. 'GUEST', 'HOST').
- **`codice_host`**: Un vincolo `UNIQUE` garantisce che ogni Host sia identificabile univocamente senza collisioni.
- **`is_superhost`**: Un flag booleano che abilita logiche di visibilità privilegiata.

#### B. Tabella `abitazione`
Mappa le proprietà fisiche.
- **Relazione Strong**: Legata all'host tramite `codice_host`. 
- **Integrità**: La clausola `ON DELETE CASCADE` assicura che se un utente host viene rimosso, tutte le sue proprietà "spariscono" coerentemente senza lasciare record orfani.
- **Validazione**: Vincoli `CHECK (n_locali > 0)` e `CHECK (n_posti_letto > 0)` impediscono l'inserimento di dati fisicamente impossibili.

#### C. Tabella `disponibilita`
Gestisce la "finestra di vendita".
- **Logica Temporale**: `CHECK (data_fine >= data_inizio)`.
- **Prezzo**: Il campo `numeric(10,2)` con `CHECK (>= 0)` garantisce precisione monetaria e impedisce prezzi negativi.

#### D. Tabella `prenotazione`
Il cuore transazionale.
- **`stato` (stato_prenotazione)**: Enum con valori `in_attesa`, `confermata`, `rifiutata`. Permette un workflow decisionale per l'host.
- **Data Log**: `data_creazione_record` con `DEFAULT now()` traccia esattamente quando è avvenuta la richiesta, fondamentale per le statistiche mensili.

#### E. Tabella `feedback`
Feedback post-soggiorno.
- **Vincolo 1:1**: L'indice `UNIQUE` su `id_prenotazione` impedisce che un guest lasci più di una recensione per lo stesso soggiorno, garantendo la veridicità delle medie voto.

---

## ⚙️ 3. Architettura Backend: Il Motore Java

Il backend è stato costruito evitando i "magic framework" (come Spring Boot) per favorire la **comprensione totale del codice** e le **performance brute**.

### Tecnologie Core
- **Javalin**: Un micro-framework web per Java che privilegia la semplicità. Gestisce il routing in modo esplicito, rendendo immediato capire quale endpoint punta a quale logica.
- **JDBC Puro**: Ogni operazione sul DB è scritta in SQL crudo all'interno dei DAO.

### Analisi dei Pattern di Sviluppo

#### I. Pattern DAO (Data Access Object): Lo Stile di Implementazione
Il layer DAO è il fondamento della persistenza. In questo progetto, ogni classe DAO (es. `UtenteDAO`, `AbitazioneDAO`) è stata implementata seguendo i principi di **pulizia atomica** e **robustezza**:

- **Try-With-Resources**: Utilizziamo sistematicamente il costrutto Java *try-with-resources* per garantire la chiusura automatica delle connessioni (`Connection`), degli statement (`PreparedStatement`) e dei set di risultati (`ResultSet`). Questo previene costose perdite di memoria (*memory leaks*) e saturazione del pool di connessioni del database.
- **Parametrizzazione SQL**: Non concateniamo mai le stringhe per le query. L'uso esclusivo di `PreparedStatement` assicura che ogni input proveniente dal frontend venga trattato come dato e mai come comando, rendendo l'applicazione immune ad attacchi di **SQL Injection**.
- **Mapping Manuale**: Poiché non utilizziamo un ORM, il passaggio dai dati relazionali (tabelle) agli oggetti Java (Models) avviene riga per riga tramite il `ResultSet`. Questo approccio, seppur più verboso, garantisce una trasparenza totale su come ogni singola cella del database viene trasformata in un attributo dell'oggetto.
- **Gestione Atomica delle Eccezioni**: Ogni metodo DAO gestisce le proprie `SQLException` internamente o le rilancia in modo controllato, permettendo al sistema di non crashare mai e di fornire feedback loggati precisi (es. stampando l'errore specifico in console per l'operatore).
- **Logica Computazionale SQL**: Ove possibile, abbiamo delegato la logica complessa al motore del Database tramite query avanzate (JOIN multipli, aggregazioni `SUM/AVG`, clausole `EXISTS`), riducendo drasticamente il carico di elaborazione sulla CPU del server Java.

**Esempio di Eccellenza Tecnica nel DAO:**
Il metodo `effettuaPrenotazione` non si limita a un'inserimento, ma esegue una "validazione transazionale" verificando prima la disponibilità dell'host e poi l'assenza di sovrapposizioni temporali con altri guest.

#### II. Logica delle Statistiche (`StatsDAO`)
Le statistiche non sono semplici "conteggi", ma query aggregate pesanti:
- **Top Guest**: Calcolata sottraendo le date (`data_fine - data_inizio`) per ottenere i giorni totali di permanenza aggregati per utente.
- **Abitazione Top**: Utilizza `INTERVAL '1 month'` nativo di PostgreSQL per garantire precisione dinamica rispetto alla data odierna.

#### III. Controller Manager (The Orchestrator)
Il `ControllerManager` è il centro nevralgico del backend. Non si occupa di logica di business, ma di **orchestrazione e infrastruttura**:
- **Inizializzazione del Server**: Configura l'istanza di Javalin (es. impostando la porta 7000).
- **Abilitazione CORS**: Cruciale per il dialogo con il frontend React. Senza il metodo `config.bundledPlugins.enableCors`, le chiamate da `localhost:5173` (React) verso `localhost:7000` (Java) verrebbero bloccate per motivi di sicurezza dai browser moderni.
- **Registro delle Rotte (Routing)**: Centralizza la mappatura di ogni URL verso la funzione corrispondente. Questo permette a un nuovo sviluppatore di guardare un unico file e capire immediatamente l'intera superficie di attacco dell'API (es. quali dati possono essere cancellati, letti o modificati).

#### IV. La cartella API (Controllers specialized)
Mentre il `ControllerManager` definisce *dove* andare, le classi nella cartella `api` (come `AbitazioneAPI`, `UtenteAPI`, `StatsAPI`) definiscono *cosa* fare.
- **Isolamento**: Ogni classe si occupa di un'entità specifica, rendendo il codice pulito e modulare.
- **Gestione del Contesto**: Estraggono in modo sicuro i parametri dalla richiesta HTTP (Path Params, Query Params, JSON Body) e li trasformano in oggetti Java pronti per i DAO.
- **Ponte verso i DTO**: Qui avviene spesso il passaggio tra i dati grezzi del frontend e le logiche del database, agendo come un filtro di validazione intermedio.
- **Stato HTTP**: I controller sono responsabili di restituire il corretto codice di stato (es. `201 Created` per una nuova prenotazione, `404 Not Found` se una casa non esiste).

---

## 🎨 4. Frontend: L'Esperienza React TypeScript

L'interfaccia utente è una SPA (Single Page Application) che punta su rapidità e tipizzazione forte.

### Struttura Modulare
- **Pages**: Componenti macro (Registrazione, Ricerca, Dettaglio, Stats) che gestiscono lo stato della vista.
- **Services**: Classi TypeScript (es. `abitazioneService.ts`) che incapsulano `fetch()`. Gestiscono l'URL base e la trasformazione dei dati in ingresso/uscita.
- **Types**: Definizione di interfacce (es. `interface Abitazione`) che garantiscono che ogni componente sappia esattamente che dati sta ricevendo.

### 🚠 4.1 Layer dei Servizi (Frontend Services)
Il cuore logico della comunicazione nel frontend risiede nella cartella `src/services/`. Questo strato è stato progettato per agire come un **ponte asincrono** tra l'interfaccia utente (React) e il sistema di API (Java).

#### Filosofia di Design: Encapsulation & Mapping
Invece di eseguire chiamate `fetch` direttamente all'interno dei componenti React (pratica che renderebbe il codice difficilmente manutenibile e prono a bug), ogni risorsa del sistema ha il proprio servizio dedicato. Questo approccio garantisce che:
- **Codice Pulito**: I componenti si occupano solo della visualizzazione e dello stato locale.
- **Riutilizzabilità**: Una funzione come `abitazioneService.getAll()` può essere richiamata in più pagine senza duplicare la logica HTTP.
- **Centralizzazione dell'URL**: L'indirizzo del server (`http://localhost:7000/api`) è definito una sola volta all'inizio di ogni service.

#### Analisi dei Servizi Implementati

##### A. `abitazioneService.ts` (Gestione Proprietà)
È il servizio più complesso, gestisce l'intero ciclo di vita delle abitazioni.
- **Tipizzazione Forte**: Define l'interfaccia `Abitazione` che rispecchia esattamente il modello Java, garantendo che TypeScript segnali errori in fase di compilazione se si tenta di accedere a proprietà inesistenti.
- **Advanced Search**: Il metodo `cerca` implementa una logica di mapping dei parametri di ricerca, convertendo lo stato di React in *Query Parameters* per il backend. Gestisce parametri facoltativi (nome, indirizzo, posti letto) assicurando che vengano inviati solo se effettivamente popolati dall'utente.
- **Interazione con Axios**: Utilizza la libreria **Axios** per le chiamate standard, sfruttando le sue capacità di auto-parsing del JSON.

##### B. `statsService.ts` (Dashboard Analitica)
Specializzato nel recupero di dati aggregati per la pagina delle statistiche.
- **Diversificazione Tecnica**: A differenza di altri service, utilizza l'API nativa `fetch` del browser per dimostrare versatilità nello stack tecnologico.
- **Gestione dei Casi Nulli**: Implementa controlli specifici per i codici di errore (es. se l'API restituisce `404` per l'abitazione più gettonata del mese, il service restituisce `null` in modo pulito invece di lanciare un'eccezione, permettendo al componente React di mostrare un messaggio di "Nessun dato").
- **Promesse di Tipo Dinamico**: Utilizza `Promise<any>` o tipi specifici per gestire risposte eterogenee come medie numeriche o liste di oggetti complessi.

##### C. Altri Servizi Operativi
- **`prenotazioneService`**: Gestisce il workflow di booking, la ricerca testuale delle prenotazioni e l'aggiornamento degli stati (confermata/rifiutata).
- **`feedbackService`**: Si occupa della persistenza delle recensioni e del calcolo del rating medio visualizzato nella pagina dettaglio.
- **`utenteService`**: Supporta le operazioni CRUD complete per la gestione del backoffice degli utenti.

#### Pattern Operativi Ricorrenti
- **Async/Await**: Ogni metodo è `async`, permettendo una gestione non bloccante delle chiamate. Questo assicura che l'interfaccia resti fluida anche durante caricamenti pesanti.
- **Error Propagation**: Gli errori di rete o del server (500, 401) vengono "rilanciati" verso il componente tramite `throw new Error()`. Sarà poi il blocco `try-catch` all'interno dell'hook `useEffect` del componente a catturarli e mostrarli visivamente all'operatore tramite notifiche o alert.
- **Data Transformation**: Prima di restituire i dati al componente, i service effettuano spesso pulizie o conversioni (es. trasformazione delle stringhe data in formati leggibili).

#### Perché questo layer è fondamentale per un "Turista Facoltoso"?
In un progetto di questa scala, il layer dei service è ciò che permette la **scalabilità**. Se il backend dovesse passare da Javalin a un altro framework, o se l'URL dell'API cambiasse da locale a cloud, basterebbe modificare poche righe nei file in `src/services/` per aggiornare l'intera applicazione frontend, senza toccare un singolo componente della UI.

---

###  Unified Dark Theme Premium
Abbiamo adottato una filosofia di design "OLED-friendly" e professionale:
- **Colore Sfondo**: `#1a1a1a` (Grigio fumo molto scuro).
- **Contenitori (Card)**: `#2d2d2d` con bordi `#444`. Questo crea una gerarchia visiva "floating" molto moderna.
- **Tipografia**: Uso di font sans-serif puliti (Arial/Inter) con contrasto elevato (bianco puro o grigio chiaro `#bbb`).
- **Interattività**: Transizioni fluide e feedback visivi sui bottoni (hover effects).

---

## ⚖️ 5. Analisi Critica: Pro e Contro

### ✅ Perché questa soluzione funziona (PRO)
1. **Velocità di Esecuzione**: Il tempo di risposta del backend è misurabile in millisecondi. Senza Hibernate, non c'è overhead di generazione query.
2. **Predictability**: Sai esattamente cosa sta succedendo. Non ci sono "annotation magiche" che decidono il comportamento del sistema.
3. **Controllo SQL Avanzato**: Query come quelle per i "Top 5 Guest" con calcolo differenziale dei giorni sono impossibili o inefficienti in molti ORM; qui sono native e veloci.
4. **Sicurezza**: L'uso di `PreparedStatement` ovunque elimina il rischio di SQL Injection, parametrizzando ogni input dell'operatore.

### ❌ Limiti e Sfide (CONTRO)
1. **Verbosità del Codice**: Sviluppare un nuovo DAO richiede centinaia di righe di codice JDBC "ripetitivo" (mappatura manuale dei ResultSet).
2. **Manutenzione del DB**: Se aggiungi una colonna alla tabella, devi aggiornare il Model, il DAO (Insert, Update, Select) e il Frontend. In Spring/Hibernate molte di queste cose sono automatiche.
3. **Gestione del Pool**: Attualmente si basa su `dbManager`. In produzione su larga scala, servirebbe un driver di pooling come HikariCP per gestire centinaia di connessioni simultanee.

---

## � Logica di Business Peculiare: Esempi di Codice

### Il Filtro di Ricerca Intelligente
La ricerca non si limita a `indirizzo` o `nomi`. Esegue una verifica di disponibilità temporale:
```sql
SELECT a.* FROM abitazione a 
WHERE EXISTS (
   SELECT 1 FROM disponibilita d 
   WHERE d.id_abitazione = a.id 
   AND d.data_inizio <= ? AND d.data_fine >= ?
)
AND NOT EXISTS (
   SELECT 1 FROM prenotazione p 
   WHERE p.id_abitazione = a.id 
   AND p.data_inizio < ? AND p.data_fine > ? 
   AND p.stato = 'CONFERMATA'
)
```
*Spiegazione semplice*: "Mostrami la casa se l'Host ha detto che è libera in quel periodo, MA SOLO SE non c'è già un'altra persona che ha prenotato in quegli stessi giorni."

---

## 🛠️ Tech Stack Recap

| Tool | Versione/Tipo |
|-------|---------------|
| **Java** | 17 (LTS) |
| **Database** | PostgreSQL 15+ |
| **Node.js** | 18+ (per il Frontend) |
| **React** | 18+ |
| **Styling** | Vanilla CSS + Inline Responsive Styles |

---

## 📈 Tabella di Marcia: Evoluzione del Progetto
1. **Fase 1**: Architettura Database e creazione tipi custom.
2. **Fase 2**: Implementazione DAO con logica JDBC robusta.
3. **Fase 3**: Sviluppo API RESTful con Javalin e gestione eccezioni SQL.
4. **Fase 4**: Frontend React: Routing, Gestione Stato e Chiamate Asincrone.
5. **Fase 5**: Analisi dati e Statistiche (StatsDAO).
6. **Fase 6**: **Uniformazione Estetica Premium Dark** (Final Release).

---
© 2026 - **Turista Facoltoso Project** | Sviluppato con dedizione per la perfezione tecnica.

---

## 🏛️ 6. Analisi Architetturale Avanzata

In questa sezione approfondiamo aspetti tecnici specifici e scelte di design di alto livello che rendono l'applicazione scalabile e sicura.

### 🧩 Data Transfer Objects (DTO)
Per evitare di esporre l'intera struttura delle tabelle del database al frontend (ovvero il "Leakage" del dominio), abbiamo implementato un layer di **DTO**.
- **`RicercaAbitazioneDTO`**: Quando l'utente cerca una casa, non riceve solo l'oggetto `Abitazione`. Il DTO combina dinamicamente i dati della proprietà con quelli della **Disponibilità** (date e prezzo specifico). Questo permette di inviare al frontend un oggetto "piatto" e facile da visualizzare in tabella, nascondendo la complessità dei JOIN sottostanti.
- **Decoupling**: Se cambiamo il nome di una colonna nel DB, cambiamo la mappatura nel DAO, ma il DTO resta identico, garantendo che il Frontend non si rompa mai.

### 🛡️ Layer dei Servizi (Business Logic)
Oltre ai DAO (che gestiscono solo il DB) e ai Controller (che gestiscono solo HTTP), abbiamo introdotto una logica di **Service** (es. `UtenteService`).
- **Ruolo**: Qui risiede la "testa" dell'applicazione. Se un domani dovessimo implementare un calcolo complesso per le commissioni o inviare una mail automatica alla creazione di un utente, il posto giusto sarebbe il Service. 
- **Esempio**: La logica di test completo e validazione incrociata tra Host e Super-host viene orchestrata qui prima di invocare il salvataggio definitivo sul DAO.

### 🔄 Ciclo di Vita di una Prenotazione (State Machine)
Una prenotazione non è un dato statico, ma un processo. Il sistema ne gestisce gli stati tramite una macchina a stati finiti:
1. **`in_attesa`**: Il guest ha richiesto la casa. L'host vede la richiesta nella sua dashboard.
2. **`confermata`**: L'host accetta. Il sistema ora "blocca" quelle date per chiunque altro (Trigger della logica `NOT EXISTS` nella ricerca).
3. **`cancellata` / `rifiutata`**: La data torna disponibile istantaneamente per nuove ricerche.

---

## 🛰️ 7. API Endpoints: Mapping Completo

Per gli sviluppatori che volessero integrare sistemi esterni, ecco il mapping granulare delle API (Porta 7000):

| Metodo | Endpoint | Descrizione | Parametri Chiave |
|:---:|:---|:---|:---|
| `POST` | `/api/utenti` | Registra nuovo Guest/Host | Body JSON |
| `GET` | `/api/utenti/{id}` | Recupera profilo completo | ID in Path |
| `GET` | `/api/abitazioni/cerca` | Motore di ricerca core | `nome`, `indirizzo`, `dataInizio`, `dataFine` |
| `POST` | `/api/abitazioni` | L'Host carica una proprietà | Body JSON (Abitazione) |
| `POST` | `/api/prenotazioni` | Effettua nuova richiesta | `idGuest`, `idAbitazione`, `date` |
| `GET` | `/api/stats/top-mese` | Analitica casa più richiesta | - |
| `GET` | `/api/stats/super-hosts` | Lista Host d'eccellenza | - |

---

## 🚦 8. Robustezza: Gestione Errori e Logging

### Logging Operativo
L'applicazione utilizza un sistema di **logging lato server** per facilitare il debugging del backoffice:
- **DEBUG**: Ogni query SQL eseguita viene stampata in console con i relativi parametri per monitorare le performance.
- **ERROR**: Le `SQLException` vengono catturate e loggate con lo stack trace completo, mentre all'utente frontend viene inviato un messaggio pulito (es. "400 Bad Request: Date non disponibili").

### Validazione Dati
- **Backend**: Prima dell'aggiornamento, il sistema verifica la coerenza dei dati (es. non puoi cancellare un host se ha prenotazioni attive, grazie ai vincoli SQL).
- **Frontend**: I form React utilizzano validazioni preventive (es. `type="date"`, campi `required`) per minimizzare le chiamate API errate.

---

## 🗺️ 9. Navigazione Frontend (React Router)

Il frontend utilizza `react-router-dom` per gestire una navigazione fluida senza ricaricare la pagina:
- **Route Dinamiche**: `/abitazione/:id`. Utilizzando l'hook `useParams`, la pagina `Dettaglio.tsx` recupera l'ID dall'URL e interroga il backend per caricare istantaneamente foto e dati della casa specifica.
- **Fallback**: Una rotta `*` (Catch-all) reindirizza automaticamente alla Home in caso di URL errati, migliorando la resilienza dell'app.

---

## 🚀 10. Evoluzioni Future (Scalability)

Il progetto è predisposto per le seguenti estensioni:
1. **Authentication**: Integrazione di JWT (JSON Web Tokens) per proteggere le rotte Host.
2. **Image Hosting**: Supporto a bucket S3 per il caricamento delle foto delle abitazioni.
3. **Notifiche Push**: Sistema di alert via email per informare l'host di nuove prenotazioni.
4. **Pool di Connessioni**: Implementazione di HikariCP per gestire un carico di migliaia di operatori simultanei.

---
