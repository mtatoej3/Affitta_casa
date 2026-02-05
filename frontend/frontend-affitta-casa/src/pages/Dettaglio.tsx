import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { abitazioneService, type Abitazione } from '../services/abitazioneService';
import { disponibilitaService } from '../services/disponibilitaService';
import { prenotazioneService } from '../services/prenotazioneService';

function Dettaglio() {
    const { id } = useParams();
    const [casa, setCasa] = useState<Abitazione | null>(null);
    const [codiceHostVerifica, setCodiceHostVerifica] = useState('');
    const [isHostAutenticato, setIsHostAutenticato] = useState(false);
    const [loading, setLoading] = useState(true);

    const [nuovoPrezzo, setNuovoPrezzo] = useState(0);
    const [nuovoInizio, setNuovoInizio] = useState('');
    const [nuovoFine, setNuovoFine] = useState('');
    const [disponibilita, setDisponibilita] = useState<any[]>([]);

    const [dataI, setDataI] = useState('');
    const [dataF, setDataF] = useState('');


    const [guestNome, setGuestNome] = useState('');
    const [guestCognome, setGuestCognome] = useState('');
    const [guestEmail, setGuestEmail] = useState('');

    console.log("DEBUG: Il componente Dettaglio è stato caricato. ID recuperato:", id);

    useEffect(() => {
        if (id) {
            setLoading(true);
            // Eseguiamo entrambe le chiamate
            Promise.all([
                abitazioneService.getById(id),
                disponibilitaService.getByAbitazione(id)
            ])
                .then(([datiCasa, datiDisp]) => {
                    setCasa(datiCasa);
                    // NOTA LA MODIFICA QUI SOTTO: datiDisp.disponibilita
                    setDisponibilita(datiDisp.disponibilita || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Errore nel caricamento dati", err);
                    setLoading(false);
                });
        }
    }, [id]);



    useEffect(() => {
        console.log("DEBUG: Entrato nello useEffect. Valore di id:", id);

        if (id) {
            console.log("DEBUG: ID presente, faccio la chiamata al service...");
            setLoading(true);
            abitazioneService.getById(id)
                .then(dati => {
                    console.log("DEBUG: Il server ha risposto! Dati:", dati);
                    setCasa(dati);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("DEBUG: Il server ha dato ERRORE:", err);
                    setLoading(false);
                });
        } else {
            console.log("DEBUG: Lo useEffect è partito ma ID è vuoto/undefined.");
        }
    }, [id]);



    const gestisciAggiungiSlot = async () => {
        if (!nuovoInizio || !nuovoFine || nuovoPrezzo <= 0) {
            alert("Inserisci date valide e un prezzo maggiore di 0");
            return;
        }

        if (!casa) {
            alert("Errore: dati della casa non caricati.");
            return;
        }

        const payload = {
            id_abitazione: casa.id,
            data_inizio: nuovoInizio,
            data_fine: nuovoFine,
            prezzo_periodo: nuovoPrezzo
        };

        try {
            const response = await fetch('http://localhost:7000/api/disponibilita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Disponibilità inserita!");
                window.location.reload(); // Ricarica per vedere il nuovo slot in tabella
            } else {
                const errorMsg = await response.text();
                alert("Errore: " + errorMsg);
            }
        } catch (error) {
            console.error("Errore fetch:", error);
        }
    };

    const handlePrenota = async () => {
        // Validazione semplice
        if (!guestNome || !guestCognome || !guestEmail || !dataI || !dataF) {
            alert("Completa tutti i campi prima di prenotare");
            return;
        }

        if (!casa) {
            alert("Errore: dati della casa non caricati.");
            return;
        }

        const payload = {
            id_abitazione: casa.id,
            data_inizio: dataI,
            data_fine: dataF,
            guest_nome: guestNome,      // Deve corrispondere al nome nel DTO Java
            guest_cognome: guestCognome,
            guest_email: guestEmail
        };

        try {
            await prenotazioneService.invia(payload);
            alert("Prenotazione effettuata!");
        } catch (err) {
            alert("Errore durante la prenotazione: " + err);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Caricamento dati in corso...</div>;
    if (!casa) return <div style={{ padding: '20px' }}>Abitazione non trovata.</div>;
    console.log("Stato disponibilita attuale:", disponibilita);
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
            {/* INTESTAZIONE E MEDIA VOTI */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>{casa.nome}</h1>
                <div style={{ fontSize: '20px', color: '#f39c12' }}>
                    ⭐ 4.8 <span style={{ color: '#666', fontSize: '14px' }}>(12 recensioni)</span>
                </div>
            </div>
            <p style={{ color: '#666' }}>📍 {casa.indirizzo}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                {/* COLONNA SINISTRA: INFO E DISPONIBILITÀ */}
                <div>
                    <h3>Caratteristiche</h3>
                    <ul>
                        <li>Locali: {casa.n_locali}</li>
                        <li>Posti Letto: {casa.n_posti_letto}</li>
                        <li>Piano: {casa.piano}</li>
                    </ul>

                    <hr />

                    {/* SEZIONE GESTIONE HOST (Verifica Codice) */}
                    <div style={{ backgroundColor: '#2d2d2d', padding: '15px', borderRadius: '8px', border: '1px solid #444', color: 'white' }}>
                        <h4 style={{ marginTop: 0 }}>Gestione Disponibilità (Area Host)</h4>

                        {!isHostAutenticato ? (
                            <div>
                                <input
                                    type="password"
                                    placeholder="Inserisci Codice Host"
                                    value={codiceHostVerifica}
                                    onChange={(e) => setCodiceHostVerifica(e.target.value)}
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
                                />
                                <button
                                    onClick={() => {
                                        if (codiceHostVerifica === casa.id_host.codice_host) setIsHostAutenticato(true);
                                        else alert("Codice errato!");
                                    }}
                                    style={{ marginLeft: '10px', padding: '8px 16px', cursor: 'pointer' }}
                                >
                                    Verifica
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ color: '#00ffcc', fontWeight: 'bold' }}>✅ Accesso autorizzato</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <input
                                        type="date"
                                        value={nuovoInizio}
                                        onChange={(e) => setNuovoInizio(e.target.value)}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #666' }}
                                    />
                                    <span> a </span>
                                    <input
                                        type="date"
                                        value={nuovoFine}
                                        onChange={(e) => setNuovoFine(e.target.value)}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #666' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Prezzo (€)"
                                        value={nuovoPrezzo}
                                        onChange={(e) => setNuovoPrezzo(Number(e.target.value))}
                                        style={{ width: '90px', padding: '5px', borderRadius: '4px', border: '1px solid #666' }}
                                    />
                                    <button
                                        onClick={gestisciAggiungiSlot}
                                        style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Aggiungi Slot
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <h4 style={{ color: 'white', marginTop: '30px' }}>Calendario Disponibilità</h4>
                    <table width="100%" style={{ borderCollapse: 'collapse', color: 'white', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #444', textAlign: 'left', backgroundColor: '#333' }}>
                                <th style={{ padding: '12px' }}>Inizio</th>
                                <th style={{ padding: '12px' }}>Fine</th>
                                <th style={{ padding: '12px' }}>Prezzo (€)</th>

                            </tr>
                        </thead>
                        <tbody>
                            {disponibilita && disponibilita.length > 0 ? (
                                disponibilita.map((disp: any, index: number) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '12px' }}>{disp.data_inizio}</td>
                                        <td style={{ padding: '12px' }}>{disp.data_fine}</td>
                                        <td style={{ padding: '12px' }}>{disp.prezzo_periodo}€</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                        Nessuno slot trovato per questa casa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* COLONNA DESTRA: FORM PRENOTAZIONE GUEST */}
                <div style={{
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '1px solid #eee',
                    height: 'fit-content',
                    position: 'sticky',
                    top: '20px'
                }}>
                    <h3 style={{ marginTop: 0 }}>Prenota Soggiorno</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        {/* INPUT NOME */}
                        <input
                            type="text"
                            placeholder="Nome"
                            value={guestNome}
                            onChange={(e) => setGuestNome(e.target.value)}
                        />

                        {/* INPUT COGNOME */}
                        <input
                            type="text"
                            placeholder="Cognome"
                            value={guestCognome}
                            onChange={(e) => setGuestCognome(e.target.value)}
                        />

                        {/* INPUT EMAIL */}
                        <input
                            type="email"
                            placeholder="Email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                        />

                        <label>Check-in</label>
                        <input
                            type="date"
                            value={dataI}
                            onChange={(e) => setDataI(e.target.value)}
                        />

                        <label>Check-out</label>
                        <input
                            type="date"
                            value={dataF}
                            onChange={(e) => setDataF(e.target.value)}
                        />

                        <button
                            onClick={handlePrenota}
                            style={{
                                backgroundColor: '#ff385c',
                                color: 'white',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            CONFERMA PRENOTAZIONE
                        </button>
                    </div>
                </div>
            </div>

            <hr style={{ margin: '40px 0' }} />

            {/* FEEDBACK SECTION */}
            <h3>Recensioni degli ospiti</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Esempio di Card Feedback */}
                <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <strong>Marco Rossi</strong> ⭐⭐⭐⭐⭐
                    <p>"Casa bellissima e host molto gentile. Consigliato!"</p>
                </div>
                <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <strong>Giulia Bianchi</strong> ⭐⭐⭐⭐
                    <p>"Ottima posizione, cucina un po' piccola ma funzionale."</p>
                </div>
            </div>
        </div>
    );
}

export default Dettaglio;


