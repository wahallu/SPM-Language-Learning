const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiService {
  static getAuthHeaders() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');

      return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(userType && { 'X-User-Type': userType })
      };
    }
    const token =
      localStorage.getItem("token") || localStorage.getItem("supervisorToken");
    return {
      'Content-Type': 'application/json',
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async handleResponse(response) {
    if (!response.ok) {
      // Handle different types of errors
      if (response.status === 403) {
        console.warn('403 Forbidden - Token may be invalid or expired');
        // Clear tokens on authentication failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('teacherData');
          localStorage.removeItem('supervisorData');
        }
      }

      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          errorMessage = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
        } catch (textError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      }

      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Utility method to get current user info
  static getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType');
      const token = localStorage.getItem('token');

      if (!token) return null;

      if (userType === 'teacher') {
        const teacherData = localStorage.getItem('teacherData');
        return teacherData ? JSON.parse(teacherData) : null;
      }

      if (userType === 'supervisor') {
        const supervisorData = localStorage.getItem('supervisorData');
        return supervisorData ? JSON.parse(supervisorData) : null;
      }

      return null;
    }
    return null;
  }

  // Authentication APIs
  static async teacherLogin(loginData) {
    const response = await fetch(`${API_BASE_URL}/teacher/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    return this.handleResponse(response);
  }

  static async supervisorLogin(loginData) {
    const response = await fetch(`${API_BASE_URL}/supervisor/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    return this.handleResponse(response);
  }

  // Course APIs
  static async createCourse(courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(courseData),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  }

  static async getCoursesByTeacher(teacherId) {
    const response = await fetch(`${API_BASE_URL}/courses/teacher/${teacherId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getCourseById(courseId) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getAllCourses() {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async updateCourse(courseId, courseData) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    return this.handleResponse(response);
  }

  static async deleteCourse(courseId) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =================== MODULE APIs ===================

  /**
   * Create a new module for a course
   */
  static async createModule(courseId, moduleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(moduleData),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Create module error:', error);
      throw error;
    }
  }

  /**
   * Get all modules for a course
   */
  static async getModulesByCourse(courseId) {
    const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Get a specific module by ID
   */
  static async getModuleById(moduleId) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Update a module
   */
  static async updateModule(moduleId, moduleData) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(moduleData),
    });
    return this.handleResponse(response);
  }

  /**
   * Delete a module
   */
  static async deleteModule(moduleId) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Reorder modules in a course
   */
  static async reorderModules(courseId, reorderData) {
    const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}/reorder`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reorderData),
    });
    return this.handleResponse(response);
  }

  /**
   * Get all modules by teacher
   */
  static async getModulesByTeacher() {
    const response = await fetch(`${API_BASE_URL}/modules/teacher`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Update module status
   */
  static async updateModuleStatus(moduleId, status) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/status?status=${status}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Get next available order for a course
   */
  static async getNextOrderForCourse(courseId) {
    const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}/next-order`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // =================== LESSON APIs ===================

  /**
   * Create a new lesson for a module
   */
  static async createLesson(moduleId, lessonData) {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/modules/${moduleId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(lessonData),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Create lesson error:', error);
      throw error;
    }
  }

  /**
   * Get all lessons for a module
   */
  static async getLessonsByModule(moduleId) {
    const response = await fetch(`${API_BASE_URL}/lessons/modules/${moduleId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Get a specific lesson by ID
   */
  static async getLessonById(lessonId) {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Update a lesson
   */
  static async updateLesson(lessonId, lessonData) {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(lessonData),
    });
    return this.handleResponse(response);
  }

  /**
   * Delete a lesson
   */
  static async deleteLesson(lessonId) {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Search lessons in a course
   */
  static async searchLessons(courseId, searchTerm) {
    const response = await fetch(`${API_BASE_URL}/lessons/search?courseId=${courseId}&searchTerm=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Get lesson statistics for teacher
   */
  static async getLessonStats() {
    const response = await fetch(`${API_BASE_URL}/lessons/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Reorder lessons in a module
   */
  static async reorderLessons(moduleId, lessonIds) {
    const response = await fetch(`${API_BASE_URL}/lessons/modules/${moduleId}/reorder`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ lessonIds }),
    });
    return this.handleResponse(response);
  }

  /**
   * Publish a lesson
   */
  static async publishLesson(lessonId) {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/publish`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Unpublish a lesson
   */
  static async unpublishLesson(lessonId) {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/unpublish`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Teacher Profile APIs
  static async getTeacherProfile(teacherId) {
    const response = await fetch(`${API_BASE_URL}/teacher/profile/${teacherId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async updateTeacherProfile(teacherId, updateData) {
    const response = await fetch(`${API_BASE_URL}/teacher/profile/${teacherId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return this.handleResponse(response);
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("supervisorToken");
      localStorage.removeItem("supervisorData");
      window.location.href = "/Supervisor/login";
      throw new Error("Authentication failed");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Supervisor Profile APIs
  static async getSupervisorProfile(supervisorId) {
    const response = await fetch(
      `${API_BASE_URL}/supervisor/profile/${supervisorId}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  static async updateSupervisorProfile(supervisorId, updateData) {
    const response = await fetch(
      `${API_BASE_URL}/supervisor/profile/${supervisorId}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      }
    );
    return this.handleResponse(response);
  }

  // Dashboard APIs
  static async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/supervisor/dashboard/stats`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getDashboardActivities() {
    const response = await fetch(
      `${API_BASE_URL}/supervisor/dashboard/activities`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  static async getPendingReviews() {
    const response = await fetch(
      `${API_BASE_URL}/supervisor/dashboard/pending-reviews`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // Lesson Management APIs
  static async approveLesson(lessonId) {
    const response = await fetch(
      `${API_BASE_URL}/supervisor/lessons/${lessonId}/approve`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  static async rejectLesson(lessonId, reason) {
    const response = await fetch(
      `${API_BASE_URL}/supervisor/lessons/${lessonId}/reject`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      }
    );
    return this.handleResponse(response);
  }

  // Teachers APIs
  static async getTeachers() {
    const response = await fetch(`${API_BASE_URL}/supervisor/teachers`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Students APIs
  static async getStudents() {
    const response = await fetch(`${API_BASE_URL}/supervisor/students`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Analytics APIs
  static async getAnalyticsData(timeRange = "7d") {
    const response = await fetch(
      `${API_BASE_URL}/supervisor/analytics?timeRange=${timeRange}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // Student Profile APIs
  static async getStudentProfile(studentId) {
    const response = await fetch(
      `${API_BASE_URL}/student/profile/${studentId}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  static async updateStudentProfile(studentId, updateData) {
    const response = await fetch(
      `${API_BASE_URL}/student/profile/${studentId}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      }
    );
    return this.handleResponse(response);
  }

  static async getStudentStats(studentId) {
    const response = await fetch(
      `${API_BASE_URL}/student/profile/${studentId}/stats`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  static async getStudentActivities(studentId) {
    const response = await fetch(
      `${API_BASE_URL}/student/profile/${studentId}/activities`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // =================== STUDENT MANAGEMENT APIs ===================

  /**
   * Get all students enrolled in teacher's courses
   */
  static async getTeacherStudents() {
    const response = await fetch(`${API_BASE_URL}/teacher/students`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Get student details with course progress
   */
  static async getStudentDetails(studentId) {
    const response = await fetch(`${API_BASE_URL}/teacher/students/${studentId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  /**
   * Get student progress in a specific course
   */
  static async getStudentCourseProgress(studentId, courseId) {
    const response = await fetch(`${API_BASE_URL}/teacher/students/${studentId}/courses/${courseId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Logout utility
  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('teacherToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('teacherData');
      localStorage.removeItem('supervisorData');
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Get user type
  static getUserType() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userType');
    }
    return null;
  }
}

export default ApiService;
