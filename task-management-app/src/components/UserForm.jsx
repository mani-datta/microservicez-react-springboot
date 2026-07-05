import React, { useState } from 'react';

function UserForm({ onUserCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await onUserCreated({ name, email });
      setName('');
      setEmail('');
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add New User</h3>
      <div>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <span style={{ color: 'red' }}> {errors.name}</span>}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <span style={{ color: 'red' }}> {errors.email}</span>}
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Create User</button>
    </form>
  );
}

export default UserForm;