import React, { useState, useEffect } from 'react';
import { userService, taskService } from './api';
import UserForm from './components/UserForm.jsx';
import UserList from './components/UserList.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

function App() {
  const [view, setView] = useState('tasks'); // 'tasks' or 'users'
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchData = async () => {
    try {
      const userRes = await userService.getAll();
      const taskRes = await taskService.getAll();
      setUsers(userRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      console.error('Error loading data from microservices', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserCreated = async (userData) => {
    try {
      const response = await userService.create(userData);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      fetchData();
    } catch (err) {
      console.error('Failed to add user to state:', err);
      throw err;
    }
  };

  const handleUserDeleted = async (userId) => {
    try {
      await userService.deleteById(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setTasks((prevTasks) => prevTasks.filter((task) => task.assignedUserId !== userId));
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const handleTaskCreated = async (taskData) => {
    await taskService.create(taskData);
    fetchData();
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      await taskService.deleteById(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(taskId, newStatus);
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Dashboard</h2>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('tasks')} style={{ marginRight: '10px', fontWeight: view === 'tasks' ? 'bold' : 'normal' }}>Tasks Page</button>
        <button onClick={() => setView('users')} style={{ fontWeight: view === 'users' ? 'bold' : 'normal' }}>Users Page</button>
      </nav>

      <hr />

      {view === 'users' ? (
        <div>
          <h2>Users Management</h2>
          <UserForm onUserCreated={handleUserCreated} />
          <UserList users={users} onUserDeleted={handleUserDeleted} />
        </div>
      ) : (
        <div>
          <h2>Tasks Management</h2>
          <TaskForm users={users} onTaskCreated={handleTaskCreated} />
          <TaskList tasks={tasks} users={users} onStatusChange={handleStatusChange} onTaskDeleted={handleTaskDeleted} />
        </div>
      )}
    </div>
  );
}

export default App;