package affitta_casa.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.sql.Connection;

import affitta_casa.db.dbManager;
import affitta_casa.models.Abitazione;
import affitta_casa.models.Prenotazione;

public class StatsDAO {

    // - Ottenere le abitazioni corrispondenti ad un certo codice host

    public List<Abitazione> getAbitazioniByHost(String codiceHost) {
        List<Abitazione> lista = new ArrayList<>();
        String query = "SELECT * FROM abitazione WHERE id_host = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setString(1, codiceHost);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Abitazione ab = new Abitazione();
                    ab.setId(rs.getInt("id"));
                    ab.setNome(rs.getString("nome"));
                    ab.setIndirizzo(rs.getString("indirizzo"));
                    ab.setN_posti_letto(rs.getInt("n_posti_letto"));
                    // ... setta gli altri campi necessari
                    lista.add(ab);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }

    // - Ottenere l'ultima prenotazione dato un id utente
    public Prenotazione getUltimaPrenotazione(int idUtente) {
        // Usiamo id_guest come visto nel tuo DB
        String query = "SELECT * FROM prenotazione WHERE id_guest = ? ORDER BY data_inizio DESC LIMIT 1";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, idUtente);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    // 1. Creiamo l'oggetto abitazione "guscio"
                    Abitazione ab = new Abitazione();
                    ab.setId(rs.getInt("id_abitazione"));

                    // 2. Recupero date (controlla che data_inizio e data_fine non siano null nel
                    // DB)
                    LocalDate inizio = rs.getDate("data_inizio").toLocalDate();
                    LocalDate fine = rs.getDate("data_fine").toLocalDate();

                    // 3. Recupero Timestamp (NOME COLONNA DA PGADMIN: data_creazione_record)
                    LocalDateTime creazione = rs.getTimestamp("data_creazione_record").toLocalDateTime();

                    // 4. Conversione Enum
                    Prenotazione.stato statoEnum = Prenotazione.stato.valueOf(rs.getString("stato"));

                    // 5. Creazione oggetto con il costruttore aggiornato
                    Prenotazione p = new Prenotazione(ab, rs.getInt("id_guest"), inizio, fine, creazione, statoEnum);
                    p.setId(rs.getInt("id"));

                    return p;
                }
            }
        } catch (Exception e) {
            // Fondamentale: stampa l'errore nella console di Java per capire COSA si è
            // rotto
            System.err.println("ERRORE NEL DAO:");
            e.printStackTrace();
        }
        return null;
    }

    // - Ottenere l'abitazione più gettonata nell'ultimo mese

    public Map<String, Object> getAbitazioneTopMese() {
        // Query che conta le prenotazioni create negli ultimi 30 giorni
        String sql = "SELECT a.nome, COUNT(p.id) as tot_prenotazioni " +
                "FROM Abitazione a " +
                "JOIN prenotazione p ON a.id = p.id_abitazione " +
                "WHERE p.data_creazione_record >= CURRENT_DATE - INTERVAL '1 month' " +
                "GROUP BY a.id, a.nome " +
                "ORDER BY tot_prenotazioni DESC LIMIT 1";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet rs = pstmt.executeQuery()) {

            if (rs.next()) {
                Map<String, Object> result = new HashMap<>();
                result.put("nome", rs.getString("nome"));
                result.put("conteggio", rs.getInt("tot_prenotazioni"));
                return result;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // Ritorna null se non ci sono prenotazioni nell'ultimo mese
    }

    // - Ottenere gli host con più prenotazioni nell'ultimo mese

    public List<Map<String, Object>> getTopHostsMese() {
        List<Map<String, Object>> lista = new ArrayList<>();
        // Join: Utente (Host) -> Abitazione -> Prenotazione
        String sql = "SELECT u.nome, COUNT(p.id) as tot_prenotazioni " +
                "FROM Utente u " +
                "JOIN Abitazione a ON u.codice_host = a.id_host " +
                "JOIN prenotazione p ON a.id = p.id_abitazione " +
                "WHERE p.data_creazione_record >= CURRENT_DATE - INTERVAL '1 month' " +
                "GROUP BY u.id, u.nome " +
                "ORDER BY tot_prenotazioni DESC LIMIT 5";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> host = new HashMap<>();
                host.put("nome", rs.getString("nome"));
                host.put("conteggio", rs.getInt("tot_prenotazioni"));
                lista.add(host);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }

    // - Ottenere tutti i super-host
    public List<Map<String, Object>> getSuperHosts() {
        List<Map<String, Object>> lista = new ArrayList<>();
        // Selezioniamo nome ed email (o altri dati utili) dei superhost
        String sql = "SELECT nome, email FROM Utente WHERE is_superhost = true ORDER BY nome ASC";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> sh = new HashMap<>();
                sh.put("nome", rs.getString("nome"));
                sh.put("email", rs.getString("email"));
                lista.add(sh);
            }
        } catch (SQLException e) {
            System.err.println("Errore in getSuperHosts: " + e.getMessage());
        }
        return lista;
    }
    // - Ottenere i 5 utenti con più giorni prenotati nell'ultimo mese

    public List<Map<String, Object>> getTopGuestGiorniMese() {
        List<Map<String, Object>> lista = new ArrayList<>();
        // Calcoliamo la somma dei giorni (data_fine - data_inizio) per ogni guest
        String sql = "SELECT u.nome, SUM(p.data_fine - p.data_inizio) as total_giorni " +
                "FROM Utente u " +
                "JOIN prenotazione p ON u.id = p.id_guest " +
                "WHERE p.data_creazione_record >= CURRENT_DATE - INTERVAL '1 month' " +
                "AND p.stato::text != 'cancellata' " +
                "GROUP BY u.id, u.nome " +
                "ORDER BY total_giorni DESC LIMIT 5";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> guest = new HashMap<>();
                guest.put("nome", rs.getString("nome"));
                guest.put("giorni", rs.getInt("total_giorni"));
                lista.add(guest);
            }
        } catch (SQLException e) {
            System.err.println("Errore in getTopGuestGiorniMese: " + e.getMessage());
            e.printStackTrace();
        }
        return lista;
    }

    // - Ottenere il numero medio di posti letto calcolato in base a tutte le
    // abitazioni caricate dagli host

}
