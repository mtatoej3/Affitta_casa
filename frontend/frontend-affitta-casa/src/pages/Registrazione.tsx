import { useState } from 'react';
import { utenteService } from '../services/utenteService';
import type { Utente } from '../types';
import { useNavigate } from 'react-router-dom';

function Registrazione() {
  const [utente, setUtente] = useState<Utente>({ 
    nome: '', 
    cognome: '', 
    email: '', 
    ruolo: 'GUEST', 
    indirizzo: '', 
    codice_host: '' 
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validazione base lato client
    if (!utente.nome || !utente.email || !utente.indirizzo) {
      alert("Per favore, compila tutti i campi obbligatori.");
      return;
    }

    try {
      const nuovoUtente = await utenteService.create(utente);

      if (nuovoUtente && nuovoUtente.id) {
        localStorage.setItem('idUtente', nuovoUtente.id.toString());
        localStorage.setItem('ruoloUtente', nuovoUtente.ruolo);
        alert("Profilo creato con successo!");
        navigate('/ricerca');
      }
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      alert("Errore nel salvataggio. Controlla che il codice host non sia già usato.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Crea il tuo Profilo</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          placeholder="Nome" 
          value={utente.nome}
          onChange={e => setUtente({ ...utente, nome: e.target.value })} 
        />

        <input 
          placeholder="Cognome" 
          value={utente.cognome}
          onChange={e => setUtente({ ...utente, cognome: e.target.value })} 
        />

        <input 
          type="email"
          placeholder="Email" 
          value={utente.email}
          onChange={e => setUtente({ ...utente, email: e.target.value })} 
        />

        <input 
          placeholder="Indirizzo" 
          value={utente.indirizzo}
          onChange={e => setUtente({ ...utente, indirizzo: e.target.value })} 
        />

        <label>
          <strong>Tipo di Account:</strong>
          <select 
            style={{ width: '100%', marginTop: '5px', padding: '5px' }}
            value={utente.ruolo}
            onChange={e => setUtente({ ...utente, ruolo: e.target.value as 'GUEST' | 'HOST' })}
          >
            <option value="GUEST">Viaggiatore (Guest)</option>
            <option value="HOST">Proprietario (Host)</option>
          </select>
        </label>

        {/* Mostriamo il campo codice host solo se seleziona HOST */}
        {utente.ruolo === 'HOST' && (
          <input 
            placeholder="Scegli il tuo Codice Host (Segreto)" 
            value={utente.codice_host}
            onChange={e => setUtente({ ...utente, codice_host: e.target.value })} 
          />
        )}

        <button 
          onClick={handleRegister}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Registrati ed Entra
        </button>
      </div>
    </div>
  );
}

export default Registrazione; 