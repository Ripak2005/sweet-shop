import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🍬 Sweet Shop
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
          )}
          
          {isAuthenticated && isAdmin() && (
            <Link to="/admin" className="navbar-link">
              Admin Panel
            </Link>
          )}
          
          {isAuthenticated ? (
            <div className="user-info">
              <div className="user-avatar">{getInitials(user?.name || 'U')}</div>
              <span className="user-name">{user?.name}</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-actions">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
