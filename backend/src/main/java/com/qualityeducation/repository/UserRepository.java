package com.qualityeducation.repository;

import com.qualityeducation.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByResetToken(String resetToken);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}