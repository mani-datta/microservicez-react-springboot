package com.example.taskservice

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity
@Table(name = "tasks")
data class Task(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @field:NotBlank(message = "Title is required")
    val title: String,

    val description: String?,

    @Enumerated(EnumType.STRING)
    var status: TaskStatus = TaskStatus.TO_DO,

    val assignedUserId: Long
)

enum class TaskStatus {
    TO_DO, IN_PROGRESS, DONE
}
