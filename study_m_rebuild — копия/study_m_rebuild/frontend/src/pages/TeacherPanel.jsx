import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function TeacherPanel() {
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  async function loadModules() {
    const { data } = await api.get('/modules');
    setModules(data);
  }

  useEffect(() => { loadModules(); }, []);

  async function createModule(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api.post('/modules', form);
      setForm({ title: '', description: '' });
      setMessage('Модуль создан');
      await loadModules();
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Ошибка создания модуля');
    }
  }

  return (
    <main className="page split-page">
      <section className="card">
        <h1>🧑‍🏫 Панель преподавателя</h1>
        <form onSubmit={createModule} className="stack-form">
          <label>Название модуля</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label>Описание</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn">Создать модуль</button>
          {message && <div className="hint-box">{message}</div>}
        </form>
      </section>
      <section>
        <h2>Текущие модули</h2>
        <div className="vertical-list">
          {modules.map((module) => <article className="card" key={module.id}><h3>{module.title}</h3><p>{module.description}</p></article>)}
        </div>
      </section>
    </main>
  );
}
