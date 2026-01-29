import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '1rem', 
      background: '#282c34', 
      color: 'white',
      marginBottom: '20px' 
    }}>
      <b style={{ marginRight: 'auto' }}>AffittaCasa</b>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Profilo</Link>
      <Link to="/ricerca" style={{ color: 'white', textDecoration: 'none' }}>Cerca Case</Link>
    </nav>
  );
};

export default Navbar;