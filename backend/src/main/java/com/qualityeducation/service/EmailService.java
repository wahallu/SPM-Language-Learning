package com.qualityeducation.service;

import com.qualityeducation.model.Supervisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n" + resetLink + 
                         "\n\nIf you did not request a password reset, please ignore this email.");
        
        mailSender.send(message);
    }
    
    public void sendSupervisorRegistrationNotification(Supervisor supervisor) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("admin@qualityeducation.com"); // Admin email
        message.setSubject("New Supervisor Registration - " + supervisor.getFirstName() + " " + supervisor.getLastName());
        message.setText("A new supervisor has registered and requires approval:\n\n" +
                        "Name: " + supervisor.getFirstName() + " " + supervisor.getLastName() + "\n" +
                        "Email: " + supervisor.getEmail() + "\n" +
                        "Institution: " + supervisor.getInstitution() + "\n" +
                        "Department: " + supervisor.getDepartment() + "\n" +
                        "Specializations: " + String.join(", ", supervisor.getSpecialization()) + "\n\n" +
                        "Please review the application in the admin dashboard.");
        
        mailSender.send(message);
    }
    
    public void sendSupervisorRegistrationConfirmation(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Supervisor Registration Received - Quality Education Platform");
        message.setText("Dear " + firstName + ",\n\n" +
                        "Thank you for applying to become a supervisor on our Quality Education Platform.\n\n" +
                        "Your registration has been received and is currently under review by our admin team. " +
                        "You will receive an email notification within 3-5 business days regarding the status of your application.\n\n" +
                        "If you have any questions, please don't hesitate to contact our support team.\n\n" +
                        "Best regards,\n" +
                        "Quality Education Team");
        
        mailSender.send(message);
    }
    
    public void sendSupervisorApprovalEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Supervisor Application Approved - Quality Education Platform");
        message.setText("Dear " + firstName + ",\n\n" +
                        "Congratulations! Your supervisor application has been approved.\n\n" +
                        "You can now access the supervisor dashboard at: http://localhost:3000/Supervisor/login\n\n" +
                        "Use your registered email and password to log in and start managing lesson approvals and quality control.\n\n" +
                        "Welcome to the Quality Education Platform!\n\n" +
                        "Best regards,\n" +
                        "Quality Education Team");
        
        mailSender.send(message);
    }
    
    public void sendSupervisorRejectionEmail(String toEmail, String firstName, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Supervisor Application Update - Quality Education Platform");
        message.setText("Dear " + firstName + ",\n\n" +
                        "Thank you for your interest in becoming a supervisor on our Quality Education Platform.\n\n" +
                        "After careful review, we are unable to approve your application at this time.\n\n" +
                        (reason != null && !reason.trim().isEmpty() ? "Reason: " + reason + "\n\n" : "") +
                        "You are welcome to reapply in the future when you meet our requirements.\n\n" +
                        "If you have any questions, please contact our support team.\n\n" +
                        "Best regards,\n" +
                        "Quality Education Team");
        
        mailSender.send(message);
    }
}