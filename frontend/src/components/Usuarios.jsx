import { useState, useEffect } from 'react';
import axios from 'axios';

const Usuarios = ({ token }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ id: '', contrasena: '', primer_nombre: '', segundo_nombre: '', primer_apellido: '', segundo_apellido: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/usuarios', { headers: { Authorization: `Bearer ${token}` } });
      setUsuarios(res.data);
    } catch (err) {
      alert('Error fetching usuarios');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3001/usuarios/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://localhost:3001/usuarios', form, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchUsuarios();
      setForm({ id: '', contrasena: '', primer_nombre: '', segundo_nombre: '', primer_apellido: '', segundo_apellido: '' });
      setEditId(null);
    } catch (err) {
      alert('Error');
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/usuarios/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsuarios();
    } catch (err) {
      alert('Error');
    }
  };

  return (
    <div style={{ backgroundColor: '#BBDEFB', padding: '20px', borderRadius: '5px' }}>
      <h2 style={{ color: '#2196F3' }}>Gestión de Usuarios</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="ID" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} disabled={!!editId} />
        <input placeholder="Contraseña" value={form.contrasena} onChange={(e) => setForm({...form, contrasena: e.target.value})} />
        <input placeholder="Primer Nombre" value={form.primer_nombre} onChange={(e) => setForm({...form, primer_nombre: e.target.value})} />
        <input placeholder="Segundo Nombre" value={form.segundo_nombre} onChange={(e) => setForm({...form, segundo_nombre: e.target.value})} />
        <input placeholder="Primer Apellido" value={form.primer_apellido} onChange={(e) => setForm({...form, primer_apellido: e.target.value})} />
        <input placeholder="Segundo Apellido" value={form.segundo_apellido} onChange={(e) => setForm({...form, segundo_apellido: e.target.value})} />
        <button type="submit" style={{ backgroundColor: '#2196F3', color: 'white' }}>{editId ? 'Actualizar' : 'Crear'}</button>
      </form>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>
            {user.id} - {user.primer_nombre} {user.primer_apellido}
            <button onClick={() => handleEdit(user)} style={{ marginLeft: '10px', backgroundColor: '#2196F3', color: 'white' }}>Editar</button>
            <button onClick={() => handleDelete(user.id)} style={{ marginLeft: '10px', backgroundColor: '#F44336', color: 'white' }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;