package com.example.taskservice

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TaskRepository : JpaRepository<Task, Long> {
    fun findByAssignedUserId(assignedUserId: Long): List<Task>
    fun deleteByAssignedUserId(assignedUserId: Long)
}
