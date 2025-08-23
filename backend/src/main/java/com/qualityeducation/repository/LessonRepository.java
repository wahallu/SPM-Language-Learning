package com.qualityeducation.repository;

import com.qualityeducation.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {

    // Find lessons by module
    List<Lesson> findByModuleIdOrderByOrderAsc(String moduleId);

    // Find lessons by course
    List<Lesson> findByCourseIdOrderByOrderAsc(String courseId);

    // Find lessons by teacher
    List<Lesson> findByTeacherIdOrderByCreatedAtDesc(String teacherId);

    // Find lessons by status
    List<Lesson> findByStatusOrderByCreatedAtDesc(Lesson.LessonStatus status);

    // Find lessons by module and status
    List<Lesson> findByModuleIdAndStatusOrderByOrderAsc(String moduleId, Lesson.LessonStatus status);

    // Find lessons by course and status
    List<Lesson> findByCourseIdAndStatusOrderByOrderAsc(String courseId, Lesson.LessonStatus status);

    // Find lessons by teacher and status
    List<Lesson> findByTeacherIdAndStatusOrderByCreatedAtDesc(String teacherId, Lesson.LessonStatus status);

    // Check if lesson exists by title within module
    boolean existsByModuleIdAndTitleIgnoreCase(String moduleId, String title);

    // Check if lesson exists by order within module
    boolean existsByModuleIdAndOrder(String moduleId, Integer order);

    // Find lesson by module and order
    Optional<Lesson> findByModuleIdAndOrder(String moduleId, Integer order);

    // Count lessons by module
    long countByModuleId(String moduleId);

    // Count lessons by course
    long countByCourseId(String courseId);

    // Count lessons by teacher
    long countByTeacherId(String teacherId);

    // Count lessons by status
    long countByStatus(Lesson.LessonStatus status);

    // Count lessons by module and status
    long countByModuleIdAndStatus(String moduleId, Lesson.LessonStatus status);

    // Find lessons created after a certain date
    List<Lesson> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);

    // Find lessons by teacher created after a certain date
    List<Lesson> findByTeacherIdAndCreatedAtAfterOrderByCreatedAtDesc(String teacherId, LocalDateTime date);

    // Search lessons by title or description
    @Query("{'$or': [{'title': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}")
    List<Lesson> findByTitleOrDescriptionContainingIgnoreCase(String searchTerm);

    // Search lessons by title or description within a course
    @Query("{'courseId': ?0, '$or': [{'title': {$regex: ?1, $options: 'i'}}, {'description': {$regex: ?1, $options: 'i'}}]}")
    List<Lesson> findByCourseIdAndTitleOrDescriptionContainingIgnoreCase(String courseId, String searchTerm);

    // Find lessons with high ratings
    @Query("{'averageRating': {$gte: ?0}}")
    List<Lesson> findByAverageRatingGreaterThanEqual(Double minRating);

    // Find most popular lessons (by views)
    @Query(value = "{}", sort = "{'views': -1}")
    List<Lesson> findTopByViews();

    // Find recently updated lessons
    @Query(value = "{'updatedAt': {$ne: null}}", sort = "{'updatedAt': -1}")
    List<Lesson> findRecentlyUpdated();

    // Find lessons by tags
    @Query("{'tags': {$in: ?0}}")
    List<Lesson> findByTagsIn(List<String> tags);

    // Find lessons by difficulty
    List<Lesson> findByDifficultyOrderByCreatedAtDesc(String difficulty);

    // Find lessons by language
    List<Lesson> findByLanguageOrderByCreatedAtDesc(String language);

    // Find lessons with quizzes
    @Query("{'quizzes': {$exists: true, $not: {$size: 0}}}")
    List<Lesson> findLessonsWithQuizzes();

    // Find lessons without quizzes
    @Query("{'$or': [{'quizzes': {$exists: false}}, {'quizzes': {$size: 0}}]}")
    List<Lesson> findLessonsWithoutQuizzes();

    // Find lessons by module with quiz count
    @Query("{'moduleId': ?0}")
    List<Lesson> findByModuleIdWithQuizCount(String moduleId);

    // Advanced search with multiple criteria
    @Query("{'$and': [" +
            "{'courseId': ?0}, " +
            "{'status': ?1}, " +
            "{'$or': [{'title': {$regex: ?2, $options: 'i'}}, {'description': {$regex: ?2, $options: 'i'}}]}" +
            "]}")
    List<Lesson> findByCourseIdAndStatusAndSearchTerm(String courseId, Lesson.LessonStatus status, String searchTerm);

    // Get lessons statistics for a teacher
    @Query(value = "{'teacherId': ?0}", count = true)
    long countLessonsByTeacher(String teacherId);

    // Get total views for a teacher's lessons
    @Query("{'teacherId': ?0}")
    List<Lesson> findByTeacherIdForStats(String teacherId);

    // Delete lessons by module (cascade delete)
    void deleteByModuleId(String moduleId);

    // Delete lessons by course (cascade delete)
    void deleteByCourseId(String courseId);

    // Find lessons that need review (draft status older than X days)
    @Query("{'status': 'DRAFT', 'createdAt': {$lt: ?0}}")
    List<Lesson> findDraftLessonsOlderThan(LocalDateTime date);
}