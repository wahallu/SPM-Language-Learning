package com.qualityeducation.repository;

import com.qualityeducation.model.Module;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends MongoRepository<Module, String> {

    // Find all modules for a specific course, ordered by module order
    List<Module> findByCourseIdOrderByOrderAsc(String courseId);

    // Find all modules for a specific course with a specific status
    List<Module> findByCourseIdAndStatusOrderByOrderAsc(String courseId, Module.ModuleStatus status);

    // Find all modules created by a specific teacher
    List<Module> findByTeacherIdOrderByCreatedAtDesc(String teacherId);

    // Find modules by course and teacher
    List<Module> findByCourseIdAndTeacherIdOrderByOrderAsc(String courseId, String teacherId);

    // Check if a module exists with a specific order in a course
    boolean existsByCourseIdAndOrder(String courseId, Integer order);

    // Find module by course ID and order
    Optional<Module> findByCourseIdAndOrder(String courseId, Integer order);

    // Count modules in a course
    long countByCourseId(String courseId);

    // Count modules by teacher
    long countByTeacherId(String teacherId);

    // Count modules by status
    long countByStatus(Module.ModuleStatus status);

    // Find modules with status and teacher
    List<Module> findByTeacherIdAndStatusOrderByCreatedAtDesc(String teacherId, Module.ModuleStatus status);

    // Custom query to find modules with lessons count
    @Query("{'courseId': ?0}")
    List<Module> findModulesWithLessonCountByCourseId(String courseId);

    // Find modules by title containing (case-insensitive search)
    @Query("{'courseId': ?0, 'title': {$regex: ?1, $options: 'i'}}")
    List<Module> findByCourseIdAndTitleContainingIgnoreCase(String courseId, String title);

    // Find all modules that need review (status = UNDER_REVIEW)
    List<Module> findByStatusOrderByCreatedAtAsc(Module.ModuleStatus status);

    // Find modules created within a date range
    @Query("{'teacherId': ?0, 'createdAt': {$gte: ?1, $lte: ?2}}")
    List<Module> findByTeacherIdAndCreatedAtBetween(String teacherId, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);

    // Find modules with minimum lessons count
    @Query("{'courseId': ?0, 'totalLessons': {$gte: ?1}}")
    List<Module> findByCourseIdAndTotalLessonsGreaterThanEqual(String courseId, Integer minLessons);

    // Delete all modules for a course (cascade delete)
    void deleteByCourseId(String courseId);

    // Get the highest order number for a course (for determining next order)
    @Query(value = "{'courseId': ?0}", sort = "{'order': -1}")
    Optional<Module> findTopByCourseIdOrderByOrderDesc(String courseId);
}