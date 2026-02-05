// package affitta_casa.test;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.List;

// import affitta_casa.dao.AbitazioneDAO;
// import affitta_casa.dao.DisponibilitaDAO;
// import affitta_casa.dao.PrenotazioneDAO;
// import affitta_casa.dao.UtenteDAO;
// import affitta_casa.models.Abitazione;
// import affitta_casa.models.Disponibilita;
// import affitta_casa.models.Prenotazione;
// import affitta_casa.models.Utente;

// public class testPreno {
//     public void a() {
//         // 1. Inizializzazione DAO
//         UtenteDAO uDao = new UtenteDAO();
//         AbitazioneDAO aDao = new AbitazioneDAO();
//         DisponibilitaDAO dDao = new DisponibilitaDAO();
//         PrenotazioneDAO pDao = new PrenotazioneDAO(); // <--- Nuovo

//         System.out.println("--- INIZIO TEST COMPLETO ---");

//         try {
//             // 2. CREAZIONE HOST E CASA (Come avevi già fatto)
//             Utente host = new Utente("Mario", "Rossi", "mari@host.it", "Via Roma 1", Utente.ruolo.HOST, "HOST_MARIO_01", true);
//             uDao.inserisciUtente(host); 
            
//              Abitazione casa = new Abitazione(host, "Appartamento montagna", "Via delle rocce 10", 3, 4, 1);
//             aDao.creaAbitazione(casa); 

//             // // 3. INSERIMENTO DISPONIBILITÀ
//              Disponibilita disp = new Disponibilita(casa, LocalDate.of(2025, 8, 1), LocalDate.of(2025, 8, 31), 85.50);
//              dDao.inserisciDisponibilita(disp);

//             // --- NUOVA PARTE: TEST PRENOTAZIONE ---
//             System.out.println("\n--- Simulazione Prenotazione ---");

//             // 4. CREAZIONE GUEST (L'utente che vuole affittare)
//             Utente guest = new Utente("Luigi", "Verdi", "luigi@guest.it", "Via Milano 5", Utente.ruolo.GUEST, "GUEST_LUIGI_99", true);
//             uDao.inserisciUtente(guest);

//             // 5. EFFETTUA PRENOTAZIONE
//             // Supponiamo che Luigi prenoti dal 12 al 19 Agosto
//             Prenotazione nuovaP = new Prenotazione(
//                 casa.getId(),               // ID Abitazione creata sopra
//                 guest.getId(),              // ID Guest creato sopra
//                 LocalDate.of(2025, 8, 12),  // Inizio
//                 LocalDate.of(2025, 8, 19),  // Fine
//                 LocalDateTime.now(),        // Data creazione (Timestamp)
//                 Prenotazione.stato.in_attesa // Stato iniziale
//             );

//             boolean successo = pDao.effettuaPrenotazione(nuovaP);

//             if (successo) {
//                 System.out.println("SUCCESSO: Prenotazione inserita nel database!");
//             } else {
//                 System.out.println("FALLIMENTO: Errore nell'inserimento della prenotazione.");
//             }

//             // 6. TEST LETTURA (READ)
//             System.out.println("\n--- Verifica Prenotazioni per Luigi ---");
//             List<Prenotazione> prenotazioniLuigi = pDao.getPrenotazioniPerGuest(guest.getId());

//             for (Prenotazione p : prenotazioniLuigi) {
//                 System.out.println("Prenotazione ID: " + p.getId() +
//                                    " | Casa ID: " + p.getId_abitazione() +
//                                    " | Dal: " + p.getData_inizio() +
//                                    " | Al: " + p.getData_fine() +
//                                    " | Stato: " + p.getStato() +
//                                    " | Effettuata il: " + p.getData_creazione());
//             }

//         } catch (Exception e) {
//             System.err.println("Errore durante il test: " + e.getMessage());
//             e.printStackTrace();
//         }

//         System.out.println("\n--- FINE TEST COMPLETO ---");  
//     }
// }
