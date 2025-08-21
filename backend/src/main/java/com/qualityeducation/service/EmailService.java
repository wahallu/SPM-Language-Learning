package com.qualityeducation.service;

import com.qualityeducation.model.Supervisor;
import com.qualityeducation.model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    // Generic email sending method
    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        
        mailSender.send(message);
    }
    
    // SUPERVISOR EMAIL METHODS
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
    
    public void sendSupervisorWelcomeEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to Quality Education Platform - Supervisor Access Granted");
        message.setText("Dear " + firstName + ",\n\n" +
                        "Welcome to the Quality Education Platform! Your supervisor account has been successfully created.\n\n" +
                        "You can now access the supervisor dashboard at: http://localhost:3000/Supervisor/login\n\n" +
                        "Use your registered email and password to log in and start managing lesson approvals and quality control.\n\n" +
                        "Key features available to you:\n" +
                        "- Review and approve teacher-submitted lessons\n" +
                        "- Monitor content quality and standards\n" +
                        "- Manage teacher accounts and permissions\n" +
                        "- Generate performance reports\n\n" +
                        "If you have any questions, please don't hesitate to contact our support team.\n\n" +
                        "Best regards,\n" +
                        "Quality Education Team");
        
        mailSender.send(message);
    }
    
    // TEACHER EMAIL METHODS
    public void sendTeacherRegistrationNotification(Teacher teacher) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("admin@qualityeducation.com"); // Admin email
        message.setSubject("New Teacher Registration - " + teacher.getFirstName() + " " + teacher.getLastName());
        message.setText("A new teacher has registered and requires approval:\n\n" +
                        "Name: " + teacher.getFirstName() + " " + teacher.getLastName() + "\n" +
                        "Email: " + teacher.getEmail() + "\n" +
                        "Phone: " + teacher.getPhone() + "\n" +
                        "Institution: " + teacher.getInstitution() + "\n" +
                        "Department: " + teacher.getDepartment() + "\n" +
                        "Qualifications: " + teacher.getQualifications() + "\n" +
                        "Experience: " + teacher.getExperience() + " years\n" +
                        "Specializations: " + String.join(", ", teacher.getSpecialization()) + "\n\n" +
                        "Please review the application in the supervisor dashboard.");
        
        mailSender.send(message);
    }
    
    public void sendTeacherRegistrationConfirmation(Teacher teacher) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(teacher.getEmail());
        message.setSubject("Teacher Registration Confirmation - ZorsCode Academy");
        message.setText("Dear " + teacher.getFirstName() + ",\n\n" +
                        "Thank you for applying to become a teacher at ZorsCode Academy!\n\n" +
                        "Your application has been received and is currently under review. " +
                        "Our team will carefully evaluate your qualifications and experience.\n\n" +
                        "You will receive an email notification once your application has been processed. " +
                        "This typically takes 3-5 business days.\n\n" +
                        "Application Details:\n" +
                        "- Institution: " + teacher.getInstitution() + "\n" +
                        "- Department: " + teacher.getDepartment() + "\n" +
                        "- Specializations: " + String.join(", ", teacher.getSpecialization()) + "\n" +
                        "- Experience: " + teacher.getExperience() + "\n\n" +
                        "If you have any questions, please don't hesitate to contact our support team.\n\n" +
                        "Best regards,\n" +
                        "ZorsCode Academy Team");
        
        mailSender.send(message);
    }
    
    public void sendTeacherApprovalEmail(Teacher teacher) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(teacher.getEmail());
        message.setSubject("Teacher Application Approved - Welcome to ZorsCode Academy!");
        message.setText("Dear " + teacher.getFirstName() + ",\n\n" +
                        "Congratulations! Your teacher application has been approved.\n\n" +
                        "You can now access your teacher dashboard and start creating courses:\n" +
                        "Login URL: http://localhost:3000/teacher/login\n\n" +
                        "Key features available to you:\n" +
                        "- Create and manage courses\n" +
                        "- Upload educational content\n" +
                        "- Track student progress\n" +
                        "- Communicate with students\n" +
                        "- Access teaching resources\n\n" +
                        "Welcome to the ZorsCode Academy teaching community!\n\n" +
                        "Best regards,\n" +
                        "ZorsCode Academy Team");
        
        mailSender.send(message);
    }
    
    public void sendTeacherRejectionEmail(Teacher teacher, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(teacher.getEmail());
        message.setSubject("Teacher Application Update - ZorsCode Academy");
        message.setText("Dear " + teacher.getFirstName() + ",\n\n" +
                        "Thank you for your interest in becoming a teacher at ZorsCode Academy.\n\n" +
                        "After careful review, we regret to inform you that your application has not been approved at this time.\n\n" +
                        (reason != null && !reason.trim().isEmpty() ? "Reason: " + reason + "\n\n" : "") +
                        "We encourage you to:\n" +
                        "- Review our teacher requirements\n" +
                        "- Gain additional qualifications or experience\n" +
                        "- Reapply in the future with updated credentials\n\n" +
                        "If you have any questions about this decision, please contact our support team.\n\n" +
                        "Best regards,\n" +
                        "ZorsCode Academy Team");
        
        mailSender.send(message);
    }
    
    public void sendTeacherPasswordResetEmail(Teacher teacher, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(teacher.getEmail());
        message.setSubject("Password Reset Request - ZorsCode Academy");
        String resetLink = "http://localhost:3000/teacher/reset-password?token=" + resetToken;
        message.setText("Dear " + teacher.getFirstName() + ",\n\n" +
                        "You have requested to reset your password for your ZorsCode Academy teacher account.\n\n" +
                        "Click the link below to reset your password:\n" +
                        resetLink + "\n\n" +
                        "This link will expire in 1 hour for security purposes.\n\n" +
                        "If you did not request this password reset, please ignore this email and your password will remain unchanged.\n\n" +
                        "For security reasons, please do not share this link with anyone.\n\n" +
                        "Best regards,\n" +
                        "ZorsCode Academy Team");
        
        mailSender.send(message);
    }
    
    public void sendTeacherWelcomeEmail(Teacher teacher) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(teacher.getEmail());
        message.setSubject("Welcome to ZorsCode Academy - Teacher Dashboard Access");
        message.setText("Dear " + teacher.getFirstName() + ",\n\n" +
                        "Welcome to ZorsCode Academy! Your teacher account is now active and ready to use.\n\n" +
                        "Access your teacher dashboard at: http://localhost:3000/teacher/login\n\n" +
                        "Getting Started:\n" +
                        "1. Complete your profile information\n" +
                        "2. Upload a professional profile picture\n" +
                        "3. Create your first course\n" +
                        "4. Set up your teaching schedule\n\n" +
                        "Resources available to you:\n" +
                        "- Teacher guidelines and best practices\n" +
                        "- Content creation tools\n" +
                        "- Student engagement features\n" +
                        "- Performance analytics\n" +
                        "- 24/7 technical support\n\n" +
                        "We're excited to have you as part of our teaching community!\n\n" +
                        "Best regards,\n" +
                        "ZorsCode Academy Team");
        
        mailSender.send(message);
    }
    
    public void sendTeacherStatusChangeNotification(Teacher teacher, Teacher.TeacherStatus oldStatus, Teacher.TeacherStatus newStatus) {
        String statusMessage = switch (newStatus) {
            case ACTIVE -> "Your account has been activated and you can now access all teaching features.";
            case SUSPENDED -> "Your account has been temporarily suspended. Please contact support for more information.";
            case PENDING -> "Your account status has been changed to pending review.";
            case APPROVED -> "Your account has been approved! You can now start teaching.";
            case REJECTED -> "Your account application has been reviewed.";
        };
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(teacher.getEmail());
        message.setSubject("Account Status Update - ZorsCode Academy");
        message.setText("Dear " + teacher.getFirstName() + ",\n\n" +
                        "Your ZorsCode Academy teacher account status has been updated.\n\n" +
                        "Previous Status: " + oldStatus.name() + "\n" +
                        "Current Status: " + newStatus.name() + "\n\n" +
                        statusMessage + "\n\n" +
                        "If you have any questions about this change, please contact our support team.\n\n" +
                        "Best regards,\n" +
                        "ZorsCode Academy Team");
        
        mailSender.send(message);
    }
}