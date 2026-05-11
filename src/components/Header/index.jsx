import './style.modules.css'
import logo from '../../assets/logoPR.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
   <header>
    <div className="logo">
      <img src={logo} alt="Logo" className="logo"/>
      <Link to="/" className="brand-name">TEIA</Link>
    </div>
    <nav>
      <ul>
        {/*Link to= não baixa HTML de novo, só atualiza o que mudou*/}
        {isAuthenticated() ? (
          <>
            <li><Link to="/sobre" className={isActive('/sobre')}>Sobre</Link></li>
            <li><Link to="/contato" className={isActive('/contato')}>Contato</Link></li>
            <li><a href="#" onClick={handleLogout} className="logout-btn">Sair</a></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
            <li><Link to="/sobre" className={isActive('/sobre')}>Sobre</Link></li>
            <li><Link to="/contato" className={isActive('/contato')}>Contato</Link></li>
          </>
        )}
      </ul>
    </nav>
  </header>
  )
}