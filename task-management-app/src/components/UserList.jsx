import React, { useState, useEffect } from 'react';
import { userService } from '../api';

function UserList({ users, onUserDeleted }) {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    let cancelled = false;
    const term = search.trim();

    const runSearch = async () => {
      if (!term) {
        setError('');
        setFilteredUsers(users);
        return;
      }

      if (/^\d+$/.test(term)) {
        setLoading(true);
        setError('');
        try {
          const response = await userService.getById(term);
          if (!cancelled) {
            setFilteredUsers([response.data]);
          }
        } catch (err) {
          if (!cancelled) {
            if (err.response && err.response.status === 404) {
              setFilteredUsers([]);
            } else {
              setError('Unable to search users.');
            }
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      } else {
        const lower = term.toLowerCase();
        setFilteredUsers(users.filter((user) =>
          user.name.toLowerCase().includes(lower) ||
          user.email.toLowerCase().includes(lower) ||
          String(user.id).includes(lower)
        ));
      }
    };

    const timeout = setTimeout(runSearch, 200);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, users]);

  return (
    <div>
      <h3>All Users</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, email, or ID"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      {loading && <p>Searching users…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {filteredUsers.length === 0 ? <p>No users found.</p> : (
        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span>
                <strong>{user.name}</strong> ({user.email}) - ID: {user.id}
              </span>
              <button
                onClick={() => onUserDeleted(user.id)}
                style={{
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;