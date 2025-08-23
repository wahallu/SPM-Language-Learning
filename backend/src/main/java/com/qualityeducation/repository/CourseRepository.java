package com.qualityeducation.repository;

import com.qualityeducation.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByTeacherId(String teacherId);

    List<Course> findByStatus(String status);

    List<Course> findByCategory(String category);
}
