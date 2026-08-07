import { login, registerUser, fetchProfile } from '../../api/authApi';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the apiBase module to provide the base URL
jest.mock('../../api/apiBase', () => ({
  apiUrl: (path) => `http://localhost:5000${path}`
}));

describe('authApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        success: true,
        token: 'test-token-123',
        user: { id: 1, email: 'test@example.com' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await login({ 
        email: 'test@example.com', 
        password: 'password123' 
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: 'test@example.com', 
            password: 'password123' 
          })
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error with invalid credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ error: 'Invalid credentials' })
      });

      await expect(
        login({ email: 'wrong@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        login({ email: 'test@example.com', password: 'password' })
      ).rejects.toThrow('Network error');
    });

    it('should handle response with success: false', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: false, 
          error: 'Login failed' 
        })
      });

      await expect(
        login({ email: 'test@example.com', password: 'password' })
      ).rejects.toThrow('Login failed');
    });

    it('should handle non-JSON error responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Server error'
      });

      await expect(
        login({ email: 'test@example.com', password: 'password' })
      ).rejects.toThrow('Server error');
    });
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepass123',
        role: 'user'
      };

      const mockResponse = {
        success: true,
        user: { id: 1, ...mockUser }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await registerUser(mockUser);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockUser)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when email already exists', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ 
          error: 'Email already registered' 
        })
      });

      await expect(
        registerUser({ 
          name: 'John', 
          email: 'existing@example.com', 
          password: 'pass' 
        })
      ).rejects.toThrow('Email already registered');
    });

    it('should handle validation errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Password must be at least 8 characters'
      });

      await expect(
        registerUser({ 
          name: 'John', 
          email: 'john@example.com', 
          password: 'short' 
        })
      ).rejects.toThrow('Password must be at least 8 characters');
    });

    it('should handle response with message field', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: false,
          message: 'Registration failed' 
        })
      });

      await expect(
        registerUser({ 
          name: 'John', 
          email: 'john@example.com', 
          password: 'password123' 
        })
      ).rejects.toThrow('Registration failed');
    });
  });

  describe('fetchProfile', () => {
    it('should fetch user profile with valid token', async () => {
      const mockProfile = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile
      });

      const result = await fetchProfile('valid-token-123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/me'),
        {
          headers: {
            Authorization: 'Bearer valid-token-123'
          }
        }
      );
      expect(result).toEqual(mockProfile);
    });

    it('should throw error with invalid token', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ 
          error: 'Invalid or expired token' 
        })
      });

      await expect(
        fetchProfile('invalid-token')
      ).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error when token is missing', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Unauthorized'
      });

      await expect(
        fetchProfile(null)
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle empty error response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => ''
      });

      await expect(
        fetchProfile('invalid-token')
      ).rejects.toThrow('Request failed');
    });
  });
});