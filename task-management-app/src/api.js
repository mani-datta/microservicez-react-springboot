import axios from 'axios';

const USER_SERVICE_URL = 'http://localhost:8080/users';
const TASK_SERVICE_URL = 'http://localhost:8081/tasks';

export const userService = {
  getAll: () => axios.get(USER_SERVICE_URL),
  getById: (id) => axios.get(`${USER_SERVICE_URL}/${id}`),
  create: (user) => axios.post(USER_SERVICE_URL, user),
  deleteById: (id) => axios.delete(`${USER_SERVICE_URL}/${id}`),
};

export const taskService = {
  getAll: () => axios.get(TASK_SERVICE_URL),
  getTasksByUserId: (userId) => axios.get(`${TASK_SERVICE_URL}/${userId}`),
  create: (task) => axios.post(TASK_SERVICE_URL, task),
  updateStatus: (id, status) => axios.put(`${TASK_SERVICE_URL}/${id}/status?status=${status}`),
  deleteById: (id) => axios.delete(`${TASK_SERVICE_URL}/${id}`),
};