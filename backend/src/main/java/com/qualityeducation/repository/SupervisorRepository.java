package com.qualityeducation.repository;

import com.qualityeducation.model.Supervisor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface SupervisorRepository extends MongoRepository<Supervisor, String> {
    Optional<Supervisor> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Supervisor> findByStatus(Supervisor.SupervisorStatus status);
    List<Supervisor> findByIsActiveTrue();
    Optional<Supervisor> findByEmployeeId(String employeeId);
    List<Supervisor> findBySpecializationContaining(String specialization);
    List<Supervisor> findByInstitution(String institution);
}
