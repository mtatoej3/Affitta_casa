import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Registrazione from './pages/Registrazione';
import Ricerca from './pages/Ricerca'; 
import CreaAbitazione from './pages/CreaAbitazione';
import Dettaglio from './pages/Dettaglio';
import Stats from './pages/Stast';
// Se hai già creato Dettaglio.tsx, scommenta la riga sotto
// import Dettaglio from './pages/Dettaglio'; 

function App() {
  return (
    <Router>
      {/* La Navbar resta fissa in alto su tutte le pagine */}
      <Navbar /> 
      
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Routes>
          {/* 1. Pagina di ingresso: Registrazione/Login */}
          <Route path="/" element={<Registrazione />} />
          
          {/* 2. Pagina principale: Ricerca Abitazioni con Tabella e Filtri */}
          <Route path="/ricerca" element={<Ricerca />} />
          
          {/* 3. Pagina dettaglio: Visualizza la singola abitazione tramite ID */}
          {/* Nota: usiamo "abitazione" invece di "casa" per pignoleria col DB */}
          
          
          <Route path='/crea_abitazione' element={<CreaAbitazione />} />

          {/* Redirect di sicurezza per URL inesistenti */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/abitazione/:id" element={<Dettaglio />} />


          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;