import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Registrazione from './pages/Registrazione';
// Per ora creiamo dei componenti al volo per non far rompere il codice, 
// poi li sostituirai con i file veri
const Ricerca = () => <div><h2>Pagina Ricerca Case (Work in progress)</h2></div>;
const Dettaglio = () => <div><h2>Dettaglio Casa (Work in progress)</h2></div>;

function App() {
  return (
    <Router>
      {/* La Navbar è fuori da Routes così resta sempre visibile in alto */}
      <Navbar /> 
      
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Routes>
          {/* 1. Pagina di ingresso (Profilo/Registrazione) */}
          <Route path="/" element={<Registrazione />} />
          
          {/* 2. Pagina principale con la tabella delle case */}
          <Route path="/ricerca" element={<Ricerca />} />
          
          {/* 3. Pagina dettaglio (l'id cambierà per ogni casa) */}
          <Route path="/casa/:id" element={<Dettaglio />} />
          
          {/* Se l'utente scrive un URL a caso, lo riportiamo alla registrazione */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;