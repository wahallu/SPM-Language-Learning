package com.qualityeducation.repository;

import com.qualityeducation.model.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends MongoRepository<Teacher, String> {
    
    Optional<Teacher> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<Teacher> findByStatus(Teacher.TeacherStatus status);
    
    @Query("{'specialization': {$in: ?0}}")
    List<Teacher> findBySpecializationIn(List<String> specializations);
    
    @Query("{'status': ?0, 'specialization': {$in: ?1}}")
    List<Teacher> findByStatusAndSpecializationIn(Teacher.TeacherStatus status, List<String> specializations);
    
    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}}]}")
    List<Teacher> findBySearchTerm(String searchTerm);
    
    @Query("{'status': ?0, '$or': [{'firstName': {$regex: ?1, $options: 'i'}}, {'lastName': {$regex: ?1, $options: 'i'}}, {'email': {$regex: ?1, $options: 'i'}}]}")
    List<Teacher> findByStatusAndSearchTerm(Teacher.TeacherStatus status, String searchTerm);
    
    Optional<Teacher> findByResetPasswordToken(String token);
    
    long countByStatus(Teacher.TeacherStatus status);
    
    @Query(value = "{}", sort = "{'rating': -1}")
    List<Teacher> findTopRatedTeachers();
    
    @Query(value = "{'status': 'APPROVED'}", sort = "{'createdAt': -1}")
    List<Teacher> findRecentApprovedTeachers();
}