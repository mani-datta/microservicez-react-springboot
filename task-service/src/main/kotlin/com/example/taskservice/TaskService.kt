package com.example.taskservice

import com.example.taskservice.exceptions.TaskNotFoundException
import com.example.taskservice.exceptions.UserNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    webClientBuilder: WebClient.Builder
) {
    private val webClient: WebClient = webClientBuilder.baseUrl("http://localhost:8080").build()

    fun createTask(task: Task): Task {
        try {
            webClient.get()
                .uri("/users/${task.assignedUserId}")
                .retrieve()
                .toBodilessEntity()
                .block()
        } catch (ex: Exception) {
            throw UserNotFoundException("Assigned user with ID ${task.assignedUserId} does not exist or User Service is down.")
        }

        return taskRepository.save(task)
    }
    fun getAllTasks(): List<Task> = taskRepository.findAll()

    fun getTasksByUserId(userId: Long): List<Task> {
        return taskRepository.findByAssignedUserId(userId)
    }

    fun deleteTaskById(id: Long) {
        if (!taskRepository.existsById(id)) {
            throw TaskNotFoundException("Task with ID $id not found.")
        }
        taskRepository.deleteById(id)
    }

    fun deleteTasksByUserId(userId: Long) {
        taskRepository.deleteByAssignedUserId(userId)
    }

    fun updateTaskStatus(id: Long, newStatus: TaskStatus): Task {
        val task = taskRepository.findById(id)
            .orElseThrow { TaskNotFoundException("Task with ID $id not found.") }
        task.status = newStatus
        return taskRepository.save(task)
    }
}
