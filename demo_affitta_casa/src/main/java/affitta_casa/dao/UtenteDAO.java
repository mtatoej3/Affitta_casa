package affitta_casa.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import affitta_casa.db.dbManager;
import affitta_casa.models.Utente;
import affitta_casa.models.Utente.ruolo;

//CREATE / READ TUTTI E PER ID / MODIFICA PER ID / CANCELLA PER ID 

public class UtenteDAO {

    public void inserisciUtente(Utente utente) {
        String sql = "INSERT INTO Utente (nome, cognome, email, indirizzo, ruolo, codice_host, is_superhost) VALUES (?, ?, ?, ?, ?::ruolo_utente, ?, ?)";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, utente.getNome());
            pstmt.setString(2, utente.getCognome());
            pstmt.setString(3, utente.getEmail());
            pstmt.setString(4, utente.getIndirizzo());
            pstmt.setString(5, utente.getRuolo().name());
            pstmt.setString(6, utente.getCodice_host());
            pstmt.setBoolean(7, false);

            pstmt.executeUpdate();
            System.out.println("Utente salvato con successo!");

        } catch (SQLException e) {
            System.err.println("Errore nel salvataggio: " + e.getMessage());
        }
    }

    public Utente trovaPerId(int id) {
        String sql = "SELECT * FROM Utente WHERE id = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    // Trasformiamo la riga del DB in un oggetto Utente
                    return new Utente(
                            rs.getString("nome"),
                            rs.getString("cognome"),
                            rs.getString("email"),
                            rs.getString("indirizzo"),
                            ruolo.valueOf(rs.getString("ruolo").toUpperCase()), // Converte stringa DB in Enum Java
                            rs.getString("codice_host"),
                            rs.getBoolean("is_superhost"));
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore nella ricerca per ID: " + e.getMessage());
        }
        return null;
    }

    public List<Utente> leggiTutti() {
        List<Utente> utenti = new ArrayList<>();
        String sql = "SELECT * FROM Utente";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Utente u = new Utente(
                        rs.getString("nome"),
                        rs.getString("cognome"),
                        rs.getString("email"),
                        rs.getString("indirizzo"),
                        ruolo.valueOf(rs.getString("ruolo")),
                        rs.getString("codice_host"),
                        rs.getBoolean("is_superhost"));
                utenti.add(u);
            }
        } catch (SQLException e) {
            System.err.println("Errore nella lettura totale: " + e.getMessage());
        }
        return utenti;
    }

    public void modificaUtente(Utente utente, int id) {
        // Definiamo quali colonne vogliamo aggiornare
        String sql = "UPDATE Utente SET nome = ?, cognome = ?, email = ?, indirizzo = ?, ruolo = ?::ruolo_utente, codice_host = ?, is_superhost = ? WHERE id = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            // Impostiamo i nuovi valori presi dall'oggetto 'utente'
            pstmt.setString(1, utente.getNome());
            pstmt.setString(2, utente.getCognome());
            pstmt.setString(3, utente.getEmail());
            pstmt.setString(4, utente.getIndirizzo());
            pstmt.setString(5, utente.getRuolo().name()); // Trasformiamo l'enum in stringa per il DB
            pstmt.setString(6, utente.getCodice_host());
            pstmt.setBoolean(7, utente.isIs_superhost()); // Usiamo il valore booleano del record

            // L'ultimo parametro è l'ID nel WHERE
            pstmt.setInt(8, id);

            int righeCoinvolte = pstmt.executeUpdate();

            if (righeCoinvolte > 0) {
                System.out.println("Utente con ID " + id + " aggiornato con successo!");
            } else {
                System.out.println("Nessun utente trovato con ID " + id);
            }

        } catch (SQLException e) {
            System.err.println("Errore durante la modifica: " + e.getMessage());
        }
    }

    public void cancellaUtente(int id) {
        String sql = "DELETE FROM Utente WHERE id = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            int righeCancellate = pstmt.executeUpdate();

            if (righeCancellate > 0) {
                System.out.println("Utente con ID " + id + " eliminato definitivamente.");
            } else {
                System.out.println("Nessun utente trovato con ID " + id + ". Nulla da cancellare.");
            }

        } catch (SQLException e) {
            System.err.println("Errore durante la cancellazione: " + e.getMessage());
        }
    }
}
