package com.qualityeducation.repository;

import com.qualityeducation.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    
    // Find all enrollments for a specific student
    List<Enrollment> findByStudentId(String studentId);
    
    // Find all enrollments for a specific course
    List<Enrollment> findByCourseId(String courseId);
    
    // Find all enrollments for courses taught by a teacher
    List<Enrollment> findByTeacherId(String teacherId);
    
    // Find specific enrollment
    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, String courseId);
    
    // Find students by teacher and course
    List<Enrollment> findByTeacherIdAndCourseId(String teacherId, String courseId);
    
    // Find enrollments by status
    List<Enrollment> findByTeacherIdAndStatus(String teacherId, String status);
    
    // Count students for a teacher
    @Query(value = "{'teacherId': ?0}", count = true)
    long countByTeacherId(String teacherId);
    
    // Count students for a course
    @Query(value = "{'courseId': ?0}", count = true)
    long countByCourseId(String courseId);
    
    // Find active enrollments
    @Query("{'teacherId': ?0, 'status': 'active'}")
    List<Enrollment> findActiveEnrollmentsByTeacher(String teacherId);
    
    // Find completed enrollments
    @Query("{'teacherId': ?0, 'status': 'completed'}")
    List<Enrollment> findCompletedEnrollmentsByTeacher(String teacherId);
    
    // Find at-risk students
    @Query("{'teacherId': ?0, 'status': 'at-risk'}")
    List<Enrollment> findAtRiskEnrollmentsByTeacher(String teacherId);
    
    // Delete by course
    void deleteByCourseId(String courseId);
    
    // Delete by student
    void deleteByStudentId(String studentId);
}