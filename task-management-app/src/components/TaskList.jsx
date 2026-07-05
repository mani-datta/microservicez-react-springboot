import React, { useEffect, useState } from 'react';
import { taskService } from '../api';

function TaskList({ tasks, users, onStatusChange, onTaskDeleted }) {
  const [search, setSearch] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : `Unknown User (ID: ${userId})`;
  };

  useEffect(() => {
    let cancelled = false;
    const term = search.trim();

    const runSearch = async () => {
      if (!term) {
        setError('');
        setFilteredTasks(tasks);
        return;
      }

      if (/^\d+$/.test(term)) {
        setLoading(true);
        setError('');
        try {
          const response = await taskService.getTasksByUserId(term);
          if (!cancelled) {
            setFilteredTasks(response.data);
          }
        } catch (err) {
          if (!cancelled) {
            if (err.response && err.response.status === 404) {
              setFilteredTasks([]);
            } else {
              setError('Unable to search tasks.');
            }
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      } else {
        const lower = term.toLowerCase();
        setFilteredTasks(tasks.filter((task) =>
          task.title.toLowerCase().includes(lower) ||
          (task.description || '').toLowerCase().includes(lower) ||
          getUserName(task.assignedUserId).toLowerCase().includes(lower) ||
          String(task.assignedUserId).includes(lower)
        ));
      }
    };

    const timeout = setTimeout(runSearch, 200);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, tasks]);

  return (
    <div>
      <h3>All Tasks</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by user ID"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      {loading && <p>Searching tasks…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {filteredTasks.length === 0 ? <p>No tasks found.</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description || 'N/A'}</td>
                <td>{getUserName(task.assignedUserId)}</td>
                <td><span style={{ fontWeight: 'bold' }}>{task.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                    <button
                      onClick={() => onTaskDeleted(task.id)}
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskList;