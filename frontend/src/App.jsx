import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import Usuarios from './components/Usuarios.jsx';
import Tareas from './components/Tareas.jsx';
import { useState } from 'react';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#E3F2FD', minHeight: '100vh', padding: '20px' }}>
        {token && (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/usuarios" style={{ marginRight: '10px', color: '#2196F3' }}>Usuarios</Link>
            <Link to="/tareas" style={{ marginRight: '10px', color: '#2196F3' }}>Tareas</Link>
            <button onClick={logout} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px' }}>Cerrar Sesión</button>
          </nav>
        )}
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/usuarios" element={token ? <Usuarios token={token} /> : <Login setToken={setToken} />} />
          <Route path="/tareas" element={token ? <Tareas token={token} /> : <Login setToken={setToken} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;