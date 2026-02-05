import { useState, useEffect } from 'react';
import { utenteService } from '../services/utenteService';
import { prenotazioneService } from '../services/prenotazioneService';
import type { Utente } from '../types';


function Registrazione() {
    const [utente, setUtente] = useState<Utente>({ 
        nome: '', 
        cognome: '', 
        email: '', 
        ruolo: 'GUEST', 
        indirizzo: '', 
        codice_host: '' 
    });

    const [utenti, setUtenti] = useState<any[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [utenteInModifica, setUtenteInModifica] = useState<any>(null);

    const [queryRicerca, setQueryRicerca] = useState('');
    const [prenotazioni, setPrenotazioni] = useState<any[]>([]);



    useEffect(() => {
        caricaUtenti();
    }, []);

    const caricaUtenti = async () => {
        try {
            const data = await utenteService.getAll();
            setUtenti(data);
        } catch (err) {
            console.error("Errore caricamento utenti:", err);
        }
    };

    const handleRegister = async () => {
        if (!utente.nome || !utente.email || !utente.indirizzo) {
            alert("Compila tutti i campi obbligatori.");
            return;
        }

        try {
            await utenteService.create(utente);
            alert("Utente creato con successo!");
            setUtente({ nome: '', cognome: '', email: '', ruolo: 'GUEST', indirizzo: '', codice_host: '' });
            caricaUtenti();
        } catch (err) {
            console.error("Errore durante la registrazione:", err);
            alert("Errore nel salvataggio.");
        }
    };

    const handleEdit = (u: any) => {
        setUtenteInModifica({ ...u });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await utenteService.update(utenteInModifica.id, utenteInModifica);
            alert("Utente aggiornato!");
            setShowEditModal(false);
            caricaUtenti();
        } catch (err) {
            alert("Errore nell'aggiornamento");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Eliminare questo utente?")) {
            try {
                await utenteService.delete(id);
                alert("Utente eliminato");
                caricaUtenti();
            } catch (err) {
                alert("Errore nell'eliminazione");
            }
        }
    };

    const handleCercaPrenotazioni = async () => {
        if (!queryRicerca.trim()) {
            alert("Inserisci un testo di ricerca");
            return;
        }
        try {
            const risultati = await prenotazioneService.search(queryRicerca);
            setPrenotazioni(risultati);
        } catch (err) {
            console.error("Errore ricerca:", err);
            alert("Errore nella ricerca");
        }
    };

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: 'auto', 
            //margin: '0 auto',
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            color: 'white'
        }}>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Gestione Utenti e Prenotazioni</h1>

            {/* LAYOUT A DUE COLONNE - ALLINEATE IN ALTO */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr', 
                gap: '30px', 
                alignItems: 'start'  // ← Allineamento verticale
            }}>
                
                {/* COLONNA SINISTRA: FORM CREAZIONE */}
                <div style={{ 
                    backgroundColor: '#2d2d2d', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #444',
                    width: '320px'
                }}>
                    <h2 style={{ color: 'white', marginTop: 0 }}>Crea Nuovo Utente</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input 
                            placeholder="Nome *" 
                            value={utente.nome}
                            onChange={e => setUtente({ ...utente, nome: e.target.value })} 
                            style={{ 
                                padding: '10px', 
                                borderRadius: '4px', 
                                border: '1px solid #555',
                                backgroundColor: '#1a1a1a',
                                color: 'white'
                            }}
                        />
                        <input 
                            placeholder="Cognome" 
                            value={utente.cognome}
                            onChange={e => setUtente({ ...utente, cognome: e.target.value })} 
                            style={{ 
                                padding: '10px', 
                                borderRadius: '4px', 
                                border: '1px solid #555',
                                backgroundColor: '#1a1a1a',
                                color: 'white'
                            }}
                        />
                        <input 
                            type="email"
                            placeholder="Email *" 
                            value={utente.email}
                            onChange={e => setUtente({ ...utente, email: e.target.value })} 
                            style={{ 
                                padding: '10px', 
                                borderRadius: '4px', 
                                border: '1px solid #555',
                                backgroundColor: '#1a1a1a',
                                color: 'white'
                            }}
                        />
                        <input 
                            placeholder="Indirizzo *" 
                            value={utente.indirizzo}
                            onChange={e => setUtente({ ...utente, indirizzo: e.target.value })} 
                            style={{ 
                                padding: '10px', 
                                borderRadius: '4px', 
                                border: '1px solid #555',
                                backgroundColor: '#1a1a1a',
                                color: 'white'
                            }}
                        />
                        <select 
                            value={utente.ruolo}
                            onChange={e => setUtente({ ...utente, ruolo: e.target.value as 'GUEST' | 'HOST' })}
                            style={{ 
                                padding: '10px', 
                                borderRadius: '4px', 
                                border: '1px solid #555',
                                backgroundColor: '#1a1a1a',
                                color: 'white'
                            }}
                        >
                            <option value="GUEST">Viaggiatore (Guest)</option>
                            <option value="HOST">Proprietario (Host)</option>
                        </select>
                        {utente.ruolo === 'HOST' && (
                            <input 
                                placeholder="Codice Host" 
                                value={utente.codice_host}
                                onChange={e => setUtente({ ...utente, codice_host: e.target.value })} 
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    border: '1px solid #555',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />
                        )}
                        <button 
                            onClick={handleRegister}
                            style={{ 
                                padding: '12px', 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}
                        >
                            ➕ Crea Utente
                        </button>
                    </div>
                </div>

                {/* COLONNA DESTRA: TABELLE */}
                <div>
                    {/* TABELLA UTENTI CON SCROLL - SENZA COLONNA ID */}
                    <h2 style={{ color: 'white', marginTop: 0 }}>Tutti gli Utenti ({utenti.length})</h2>
                    <div style={{ 
                        height: '400px', 
                        overflowY: 'auto', 
                        marginBottom: '40px',
                        border: '1px solid #444',
                        borderRadius: '8px'
                    }}>
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse', 
                            backgroundColor: '#2d2d2d'
                        }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                                    {/* RIMOSSA COLONNA ID */}
                                    <th style={{ padding: '12px', border: '1px solid #444' }}>Nome</th>
                                    <th style={{ padding: '12px', border: '1px solid #444' }}>Email</th>
                                    <th style={{ padding: '12px', border: '1px solid #444' }}>Ruolo</th>
                                    <th style={{ padding: '12px', border: '1px solid #444' }}>Indirizzo</th>
                                    <th style={{ padding: '12px', border: '1px solid #444' }}>Codice Host</th>
                                    <th style={{ padding: '12px', border: '1px solid #444' }}>Superhost</th>
                                    <th style={{ padding: '12px', border: '1px solid #444' }}>Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {utenti.map((u, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #444' }}>
                                        {/* RIMOSSA CELLA ID */}
                                        <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{u.nome} {u.cognome}</td>
                                        <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{u.email}</td>
                                        <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{u.ruolo}</td>
                                        <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{u.indirizzo}</td>
                                        <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{u.codice_host || '-'}</td>
                                        <td style={{ padding: '10px', border: '1px solid #444', textAlign: 'center', color: 'white' }}>
                                            {u.is_superhost ? '⭐' : '-'}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #444', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => handleEdit(u)} 
                                                style={{ 
                                                    marginRight: '5px', 
                                                    cursor: 'pointer',
                                                    backgroundColor: '#ffc107',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px'
                                                }}
                                            >✏️</button>
                                            <button 
                                                onClick={() => handleDelete(u.id)} 
                                                style={{ 
                                                    cursor: 'pointer',
                                                    backgroundColor: '#dc3545',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px'
                                                }}
                                            >🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* RICERCA PRENOTAZIONI */}
                    <h2 style={{ color: 'white' }}>Cerca Prenotazioni</h2>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            placeholder="Cerca per nome abitazione, guest, email, stato..." 
                            value={queryRicerca}
                            onChange={e => setQueryRicerca(e.target.value)}
                            style={{ 
                                flex: 1, 
                                padding: '12px', 
                                borderRadius: '4px', 
                                border: '1px solid #555',
                                backgroundColor: '#2d2d2d',
                                color: 'white'
                            }}
                        />
                        <button 
                            onClick={handleCercaPrenotazioni}
                            style={{ 
                                padding: '12px 24px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold' 
                            }}
                        >
                            🔍 Cerca
                        </button>
                    </div>

                    {prenotazioni.length > 0 && (
                        <div style={{ 
                            overflowX: 'auto',
                            border: '1px solid #444',
                            borderRadius: '8px'
                        }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse', 
                                backgroundColor: '#2d2d2d'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#28a745', color: 'white' }}>
                                        <th style={{ padding: '12px', border: '1px solid #444' }}>ID Prenotazione</th>
                                        <th style={{ padding: '12px', border: '1px solid #444' }}>Abitazione</th>
                                        <th style={{ padding: '12px', border: '1px solid #444' }}>Guest</th>
                                        <th style={{ padding: '12px', border: '1px solid #444' }}>Data Inizio</th>
                                        <th style={{ padding: '12px', border: '1px solid #444' }}>Data Fine</th>
                                        <th style={{ padding: '12px', border: '1px solid #444' }}>Stato</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prenotazioni.map((p, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #444' }}>
                                            <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{p.id_prenotazione}</td>
                                            <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{p.nome_abitazione}</td>
                                            <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{p.guest_nome} ({p.guest_email})</td>
                                            <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{p.data_inizio}</td>
                                            <td style={{ padding: '10px', border: '1px solid #444', color: 'white' }}>{p.data_fine}</td>
                                            <td style={{ padding: '10px', border: '1px solid #444' }}>
                                                <span style={{ 
                                                    padding: '6px 12px', 
                                                    borderRadius: '4px', 
                                                    backgroundColor: p.stato === 'CONFERMATA' ? '#28a745' : '#ffc107',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {p.stato}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL MODIFICA UTENTE */}
            {showEditModal && utenteInModifica && (
                <div style={{
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    zIndex: 1000
                }}>
                    <div style={{ 
                        backgroundColor: '#2d2d2d', 
                        padding: '30px', 
                        borderRadius: '8px', 
                        width: '400px',
                        border: '2px solid #444'
                    }}>
                        <h3 style={{ color: 'white', marginTop: 0 }}>Modifica Utente</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input 
                                placeholder="Nome" 
                                value={utenteInModifica.nome}
                                onChange={e => setUtenteInModifica({...utenteInModifica, nome: e.target.value})}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    border: '1px solid #555',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />
                            <input 
                                placeholder="Cognome" 
                                value={utenteInModifica.cognome}
                                onChange={e => setUtenteInModifica({...utenteInModifica, cognome: e.target.value})}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    border: '1px solid #555',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />
                            <input 
                                type="email"
                                placeholder="Email" 
                                value={utenteInModifica.email}
                                onChange={e => setUtenteInModifica({...utenteInModifica, email: e.target.value})}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    border: '1px solid #555',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />
                            <input 
                                placeholder="Indirizzo" 
                                value={utenteInModifica.indirizzo}
                                onChange={e => setUtenteInModifica({...utenteInModifica, indirizzo: e.target.value})}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    border: '1px solid #555',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />
                            <select 
                                value={utenteInModifica.ruolo}
                                onChange={e => setUtenteInModifica({...utenteInModifica, ruolo: e.target.value})}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    border: '1px solid #555',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            >
                                <option value="GUEST">GUEST</option>
                                <option value="HOST">HOST</option>
                            </select>
                            {utenteInModifica.ruolo === 'HOST' && (
                                <input 
                                    placeholder="Codice Host" 
                                    value={utenteInModifica.codice_host || ''}
                                    onChange={e => setUtenteInModifica({...utenteInModifica, codice_host: e.target.value})}
                                    style={{ 
                                        padding: '10px', 
                                        borderRadius: '4px', 
                                        border: '1px solid #555',
                                        backgroundColor: '#1a1a1a',
                                        color: 'white'
                                    }}
                                />
                            )}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button 
                                    onClick={() => setShowEditModal(false)} 
                                    style={{ 
                                        flex: 1, 
                                        padding: '10px', 
                                        cursor: 'pointer',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontWeight: 'bold'
                                    }}
                                >Annulla</button>
                                <button 
                                    onClick={handleSaveEdit} 
                                    style={{ 
                                        flex: 1, 
                                        padding: '10px', 
                                        backgroundColor: '#007bff', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer', 
                                        fontWeight: 'bold' 
                                    }}
                                >Salva</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Registrazione;
