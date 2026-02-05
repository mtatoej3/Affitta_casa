package affitta_casa.dao;

import affitta_casa.db.dbManager;
import affitta_casa.models.Feedback;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FeedbackDAO {

    /**
     * Verifica che la prenotazione esista, sia CONFERMATA e corrisponda a nome/email
     */
    public boolean verificaPrenotazione(int idPrenotazione, String nome, String email) {
        String sql = "SELECT u.nome, u.email, p.stato " +
                     "FROM Prenotazione p " +
                     "JOIN Utente u ON p.id_guest = u.id " +
                     "WHERE p.id = ?";
        
        try (Connection conn = dbManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, idPrenotazione);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    String dbNome = rs.getString("nome");
                    String dbEmail = rs.getString("email");
                    String stato = rs.getString("stato");
                    
                    // Verifica: nome, email e stato CONFERMATA
                    return dbNome.equalsIgnoreCase(nome) && 
                           dbEmail.equalsIgnoreCase(email) && 
                           "CONFERMATA".equalsIgnoreCase(stato);
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore verifica prenotazione: " + e.getMessage());
        }
        return false;
    }

    /**
     * Inserisce un nuovo feedback
     */
    public void inserisci(Feedback f) {
        String sql = "INSERT INTO Feedback (id_prenotazione, titolo, testo, punteggio) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = dbManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, f.getId_prenotazione());
            pstmt.setString(2, f.getTitolo());
            pstmt.setString(3, f.getTesto());
            pstmt.setInt(4, f.getPunteggio());
            
            pstmt.executeUpdate();
            System.out.println("Feedback inserito con successo per prenotazione " + f.getId_prenotazione());
            
        } catch (SQLException e) {
            System.err.println("Errore inserimento feedback: " + e.getMessage());
        }
    }

    /**
     * Recupera tutti i feedback per una specifica abitazione
     */
    public List<Map<String, Object>> getFeedbackPerAbitazione(int idAbitazione) {
        List<Map<String, Object>> lista = new ArrayList<>();
        
        String sql = "SELECT f.id, f.titolo, f.testo, f.punteggio, u.nome as guest_nome " +
                     "FROM Feedback f " +
                     "JOIN Prenotazione p ON f.id_prenotazione = p.id " +
                     "JOIN Utente u ON p.id_guest = u.id " +
                     "WHERE p.id_abitazione = ? " +
                     "ORDER BY f.id DESC";
        
        try (Connection conn = dbManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, idAbitazione);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> feedback = new HashMap<>();
                    feedback.put("id", rs.getInt("id"));
                    feedback.put("titolo", rs.getString("titolo"));
                    feedback.put("testo", rs.getString("testo"));
                    feedback.put("punteggio", rs.getInt("punteggio"));
                    feedback.put("guest_nome", rs.getString("guest_nome"));
                    lista.add(feedback);
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore recupero feedback: " + e.getMessage());
        }
        return lista;
    }

    /**
     * Calcola la media dei punteggi per un'abitazione
     */
    public double getMediaPunteggio(int idAbitazione) {
        String sql = "SELECT AVG(f.punteggio) as media " +
                     "FROM Feedback f " +
                     "JOIN Prenotazione p ON f.id_prenotazione = p.id " +
                     "WHERE p.id_abitazione = ?";
        
        try (Connection conn = dbManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, idAbitazione);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble("media");
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore calcolo media: " + e.getMessage());
        }
        return 0.0;
    }

    /**
     * Cancella un feedback
     */
    public void cancella(int id) {
        String sql = "DELETE FROM Feedback WHERE id = ?";
        
        try (Connection conn = dbManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
            System.out.println("Feedback " + id + " eliminato");
            
        } catch (SQLException e) {
            System.err.println("Errore cancellazione feedback: " + e.getMessage());
        }
    }
}
