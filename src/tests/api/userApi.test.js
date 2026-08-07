import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
} from '../../api/userApi';

global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();

global.localStorage = localStorageMock;

describe('userApi', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe('fetchUsers', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'admin-token' 
      }));
    });

    it('should fetch all users with admin token', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          count: 2, 
          data: mockUsers 
        })
      });

      const result = await fetchUsers();

      const calledUrl = fetch.mock.calls[0][0];
      const calledOptions = fetch.mock.calls[0][1];
      
      expect(calledUrl).toContain('/api/auth/users');
      expect(calledOptions.headers.Authorization).toBe('Bearer admin-token');
      expect(result).toEqual(mockUsers);
    });

    it('should return the response object when data field is not present', async () => {
      const mockResponse = { 
        success: true, 
        count: 0 
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchUsers();
      expect(result).toEqual(mockResponse);
    });

    it('should return the data object directly if no data field', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const result = await fetchUsers();
      expect(result).toEqual(mockUsers);
    });

    it('should throw error when not authenticated', async () => {
      localStorage.clear();

      await expect(fetchUsers()).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });

    it('should throw error when token is invalid', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ 
          error: 'Invalid or expired token' 
        })
      });

      await expect(fetchUsers()).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error when not authorized as admin', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Forbidden: Admin access required'
      });

      await expect(fetchUsers()).rejects.toThrow(
        'Forbidden: Admin access required'
      );
    });

    it('should handle malformed session data', async () => {
      localStorage.setItem('session', 'invalid-json');

      await expect(fetchUsers()).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'admin-token' 
      }));
    });

    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        role: 'user'
      };

      const mockResponse = {
        success: true,
        user: { id: 3, ...newUser }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await createUser(newUser);

      const calledUrl = fetch.mock.calls[0][0];
      const calledOptions = fetch.mock.calls[0][1];
      
      expect(calledUrl).toContain('/api/auth/register');
      expect(calledOptions.method).toBe('POST');
      expect(calledOptions.headers['Content-Type']).toBe('application/json');
      expect(calledOptions.headers.Authorization).toBe('Bearer admin-token');
      expect(calledOptions.body).toBe(JSON.stringify(newUser));
      expect(result).toEqual(mockResponse.user);
    });

    it('should return the response object if user field is not present', async () => {
      const mockResponse = { success: true };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await createUser({ name: 'Test User' });
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
        createUser({ 
          name: 'Test', 
          email: 'existing@example.com', 
          password: 'pass' 
        })
      ).rejects.toThrow('Email already registered');
    });

    it('should throw error when not authenticated', async () => {
      localStorage.clear();

      await expect(
        createUser({ name: 'Test', email: 'test@example.com' })
      ).rejects.toThrow('Not authenticated – no token found.');
    });

    it('should handle validation errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Password must be at least 8 characters'
      });

      await expect(
        createUser({ 
          name: 'Test', 
          email: 'test@example.com', 
          password: 'short' 
        })
      ).rejects.toThrow('Password must be at least 8 characters');
    });
  });

  describe('updateUser', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'admin-token' 
      }));
    });

    it('should update user role', async () => {
      const mockResponse = {
        success: true,
        user: { id: 1, name: 'John Doe', role: 'admin' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await updateUser(1, { role: 'admin' });

      const calledUrl = fetch.mock.calls[0][0];
      const calledOptions = fetch.mock.calls[0][1];
      
      expect(calledUrl).toContain('/api/auth/users/1');
      expect(calledOptions.method).toBe('PUT');
      expect(calledOptions.headers['Content-Type']).toBe('application/json');
      expect(calledOptions.headers.Authorization).toBe('Bearer admin-token');
      expect(calledOptions.body).toBe(JSON.stringify({ role: 'admin' }));
      expect(result).toEqual(mockResponse.user);
    });

    it('should return the response object if user field is not present', async () => {
      const mockResponse = { success: true };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await updateUser(1, { role: 'admin' });
      expect(result).toEqual(mockResponse);
    });

    it('should send full payload as provided', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: {} })
      });

      await updateUser(1, { role: 'admin' });

      const calledBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(calledBody).toEqual({ role: 'admin' });
    });

    it('should throw error when user not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'User not found'
      });

      await expect(
        updateUser(999, { role: 'admin' })
      ).rejects.toThrow('User not found');
    });

    it('should throw error when not authenticated', async () => {
      localStorage.clear();

      await expect(
        updateUser(1, { role: 'admin' })
      ).rejects.toThrow('Not authenticated – no token found.');
    });

    it('should throw error with invalid role', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ 
          error: 'Invalid role specified' 
        })
      });

      await expect(
        updateUser(1, { role: 'invalid-role' })
      ).rejects.toThrow('Invalid role specified');
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'admin-token' 
      }));
    });

    it('should delete a user successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          message: 'User deleted' 
        })
      });

      const result = await deleteUser(1);

      const calledUrl = fetch.mock.calls[0][0];
      const calledOptions = fetch.mock.calls[0][1];
      
      expect(calledUrl).toContain('/api/auth/users/1');
      expect(calledOptions.method).toBe('DELETE');
      expect(calledOptions.headers.Authorization).toBe('Bearer admin-token');
      expect(result).toBe(true);
    });

    it('should return true even with minimal response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const result = await deleteUser(1);
      expect(result).toBe(true);
    });

    it('should throw error when user not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'User not found'
      });

      await expect(deleteUser(999)).rejects.toThrow('User not found');
    });

    it('should throw error when not authenticated', async () => {
      localStorage.clear();

      await expect(deleteUser(1)).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });

    it('should throw error when trying to delete self', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ 
          error: 'Cannot delete your own account' 
        })
      });

      await expect(deleteUser(1)).rejects.toThrow(
        'Cannot delete your own account'
      );
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(deleteUser(1)).rejects.toThrow('Network failure');
    });

    it('should handle error response without JSON', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Server error occurred'
      });

      await expect(deleteUser(1)).rejects.toThrow('Server error occurred');
    });
  });

  describe('Token handling edge cases', () => {
    it('should handle session with null token', async () => {
      localStorage.setItem('session', JSON.stringify({ token: null }));

      await expect(fetchUsers()).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });

    it('should handle session with empty string token', async () => {
      localStorage.setItem('session', JSON.stringify({ token: '' }));

      await expect(fetchUsers()).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });

    it('should handle session without token property', async () => {
      localStorage.setItem('session', JSON.stringify({ user: 'test' }));

      await expect(fetchUsers()).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });

    it('should handle null localStorage item', async () => {
      localStorage.removeItem('session');

      await expect(fetchUsers()).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });

    it('should handle malformed JSON in localStorage', async () => {
      localStorage.setItem('session', '{invalid json}');

      await expect(fetchUsers()).rejects.toThrow(
        'Not authenticated – no token found.'
      );
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'test-token' 
      }));
    });

    it('should prioritize error field in JSON error response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ 
          error: 'Specific error',
          message: 'Generic message'
        })
      });

      await expect(fetchUsers()).rejects.toThrow('Specific error');
    });

    it('should fall back to message field if error not present', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ 
          message: 'Error message'
        })
      });

      await expect(fetchUsers()).rejects.toThrow('Error message');
    });

    it('should use raw text if JSON parsing fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Plain text error'
      });

      await expect(fetchUsers()).rejects.toThrow('Plain text error');
    });

    it('should use default message if no error text', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => ''
      });

      await expect(fetchUsers()).rejects.toThrow('Request failed with status');
    });

    it('should handle errors in JSON responses with ok: true', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          error: 'Something went wrong' 
        })
      });
      // The function returns data.data ?? data ?? []
      const result = await fetchUsers();
      expect(result).toEqual({ error: 'Something went wrong' });
    });
  });
});