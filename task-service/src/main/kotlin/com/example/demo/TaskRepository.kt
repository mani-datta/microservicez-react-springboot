package com.example.demo

import com.example.demo.Task
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TaskRepository : JpaRepository<Task, Long> {
    fun findByAssignedUserId(assignedUserId: Long): List<Task>
    fun deleteByAssignedUserId(assignedUserId: Long)
}