package com.qualityeducation.service;

import com.qualityeducation.dto.CourseRequest;
import com.qualityeducation.dto.CourseResponse;
import com.qualityeducation.dto.ModuleResponse;
import com.qualityeducation.model.Course;
import com.qualityeducation.model.Module;
import com.qualityeducation.repository.CourseRepository;
import com.qualityeducation.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ModuleRepository moduleRepository;

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
        course.setModules(0);  // Initialize with 0 modules
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

    /**
     * Get course with its modules
     */
    public Optional<CourseResponse> getCourseWithModules(String courseId, String teacherId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);

        if (courseOpt.isEmpty()) {
            return Optional.empty();
        }

        Course course = courseOpt.get();

        // Verify teacher has access to this course
        if (!course.getTeacherId().equals(teacherId)) {
            return Optional.empty();
        }

        CourseResponse courseResponse = mapToCourseResponse(course);

        // Get modules for this course
        List<Module> modules = moduleRepository.findByCourseIdOrderByOrderAsc(courseId);
        List<ModuleResponse> moduleResponses = modules.stream()
                .map(ModuleResponse::fromModule)
                .collect(Collectors.toList());

        // You might want to add a modules field to CourseResponse or create a new DTO
        // For now, we'll update the modules count
        courseResponse.setModules(modules.size());

        return Optional.of(courseResponse);
    }

    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public List<CourseResponse> getAllPublishedCourses() {
        List<Course> courses = courseRepository.findByStatus("published");
        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public List<CourseResponse> searchPublishedCourses(String searchTerm, String category, String level) {
        List<Course> courses = courseRepository.findByStatus("published");
        
        return courses.stream()
                .filter(course -> {
                    boolean matches = true;
                    
                    if (searchTerm != null && !searchTerm.isEmpty()) {
                        String term = searchTerm.toLowerCase();
                        matches = course.getTitle().toLowerCase().contains(term) ||
                                course.getDescription().toLowerCase().contains(term) ||
                                course.getCategory().toLowerCase().contains(term);
                    }
                    
                    if (category != null && !category.isEmpty() && !category.equals("all")) {
                        matches = matches && course.getCategory().equalsIgnoreCase(category);
                    }
                    
                    if (level != null && !level.isEmpty() && !level.equals("all")) {
                        matches = matches && course.getLevel().equalsIgnoreCase(level);
                    }
                    
                    return matches;
                })
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

    @Transactional
    public void deleteCourse(String courseId) {
        // First delete all modules associated with this course
        moduleRepository.deleteByCourseId(courseId);

        // Then delete the course
        courseRepository.deleteById(courseId);
    }

    /**
     * Update course module count (called when modules are added/removed)
     */
    @Transactional
    public void updateCourseModuleCount(String courseId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            long moduleCount = moduleRepository.countByCourseId(courseId);
            course.setModules((int) moduleCount);
            courseRepository.save(course);
        }
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