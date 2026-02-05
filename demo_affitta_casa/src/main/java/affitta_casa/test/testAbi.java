// package affitta_casa.test;

// import affitta_casa.dao.UtenteDAO;
// import affitta_casa.models.Utente;

// import affitta_casa.dao.*;
// import affitta_casa.models.*;
// import java.util.*;;


// public class testAbi {

//     public void testAbitazione() {
//     // 1. Inizializziamo i DAO
//     UtenteDAO uDao = new UtenteDAO();
//     AbitazioneDAO aDao = new AbitazioneDAO();

//     System.out.println("--- INIZIO TEST ABITAZIONE ---");

//     // 2. RECUPERO O CREAZIONE HOST
//     // Assicurati che esista un utente con un codice_host nel DB
//     // Se non ne hai uno, crealo ora per il test
//     Utente hostTest = new Utente(
//         "giuseppe", "tesse", "gius@test.it", "Via Roma 1", 
//         Utente.ruolo.HOST, "HOST-MAT-02", true
//     );
    
//     // Proviamo a inserirlo (se esiste già darà errore per l'email UNIQUE, ma andiamo avanti)
//     uDao.inserisciUtente(hostTest);

//     // 3. TEST CREATE
//     Abitazione nuovaCasa = new Abitazione(
//         hostTest, 
//         "Villa Bellamare", 
//         "Via panoramica 50", 
//         4, // locali
//         6, // posti letto
//         1  // piano
//     );
//     aDao.creaAbitazione(nuovaCasa);

// //     // 4. TEST READ (Ricerca Dinamica)
// //     System.out.println("\nRicerca abitazioni con almeno 4 posti letto:");
// //     //List<Abitazione> risultati = aDao.cercaAbitazioni(null, null, null, 4);
// //     //risultati.forEach(casa -> {
// //         System.out.println("- " + casa.getNome() + " (Host: " + casa.getId_host().getNome() + ")");
// //     });

// //     // 5. TEST UPDATE (Ristrutturazione)
// //     // ATTENZIONE: Qui servirebbe l'ID generato dal DB. 
// //     // Per il test, proviamo a cercarla per nome per prenderne l'ID o usiamo un ID che conosciamo (es. 1)
// //     System.out.println("\nAggiornamento abitazione...");
// //     aDao.aggiornaDatiAbitazione(1, "Villa Bellavista Ristrutturata", 5, 8);

// //     // 6. TEST DELETE
// //      System.out.println("\nCancellazione abitazione...");
// //     aDao.cancellaAbitazione(2);

// //     System.out.println("--- FINE TEST ABITAZIONE ---");
// // }
// }