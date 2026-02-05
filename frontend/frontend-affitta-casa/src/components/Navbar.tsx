import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '1rem', 
      background: '#282c34', 
      color: 'white', 
    }}>
      <b style={{ marginRight: 'auto' }}>AffittaCasa</b>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Profilo</Link>
      <Link to="/ricerca" style={{ color: 'white', textDecoration: 'none' }}>Cerca Case</Link>
      <Link to= "/crea_abitazione" style={{color: 'white', textDecoration: 'none'}}> Aggiungi casa</Link>
      <Link to="/stats" style={{ 
          backgroundColor: '#007bff', 
          padding: '5px 10px', 
          borderRadius: '4px', 
          color: 'white', 
          textDecoration: 'none',
          fontWeight: 'bold' 
      }}>
        Dashboard Stats
      </Link>
    </nav>
  );
};

export default Navbar;