package com.qualityeducation.service;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.Module;
import com.qualityeducation.model.Course;
import com.qualityeducation.repository.ModuleRepository;
import com.qualityeducation.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    /**
     * Create a new module for a course
     */
    @Transactional
    public ApiResponse<ModuleResponse> createModule(String courseId, ModuleRequest request, String teacherId) {
        try {
            log.info("Creating module for course {} by teacher {}", courseId, teacherId);

            // Verify course exists and belongs to teacher
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                return ApiResponse.error("Course not found");
            }

            Course course = courseOpt.get();
            if (!course.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to create modules for this course");
            }

            // Check if order already exists
            if (moduleRepository.existsByCourseIdAndOrder(courseId, request.getOrder())) {
                return ApiResponse.error("A module with order " + request.getOrder() + " already exists");
            }

            // Create module
            Module module = Module.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .duration(request.getDuration())
                    .order(request.getOrder())
                    .courseId(courseId)
                    .teacherId(teacherId)
                    .status(Module.ModuleStatus.DRAFT)
                    .coverImage(request.getCoverImage())
                    .learningObjectives(request.getLearningObjectives())
                    .prerequisites(request.getPrerequisites())
                    .createdAt(LocalDateTime.now())
                    .totalLessons(0)
                    .completedLessons(0)
                    .totalDurationMinutes(0)
                    .build();

            Module savedModule = moduleRepository.save(module);

            // Update course modules count
            course.setModules(course.getModules() + 1);
            courseRepository.save(course);

            ModuleResponse response = ModuleResponse.fromModule(savedModule);
            log.info("Module created successfully with ID: {}", savedModule.getId());

            return ApiResponse.success("Module created successfully", response);

        } catch (Exception e) {
            log.error("Error creating module for course {}: {}", courseId, e.getMessage(), e);
            return ApiResponse.error("Failed to create module", e.getMessage());
        }
    }

    /**
     * Get all modules for a course
     */
    public ApiResponse<List<ModuleResponse>> getModulesByCourse(String courseId, String teacherId) {
        try {
            log.info("Fetching modules for course {} by teacher {}", courseId, teacherId);

            // Verify course access
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                return ApiResponse.error("Course not found");
            }

            Course course = courseOpt.get();
            if (!course.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to view modules for this course");
            }

            List<Module> modules = moduleRepository.findByCourseIdOrderByOrderAsc(courseId);
            List<ModuleResponse> responses = modules.stream()
                    .map(ModuleResponse::fromModule)
                    .collect(Collectors.toList());

            return ApiResponse.success("Modules retrieved successfully", responses);

        } catch (Exception e) {
            log.error("Error fetching modules for course {}: {}", courseId, e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve modules", e.getMessage());
        }
    }

    /**
     * Get a specific module by ID
     */
    public ApiResponse<ModuleResponse> getModuleById(String moduleId, String teacherId) {
        try {
            log.info("Fetching module {} by teacher {}", moduleId, teacherId);

            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isEmpty()) {
                return ApiResponse.error("Module not found");
            }

            Module module = moduleOpt.get();
            if (!module.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to view this module");
            }

            ModuleResponse response = ModuleResponse.fromModule(module);
            return ApiResponse.success("Module retrieved successfully", response);

        } catch (Exception e) {
            log.error("Error fetching module {}: {}", moduleId, e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve module", e.getMessage());
        }
    }

    /**
     * Update a module
     */
    @Transactional
    public ApiResponse<ModuleResponse> updateModule(String moduleId, ModuleUpdateRequest request, String teacherId) {
        try {
            log.info("Updating module {} by teacher {}", moduleId, teacherId);

            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isEmpty()) {
                return ApiResponse.error("Module not found");
            }

            Module module = moduleOpt.get();
            if (!module.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to update this module");
            }

            // Check if new order conflicts with existing modules
            if (request.getOrder() != null && !request.getOrder().equals(module.getOrder())) {
                if (moduleRepository.existsByCourseIdAndOrder(module.getCourseId(), request.getOrder())) {
                    return ApiResponse.error("A module with order " + request.getOrder() + " already exists");
                }
            }

            // Update fields
            if (request.getTitle() != null) {
                module.setTitle(request.getTitle());
            }
            if (request.getDescription() != null) {
                module.setDescription(request.getDescription());
            }
            if (request.getDuration() != null) {
                module.setDuration(request.getDuration());
            }
            if (request.getOrder() != null) {
                module.setOrder(request.getOrder());
            }
            if (request.getCoverImage() != null) {
                module.setCoverImage(request.getCoverImage());
            }
            if (request.getLearningObjectives() != null) {
                module.setLearningObjectives(request.getLearningObjectives());
            }
            if (request.getPrerequisites() != null) {
                module.setPrerequisites(request.getPrerequisites());
            }
            if (request.getStatus() != null) {
                module.setStatus(request.getStatus());
            }

            module.setUpdatedAt(LocalDateTime.now());
            Module savedModule = moduleRepository.save(module);

            ModuleResponse response = ModuleResponse.fromModule(savedModule);
            log.info("Module updated successfully: {}", moduleId);

            return ApiResponse.success("Module updated successfully", response);

        } catch (Exception e) {
            log.error("Error updating module {}: {}", moduleId, e.getMessage(), e);
            return ApiResponse.error("Failed to update module", e.getMessage());
        }
    }

    /**
     * Delete a module
     */
    @Transactional
    public ApiResponse<Void> deleteModule(String moduleId, String teacherId) {
        try {
            log.info("Deleting module {} by teacher {}", moduleId, teacherId);

            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isEmpty()) {
                return ApiResponse.error("Module not found");
            }

            Module module = moduleOpt.get();
            if (!module.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to delete this module");
            }

            // Check if module has lessons
            if (module.getTotalLessons() > 0) {
                return ApiResponse.error("Cannot delete module that contains lessons. Please delete all lessons first.");
            }

            // Update course modules count
            Optional<Course> courseOpt = courseRepository.findById(module.getCourseId());
            if (courseOpt.isPresent()) {
                Course course = courseOpt.get();
                course.setModules(Math.max(0, course.getModules() - 1));
                courseRepository.save(course);
            }

            moduleRepository.deleteById(moduleId);
            log.info("Module deleted successfully: {}", moduleId);

            return ApiResponse.success("Module deleted successfully");

        } catch (Exception e) {
            log.error("Error deleting module {}: {}", moduleId, e.getMessage(), e);
            return ApiResponse.error("Failed to delete module", e.getMessage());
        }
    }

    /**
     * Reorder modules in a course
     */
    @Transactional
    public ApiResponse<List<ModuleResponse>> reorderModules(String courseId, ModuleReorderRequest request, String teacherId) {
        try {
            log.info("Reordering modules for course {} by teacher {}", courseId, teacherId);

            // Verify course access
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                return ApiResponse.error("Course not found");
            }

            Course course = courseOpt.get();
            if (!course.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to reorder modules for this course");
            }

            // Validate all modules belong to the course
            List<String> moduleIds = request.getModuleOrders().stream()
                    .map(ModuleReorderRequest.ModuleOrderItem::getModuleId)
                    .collect(Collectors.toList());

            List<Module> modules = moduleRepository.findAllById(moduleIds);

            if (modules.size() != moduleIds.size()) {
                return ApiResponse.error("Some modules not found");
            }

            boolean allBelongToCourse = modules.stream()
                    .allMatch(module -> module.getCourseId().equals(courseId) && module.getTeacherId().equals(teacherId));

            if (!allBelongToCourse) {
                return ApiResponse.error("All modules must belong to the specified course");
            }

            // Update orders
            for (ModuleReorderRequest.ModuleOrderItem orderItem : request.getModuleOrders()) {
                Optional<Module> moduleOpt = modules.stream()
                        .filter(m -> m.getId().equals(orderItem.getModuleId()))
                        .findFirst();

                if (moduleOpt.isPresent()) {
                    Module module = moduleOpt.get();
                    module.setOrder(orderItem.getOrder());
                    module.setUpdatedAt(LocalDateTime.now());
                }
            }

            List<Module> savedModules = moduleRepository.saveAll(modules);
            List<ModuleResponse> responses = savedModules.stream()
                    .map(ModuleResponse::fromModule)
                    .sorted((a, b) -> a.getOrder().compareTo(b.getOrder()))
                    .collect(Collectors.toList());

            log.info("Modules reordered successfully for course: {}", courseId);
            return ApiResponse.success("Modules reordered successfully", responses);

        } catch (Exception e) {
            log.error("Error reordering modules for course {}: {}", courseId, e.getMessage(), e);
            return ApiResponse.error("Failed to reorder modules", e.getMessage());
        }
    }

    /**
     * Get modules by teacher (across all courses)
     */
    public ApiResponse<List<ModuleResponse>> getModulesByTeacher(String teacherId) {
        try {
            log.info("Fetching all modules for teacher {}", teacherId);

            List<Module> modules = moduleRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId);
            List<ModuleResponse> responses = modules.stream()
                    .map(ModuleResponse::fromModule)
                    .collect(Collectors.toList());

            return ApiResponse.success("Modules retrieved successfully", responses);

        } catch (Exception e) {
            log.error("Error fetching modules for teacher {}: {}", teacherId, e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve modules", e.getMessage());
        }
    }

    /**
     * Get next available order for a course
     */
    public int getNextOrderForCourse(String courseId) {
        Optional<Module> lastModule = moduleRepository.findTopByCourseIdOrderByOrderDesc(courseId);
        return lastModule.map(module -> module.getOrder() + 1).orElse(1);
    }

    /**
     * Update module lesson count (called when lessons are added/removed)
     */
    @Transactional
    public void updateModuleLessonCount(String moduleId, int lessonCount) {
        Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
        if (moduleOpt.isPresent()) {
            Module module = moduleOpt.get();
            module.setTotalLessons(lessonCount);
            module.setUpdatedAt(LocalDateTime.now());
            moduleRepository.save(module);
        }
    }

    /**
     * Update module status
     */
    @Transactional
    public ApiResponse<ModuleResponse> updateModuleStatus(String moduleId, Module.ModuleStatus status, String teacherId) {
        try {
            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isEmpty()) {
                return ApiResponse.error("Module not found");
            }

            Module module = moduleOpt.get();
            if (!module.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to update this module");
            }

            module.setStatus(status);
            module.setUpdatedAt(LocalDateTime.now());
            Module savedModule = moduleRepository.save(module);

            ModuleResponse response = ModuleResponse.fromModule(savedModule);
            return ApiResponse.success("Module status updated successfully", response);

        } catch (Exception e) {
            log.error("Error updating module status {}: {}", moduleId, e.getMessage(), e);
            return ApiResponse.error("Failed to update module status", e.getMessage());
        }
    }
}