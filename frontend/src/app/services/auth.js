const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store auth data
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('username', data.username);
    
    return data;
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Store auth data
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('username', data.username);
    
    return data;
  },
  
  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset email');
    }
    
    return data;
  },
  
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    // Remove any other auth-related items
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },
  
  getUserId: () => {
    return localStorage.getItem('userId');
  },
  
  getUsername: () => {
    return localStorage.getItem('username');
  }
};

// In LoginForm.jsx
import { authService } from '../../services/auth';

// Then update handleSubmit:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  
  try {
    await authService.login(formData.email, formData.password);
    router.push('/student');
  } catch (error) {
    console.error('Login failed:', error);
    setErrors({ submit: error.message || 'Invalid email or password. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};