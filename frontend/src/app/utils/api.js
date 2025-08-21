const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiService {
  static getAuthHeaders() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  static async handleResponse(response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Something went wrong');
    }
    return response.json();
  }

  // Course APIs
  static async createCourse(courseData) {
    const response = await fetch(`${API_BASE_URL}/courses/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    return this.handleResponse(response);
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
}

export default ApiService;