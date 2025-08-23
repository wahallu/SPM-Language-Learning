package com.qualityeducation.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CourseResponse {
    private String id;
    private String title;
    private String category;
    private String level;
    private String description;
    private String instructor;
    private String instructorTitle;
    private String image;
    private Double price;
    private String estimatedDuration;
    private List<String> prerequisites;
    private List<String> learningObjectives;
    private String status;
    private int students;
    private int modules;
    private LocalDateTime createdAt;
    private String teacherId;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getInstructorTitle() {
        return instructorTitle;
    }

    public void setInstructorTitle(String instructorTitle) {
        this.instructorTitle = instructorTitle;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public List<String> getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(List<String> prerequisites) {
        this.prerequisites = prerequisites;
    }

    public List<String> getLearningObjectives() {
        return learningObjectives;
    }

    public void setLearningObjectives(List<String> learningObjectives) {
        this.learningObjectives = learningObjectives;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getStudents() {
        return students;
    }

    public void setStudents(int students) {
        this.students = students;
    }

    public int getModules() {
        return modules;
    }

    public void setModules(int modules) {
        this.modules = modules;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }
}
