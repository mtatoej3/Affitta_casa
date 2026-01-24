package affitta_casa.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class dbManager {
    private static final String URL = "jdbc:postgresql://localhost:5432/affitta_casa";
    private static final String USER = "postgres";
    private static final String PASSWORD = "qwerty";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
