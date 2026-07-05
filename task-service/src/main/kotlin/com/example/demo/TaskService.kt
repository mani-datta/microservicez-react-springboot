package com.example.demo

import com.example.demo.TaskNotFoundException
import com.example.demo.UserNotFoundException
import com.example.demo.Task
import com.example.demo.TaskStatus
import com.example.demo.TaskRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    webClientBuilder: WebClient.Builder
) {
    // Points to the User Service running on port 8080
    private val webClient: WebClient = webClientBuilder.baseUrl("http://localhost:8080").build()

    fun createTask(task: Task): Task {
        // Synchronously check if the user exists
        try {
            webClient.get()
                .uri("/users/${task.assignedUserId}")
                .retrieve()
                .toBodilessEntity()
                .block()
        } catch (ex: Exception) {
            // If User Service returns 404 or fails, throw our custom error
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