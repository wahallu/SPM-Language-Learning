package com.qualityeducation.service;

import com.qualityeducation.dto.CourseRequest;
import com.qualityeducation.dto.CourseResponse;
import com.qualityeducation.model.Course;
import com.qualityeducation.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public CourseResponse createCourse(CourseRequest request, String teacherId) {
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        course.setDescription(request.getDescription());
        course.setInstructor(request.getInstructor());
        course.setInstructorTitle(request.getInstructorTitle());
        course.setImage(request.getImage());
        course.setPrice(request.getPrice());
        course.setEstimatedDuration(request.getEstimatedDuration());
        course.setPrerequisites(request.getPrerequisites());
        course.setLearningObjectives(request.getLearningObjectives());
        course.setTeacherId(teacherId);
        course.setStatus("draft");
        course.setStudents(0);
        course.setModules(0);
        course.setCreatedAt(LocalDateTime.now());

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    public List<CourseResponse> getCoursesByTeacher(String teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public Optional<CourseResponse> getCourseById(String courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        return course.map(this::mapToCourseResponse);
    }

    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse updateCourse(String courseId, CourseRequest request) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.setTitle(request.getTitle());
            course.setCategory(request.getCategory());
            course.setLevel(request.getLevel());
            course.setDescription(request.getDescription());
            course.setInstructor(request.getInstructor());
            course.setInstructorTitle(request.getInstructorTitle());
            course.setImage(request.getImage());
            course.setPrice(request.getPrice());
            course.setEstimatedDuration(request.getEstimatedDuration());
            course.setPrerequisites(request.getPrerequisites());
            course.setLearningObjectives(request.getLearningObjectives());

            Course updated = courseRepository.save(course);
            return mapToCourseResponse(updated);
        }
        throw new RuntimeException("Course not found with id: " + courseId);
    }

    public void deleteCourse(String courseId) {
        courseRepository.deleteById(courseId);
    }

    private CourseResponse mapToCourseResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setCategory(course.getCategory());
        response.setLevel(course.getLevel());
        response.setDescription(course.getDescription());
        response.setInstructor(course.getInstructor());
        response.setInstructorTitle(course.getInstructorTitle());
        response.setImage(course.getImage());
        response.setPrice(course.getPrice());
        response.setEstimatedDuration(course.getEstimatedDuration());
        response.setPrerequisites(course.getPrerequisites());
        response.setLearningObjectives(course.getLearningObjectives());
        response.setStatus(course.getStatus());
        response.setStudents(course.getStudents());
        response.setModules(course.getModules());
        response.setCreatedAt(course.getCreatedAt());
        response.setTeacherId(course.getTeacherId());
        return response;
    }
}