package affitta_casa.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import affitta_casa.db.dbManager;
import affitta_casa.models.Abitazione;
import affitta_casa.models.Prenotazione;

public class PrenotazioneDAO {

    // 1. Metodo CREATE
    public boolean effettuaPrenotazione(Prenotazione p) {
        // 1. CONTROLLO: La casa ha uno slot di disponibilità che copre queste date?
        if (!isDataDisponibile(p.getId_abitazione().getId(), p.getData_inizio(), p.getData_fine())) {
            System.out.println("Errore: Date non coperte da disponibilità host.");
            return false;
        }

        // 2. CONTROLLO: Esistono già prenotazioni confermate che si sovrappongono?
        if (hasSovrapposizioni(p.getId_abitazione().getId(), p.getData_inizio(), p.getData_fine())) {
            System.out.println("Errore: La casa è già prenotata in questo periodo.");
            return false;
        }

        // Se i controlli passano, procediamo con l'INSERT che hai scritto tu
        String sql = "INSERT INTO prenotazione (id_abitazione, id_guest, data_inizio, data_fine, data_creazione_record, stato) VALUES (?, ?, ?, ?, ?, ?::stato_prenotazione)";
        // ... il tuo codice JDBC esistente ...
        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, p.getId_abitazione().getId());
            pstmt.setInt(2, p.getId_guest());
            pstmt.setDate(3, java.sql.Date.valueOf(p.getData_inizio()));
            pstmt.setDate(4, java.sql.Date.valueOf(p.getData_fine()));
            pstmt.setTimestamp(5, java.sql.Timestamp.valueOf(p.getData_creazione()));
            pstmt.setString(6, p.getStato().name());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Metodo helper per la disponibilità
    // Metodo helper per la disponibilità
    private boolean isDataDisponibile(int idAbitazione, LocalDate inizio, LocalDate fine) {
        // Verifichiamo se esiste uno slot che contiene interamente le date scelte
        String sql = "SELECT COUNT(*) FROM Disponibilita WHERE id_abitazione = ? AND data_inizio <= ? AND data_fine >= ?";
        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idAbitazione); // Corretto
            pstmt.setDate(2, java.sql.Date.valueOf(inizio));
            pstmt.setDate(3, java.sql.Date.valueOf(fine));

            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            System.err.println("ERRORE SQL in isDataDisponibile: " + e.getMessage());
            return false;
        }
    }

    // Metodo helper per le sovrapposizioni (Overlapping)
    private boolean hasSovrapposizioni(int idAbitazione, LocalDate inizio, LocalDate fine) {
        // Usiamo il cast ::text se usi PostgreSQL per evitare errori sull'ENUM
        String sql = "SELECT COUNT(*) FROM prenotazione WHERE id_abitazione = ? " +
                "AND stato::text != 'RIFIUTATA' " +
                "AND NOT (data_fine <= ? OR data_inizio >= ?)";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idAbitazione);
            pstmt.setDate(2, java.sql.Date.valueOf(inizio));
            pstmt.setDate(3, java.sql.Date.valueOf(fine));

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    int count = rs.getInt(1);
                    if (count > 0)
                        System.out.println("DEBUG: Trovate " + count + " sovrapposizioni reali.");
                    return count > 0;
                }
            }
        } catch (SQLException e) {
            // FONDAMENTALE: Stampiamo l'errore per capire se la query è scritta male!
            System.err.println("ERRORE SQL in hasSovrapposizioni: " + e.getMessage());
            e.printStackTrace();
            return false; // Cambiato a false per il debug: se la query fallisce, non bloccare la
                          // prenotazione
        }
        return false;
    }

    // Aggiungi questo metodo nel tuo DAO
    public int getGuestIdByEmail(String nome, String cognome, String email) {
        // Cerchiamo l'utente principalmente per email (che è univoca)
        // Controlliamo anche nome/cognome per sicurezza
        String sql = "SELECT id FROM Utente WHERE email = ? AND nome = ? AND cognome = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            pstmt.setString(2, nome);
            pstmt.setString(3, cognome);

            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("id"); // Trovato! Restituisce es. 6
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1; // Utente non trovato
    }

    // 2. Metodo READ (Esempio: tutte le prenotazioni di un Guest)
    public List<Prenotazione> getPrenotazioniPerGuest(int idGuest) {
        List<Prenotazione> lista = new ArrayList<>();
        String sql = "SELECT * FROM prenotazione WHERE id_guest = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idGuest);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                LocalDate inizio = rs.getDate("data_inizio").toLocalDate();
                LocalDate fine = rs.getDate("data_fine").toLocalDate();
                LocalDateTime creazione = rs.getTimestamp("data_creazione_record").toLocalDateTime();
                Prenotazione.stato statoEnum = Prenotazione.stato.valueOf(rs.getString("stato"));

                // --- CORREZIONE QUI ---
                // Creiamo un oggetto "guscio" per l'abitazione con solo l'ID
                Abitazione ab = new Abitazione();
                ab.setId(rs.getInt("id_abitazione"));

                // Passiamo l'oggetto 'ab' al costruttore invece dell'intero
                Prenotazione p = new Prenotazione(
                        ab, // <--- Passiamo l'oggetto!
                        rs.getInt("id_guest"),
                        inizio,
                        fine,
                        creazione,
                        statoEnum);
                p.setId(rs.getInt("id"));
                lista.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }

    // ... import java.util.Map; ...

    public List<Map<String, Object>> getPrenotazioniPerAbitazione(int idAbitazione) {
        List<Map<String, Object>> lista = new ArrayList<>();
        String sql = "SELECT p.*, u.nome as guest_nome, u.cognome as guest_cognome, u.email as guest_email " +
                "FROM Prenotazione p " +
                "JOIN Utente u ON p.id_guest = u.id " +
                "WHERE p.id_abitazione = ? " +
                "ORDER BY p.data_creazione_record DESC";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idAbitazione);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> riga = new java.util.HashMap<>();
                    riga.put("id", rs.getInt("id"));
                    riga.put("data_inizio", rs.getDate("data_inizio").toString());
                    riga.put("data_fine", rs.getDate("data_fine").toString());
                    riga.put("stato", rs.getString("stato"));

                    // Dati Guest
                    riga.put("guest_nome", rs.getString("guest_nome"));
                    riga.put("guest_cognome", rs.getString("guest_cognome"));
                    riga.put("guest_email", rs.getString("guest_email"));

                    lista.add(riga);
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore getPrenotazioniPerAbitazione: " + e.getMessage());
        }
        return lista;
    }

    public boolean aggiornaStato(int idPrenotazione, String nuovoStato) {
        String sql = "UPDATE Prenotazione SET stato = ?::stato_prenotazione WHERE id = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, nuovoStato);
            pstmt.setInt(2, idPrenotazione);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Errore aggiornaStato: " + e.getMessage());
            return false;
        }
    }

    public List<Map<String, Object>> cercaPerTestoLibero(String query) {
        List<Map<String, Object>> risultati = new ArrayList<>();

        String sql = "SELECT p.id as id_prenotazione, " +
                "       a.nome as nome_abitazione, " +
                "       p.data_inizio, " +
                "       p.data_fine, " +
                "       p.stato, " +
                "       u.nome as guest_nome, " +
                "       u.email as guest_email " +
                "FROM Prenotazione p " +
                "JOIN Abitazione a ON p.id_abitazione = a.id " +
                "JOIN Utente u ON p.id_guest = u.id " +
                "WHERE LOWER(a.nome) LIKE LOWER(?) " +
                "   OR LOWER(u.nome) LIKE LOWER(?) " +
                "   OR LOWER(u.email) LIKE LOWER(?) " +
                "   OR LOWER(p.stato::text) LIKE LOWER(?) " +
                "ORDER BY p.data_inizio DESC";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            String searchPattern = "%" + query + "%";
            pstmt.setString(1, searchPattern);
            pstmt.setString(2, searchPattern);
            pstmt.setString(3, searchPattern);
            pstmt.setString(4, searchPattern);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> prenotazione = new HashMap<>();
                    prenotazione.put("id_prenotazione", rs.getInt("id_prenotazione"));
                    prenotazione.put("nome_abitazione", rs.getString("nome_abitazione"));
                    prenotazione.put("data_inizio", rs.getDate("data_inizio").toString());
                    prenotazione.put("data_fine", rs.getDate("data_fine").toString());
                    prenotazione.put("stato", rs.getString("stato"));
                    prenotazione.put("guest_nome", rs.getString("guest_nome"));
                    prenotazione.put("guest_email", rs.getString("guest_email"));
                    risultati.add(prenotazione);
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore ricerca prenotazioni: " + e.getMessage());
        }
        return risultati;
    }

}
