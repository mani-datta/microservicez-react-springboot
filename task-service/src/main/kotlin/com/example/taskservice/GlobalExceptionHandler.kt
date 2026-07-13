package com.example.taskservice

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
        fun handleValidationExceptions(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, String?>> {
            val errors = ex.bindingResult.allErrors.associate { error ->
                (error as FieldError).field to error.defaultMessage
            }
            return ResponseEntity(errors, HttpStatus.BAD_REQUEST)
        }

        @ExceptionHandler(UserNotFoundException::class)
        fun handleUserNotFound(ex: UserNotFoundException): ResponseEntity<Map<String, String>> {
            return ResponseEntity(mapOf("error" to ex.message!!), HttpStatus.BAD_REQUEST)
        }

        @ExceptionHandler(TaskNotFoundException::class)
        fun handleTaskNotFound(ex: TaskNotFoundException): ResponseEntity<Map<String, String>> {
            return ResponseEntity(mapOf("error" to ex.message!!), HttpStatus.NOT_FOUND)
        }
}
