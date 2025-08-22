const API_BASE_URL = "http://localhost:8080/api";

class ApiService {
  static getAuthHeaders() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("supervisorToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async handleResponse(response) {
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
}

export default ApiService;
