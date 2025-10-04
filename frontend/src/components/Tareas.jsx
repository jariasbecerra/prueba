import { useState, useEffect } from 'react';
import axios from 'axios';

const Tareas = ({ token }) => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', fk_usuario: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTareas();
    fetchUsuarios();
  }, []);

  const fetchTareas = async () => {
    try {
      const res = await axios.get('http://localhost:3002/tareas', { headers: { Authorization: `Bearer ${token}` } });
      setTareas(res.data);
    } catch (err) {
      alert('Error fetching tareas');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3002/usuarios', { headers: { Authorization: `Bearer ${token}` } });
      setUsuarios(res.data);
    } catch (err) {
      alert('Error fetching usuarios');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3002/tareas/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://localhost:3002/tareas', form, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchTareas();
      setForm({ nombre: '', descripcion: '', fk_usuario: '' });
      setEditId(null);
    } catch (err) {
      alert('Error');
    }
  };

  const handleEdit = (tarea) => {
    setForm(tarea);
    setEditId(tarea.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/tareas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTareas();
    } catch (err) {
      alert('Error');
    }
  };

  return (
    <div style={{ backgroundColor: '#BBDEFB', padding: '20px', borderRadius: '5px' }}>
      <h2 style={{ color: '#2196F3' }}>Gestión de Tareas</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
        <input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} />
        <select value={form.fk_usuario} onChange={(e) => setForm({...form, fk_usuario: e.target.value})}>
          <option value="">Selecciona Usuario</option>
          {usuarios.map(user => (
            <option key={user.id} value={user.id}>{user.primer_nombre} {user.primer_apellido}</option>
          ))}
        </select>
        <button type="submit" style={{ backgroundColor: '#2196F3', color: 'white' }}>{editId ? 'Actualizar' : 'Crear'}</button>
      </form>
      <ul>
        {tareas.map(tarea => (
          <li key={tarea.id}>
            {tarea.nombre} - {tarea.descripcion} (Usuario: {tarea.fk_usuario})
            <button onClick={() => handleEdit(tarea)} style={{ marginLeft: '10px', backgroundColor: '#2196F3', color: 'white' }}>Editar</button>
            <button onClick={() => handleDelete(tarea.id)} style={{ marginLeft: '10px', backgroundColor: '#F44336', color: 'white' }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tareas;