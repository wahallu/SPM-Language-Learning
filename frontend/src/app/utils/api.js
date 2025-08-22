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
    return {
      'Content-Type': 'application/json',
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

  // Test endpoint for token validation
  static async validateToken() {
    const response = await fetch(`${API_BASE_URL}/test/validate-token`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
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
  }

  // Supervisor Profile APIs
  static async getSupervisorProfile(supervisorId) {
    const response = await fetch(`${API_BASE_URL}/supervisor/profile/${supervisorId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async updateSupervisorProfile(supervisorId, updateData) {
    const response = await fetch(`${API_BASE_URL}/supervisor/profile/${supervisorId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return this.handleResponse(response);
  }

  // Dashboard APIs
  static async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/supervisor/dashboard/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getDashboardActivities() {
    const response = await fetch(`${API_BASE_URL}/supervisor/dashboard/activities`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getPendingReviews() {
    const response = await fetch(`${API_BASE_URL}/supervisor/dashboard/pending-reviews`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Lesson Management APIs
  static async approveLesson(lessonId) {
    const response = await fetch(`${API_BASE_URL}/supervisor/lessons/${lessonId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async rejectLesson(lessonId, reason) {
    const response = await fetch(`${API_BASE_URL}/supervisor/lessons/${lessonId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return this.handleResponse(response);
  }

  // Teachers APIs
  static async getTeachers() {
    const response = await fetch(`${API_BASE_URL}/supervisor/teachers`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Students APIs
  static async getStudents() {
    const response = await fetch(`${API_BASE_URL}/supervisor/students`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Analytics APIs
  static async getAnalyticsData(timeRange = '7d') {
    const response = await fetch(`${API_BASE_URL}/supervisor/analytics?timeRange=${timeRange}`, {
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