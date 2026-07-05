package com.example.userservice;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final HttpClient httpClient;
    private static final String TASK_SERVICE_URL = "http://localhost:8081/tasks/user/";

    // Constructor injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.httpClient = HttpClient.newHttpClient();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUserById(Long id) {
        deleteUserTasks(id);
        userRepository.deleteById(id);
    }

    private void deleteUserTasks(Long userId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(TASK_SERVICE_URL + userId))
                .DELETE()
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Failed to delete tasks for user " + userId + ". HTTP status: " + response.statusCode());
            }
        } catch (IOException | InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Unable to delete tasks for user " + userId, ex);
        }
    }
}