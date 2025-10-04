import { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [id, setId] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', { id, contrasena });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert('Error en login');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: 'auto', backgroundColor: '#BBDEFB', padding: '20px', borderRadius: '5px' }}>
      <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
      <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
      <button type="submit" style={{ backgroundColor: '#2196F3', color: 'white' }}>Login</button>
    </form>
  );
};

export default Login;