package com.qualityeducation.service;

import com.qualityeducation.model.Course;
import com.qualityeducation.model.Enrollment;
import com.qualityeducation.model.Lesson;
import com.qualityeducation.model.Module;
import com.qualityeducation.model.User;
import com.qualityeducation.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Utility service to create sample enrollment data
 * Call this manually or through an endpoint for testing
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentInitializationService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final Random random = new Random();
    
    /**
     * Create sample enrollments for testing
     */
    public void createSampleEnrollments(String teacherId) {
        try {
            log.info("Creating sample enrollments for teacher: {}", teacherId);
            
            // Get teacher's courses
            List<Course> courses = courseRepository.findByTeacherId(teacherId);
            if (courses.isEmpty()) {
                log.warn("No courses found for teacher: {}", teacherId);
                return;
            }
            
            // Get some users (students)
            List<User> students = userRepository.findAll().stream()
                    .limit(10) // Limit to 10 students
                    .toList();
            
            if (students.isEmpty()) {
                log.warn("No students found in database");
                return;
            }
            
            // Create enrollments
            for (User student : students) {
                // Enroll in 1-3 random courses
                int numCourses = random.nextInt(3) + 1;
                List<Course> selectedCourses = courses.stream()
                        .limit(Math.min(numCourses, courses.size()))
                        .toList();
                
                for (Course course : selectedCourses) {
                    createEnrollment(student, course, teacherId);
                }
            }
            
            log.info("Sample enrollments created successfully");
            
        } catch (Exception e) {
            log.error("Error creating sample enrollments", e);
        }
    }
    
    private void createEnrollment(User student, Course course, String teacherId) {
        // Check if already enrolled
        if (enrollmentRepository.findByStudentIdAndCourseId(student.getId(), course.getId()).isPresent()) {
            return;
        }
        
        // Get modules and lessons
        List<Module> modules = moduleRepository.findByCourseIdOrderByOrderAsc(course.getId());
        List<Lesson> allLessons = new ArrayList<>();
        for (Module module : modules) {
            allLessons.addAll(lessonRepository.findByModuleIdOrderByOrderAsc(module.getId()));
        }
        
        int totalLessons = allLessons.size();
        if (totalLessons == 0) {
            log.warn("No lessons found for course: {}", course.getId());
            return;
        }
        
        // Random progress
        int completedLessons = random.nextInt(totalLessons + 1);
        int progress = totalLessons > 0 ? (completedLessons * 100 / totalLessons) : 0;
        
        // Create lesson progress
        List<Enrollment.LessonProgress> lessonProgressList = new ArrayList<>();
        for (int i = 0; i < completedLessons && i < allLessons.size(); i++) {
            Lesson lesson = allLessons.get(i);
            lessonProgressList.add(Enrollment.LessonProgress.builder()
                    .lessonId(lesson.getId())
                    .completed(true)
                    .progress(100)
                    .startedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .completedAt(LocalDateTime.now().minusDays(random.nextInt(15)))
                    .quizScore(random.nextInt(40) + 60) // 60-100
                    .attempts(random.nextInt(3) + 1)
                    .timeSpent(random.nextInt(60) + 15) // 15-75 minutes
                    .build());
        }
        
        // Create quiz stats
        double averageScore = lessonProgressList.isEmpty() ? 0.0 : 
                lessonProgressList.stream()
                        .mapToInt(Enrollment.LessonProgress::getQuizScore)
                        .average()
                        .orElse(0.0);
        
        Enrollment.QuizStats quizStats = Enrollment.QuizStats.builder()
                .totalQuizzes(completedLessons)
                .completedQuizzes(completedLessons)
                .averageScore(averageScore)
                .bestScore(lessonProgressList.stream()
                        .mapToInt(Enrollment.LessonProgress::getQuizScore)
                        .max()
                        .orElse(0))
                .totalAttempts(lessonProgressList.stream()
                        .mapToInt(Enrollment.LessonProgress::getAttempts)
                        .sum())
                .build();
        
        // Determine status
        String status;
        if (progress == 100) {
            status = "completed";
        } else if (progress > 0) {
            status = random.nextDouble() < 0.1 ? "at-risk" : "active";
        } else {
            status = "active";
        }
        
        // Create enrollment
        Enrollment enrollment = Enrollment.builder()
                .studentId(student.getId())
                .courseId(course.getId())
                .teacherId(teacherId)
                .enrolledDate(LocalDateTime.now().minusDays(random.nextInt(90)))
                .progress(progress)
                .status(status)
                .completedLessons(completedLessons)
                .totalLessons(totalLessons)
                .lastActivity(LocalDateTime.now().minusDays(random.nextInt(7)))
                .lessonProgress(lessonProgressList)
                .quizStats(quizStats)
                .currentStreak(random.nextInt(15))
                .totalTimeSpent(lessonProgressList.stream()
                        .mapToInt(Enrollment.LessonProgress::getTimeSpent)
                        .sum())
                .build();
        
        enrollment.updateProgress(); // This will calculate the grade
        
        enrollmentRepository.save(enrollment);
        log.info("Created enrollment for student {} in course {}", student.getEmail(), course.getTitle());
    }
}