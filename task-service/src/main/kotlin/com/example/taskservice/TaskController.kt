package com.example.taskservice

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = ["http://localhost:5173"])
class TaskController(private val taskService: TaskService) {

    @PostMapping
    fun createTask(@Valid @RequestBody task: Task): ResponseEntity<Task> {
        return ResponseEntity(taskService.createTask(task), HttpStatus.CREATED)
    }

    @GetMapping
    fun getAllTasks(): ResponseEntity<List<Task>> {
        return ResponseEntity.ok(taskService.getAllTasks())
    }

    @GetMapping("/{userId}")
    fun getTasksByUserId(@PathVariable userId: Long): ResponseEntity<List<Task>> {
        val tasks = taskService.getTasksByUserId(userId)
        return ResponseEntity.ok(tasks)
    }

    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: Long): ResponseEntity<Void> {
        taskService.deleteTaskById(id)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/user/{userId}")
    fun deleteTasksByUserId(@PathVariable userId: Long): ResponseEntity<Void> {
        taskService.deleteTasksByUserId(userId)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestParam status: TaskStatus
    ): ResponseEntity<Task> {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status))
    }
}
