import React, { useState } from 'react';

function TaskForm({ users, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!assignedUserId) {
      setError('Please select a user');
      return;
    }
    try {
      await onTaskCreated({ title, description, assignedUserId: Number(assignedUserId) });
      setTitle('');
      setDescription('');
      setAssignedUserId('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || err.response.data.title || 'Validation failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Create New Task</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div style={{ marginTop: '10px' }}>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)}>
          <option value="">-- Assign to User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name} (ID: {user.id})</option>
          ))}
        </select>
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Add Task</button>
    </form>
  );
}

export default TaskForm;