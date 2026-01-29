package affitta_casa.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import affitta_casa.db.dbManager;
import affitta_casa.models.Abitazione;
import affitta_casa.models.Disponibilita;

public class DisponibilitaDAO {

    public void inserisciDisponibilita(Disponibilita d) {
        String sql = "INSERT INTO Disponibilita (id_abitazione, data_inizio, data_fine, prezzo_periodo) VALUES (?, ?, ?, ?)";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, d.getId_abitazione().getId());
            pstmt.setDate(2, java.sql.Date.valueOf(d.getData_inizio()));
            pstmt.setDate(3, java.sql.Date.valueOf(d.getData_fine()));
            pstmt.setDouble(4, d.getPrezzo_periodo());

            pstmt.executeUpdate();
            System.out.println("Disponibilità aggiunta a " + d.getId_abitazione().getNome() + "nel periodo da "
                    + d.getData_inizio() + " a " + d.getData_fine() + "al prezzo al giorno di "
                    + d.getPrezzo_periodo());
        } catch (SQLException e) {
            System.out.println("errore nella creazione della disponibilità " + e.getMessage());
        }

    }

    public List<Disponibilita> cercaDisponibilita(LocalDate inizioRicerca, LocalDate fineRicerca, Double budgetMax) {
        List<Disponibilita> risultati = new ArrayList<>();

        // Query con JOIN per avere anche i dati dell'abitazione
        String sql = "SELECT d.*, a.nome as nome_casa, a.indirizzo as indirizzo_casa " +
                "FROM Disponibilita d " +
                "JOIN Abitazione a ON d.id_abitazione = a.id " +
                "WHERE d.data_inizio <= ? " + // La casa è libera da prima o oggi
                "AND d.data_fine >= ? " + // La casa resta libera fino a dopo o oggi
                "AND d.prezzo_periodo <= ?"; // Prezzo nel budget

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setDate(1, java.sql.Date.valueOf(inizioRicerca));
            pstmt.setDate(2, java.sql.Date.valueOf(fineRicerca));
            pstmt.setDouble(3, budgetMax);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    // 1. Ricostruiamo l'oggetto Abitazione (anche se parziale per ora)
                    Abitazione casa = new Abitazione();
                    casa.setId(rs.getInt("id_abitazione"));
                    casa.setNome(rs.getString("nome_casa"));
                    casa.setIndirizzo(rs.getString("indirizzo_casa"));

                    // 2. Creiamo l'oggetto Disponibilita
                    Disponibilita disp = new Disponibilita(
                            casa,
                            rs.getDate("data_inizio").toLocalDate(), // Torniamo a LocalDate
                            rs.getDate("data_fine").toLocalDate(),
                            rs.getDouble("prezzo_periodo"));
                    disp.setId(rs.getInt("id"));

                    risultati.add(disp);
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore nella ricerca disponibilità: " + e.getMessage());
        }
        return risultati;
    }

}
