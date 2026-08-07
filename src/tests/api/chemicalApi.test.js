import {
  fetchChemicals,
  createChemical,
  updateChemical,
  deleteChemical,
  exportChemicals
} from '../../api/chemicalApi';

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

// Mock window.location.origin for URL construction
delete global.window;
global.window = { location: { origin: 'http://localhost:5000' } };

// Mock environment variable
const mockBaseUrl = 'http://localhost:5000';

describe('chemicalApi', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe('fetchChemicals', () => {
    it('should fetch chemicals with no params', async () => {
      const mockChemicals = [
        { id: 1, name: 'Benzene', cas: '71-43-2' },
        { id: 2, name: 'Toluene', cas: '108-88-3' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockChemicals })
      });

      const result = await fetchChemicals();

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/chemicals');
      expect(result).toEqual(mockChemicals);
    });

    it('should fetch chemicals with filter params', async () => {
      const mockChemicals = [{ id: 1, name: 'Benzene' }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockChemicals })
      });

      await fetchChemicals({ 
        category: 'solvents', 
        risk: 'high' 
      });

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('category=solvents');
      expect(calledUrl).toContain('risk=high');
    });

    it('should handle array response format', async () => {
      const mockChemicals = [{ id: 1, name: 'Benzene' }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockChemicals
      });

      const result = await fetchChemicals();
      expect(result).toEqual(mockChemicals);
    });

    it('should handle items array format', async () => {
      const mockChemicals = [{ id: 1, name: 'Benzene' }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockChemicals })
      });

      const result = await fetchChemicals();
      expect(result).toEqual(mockChemicals);
    });

    it('should return empty array for unrecognized format', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      });

      const result = await fetchChemicals();
      expect(result).toEqual([]);
    });

    it('should ignore null and empty string params', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      await fetchChemicals({ 
        category: null, 
        risk: '', 
        search: 'benzene' 
      });

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).not.toContain('category=');
      expect(calledUrl).not.toContain('risk=');
      expect(calledUrl).toContain('search=benzene');
    });

    it('should ignore undefined params', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      await fetchChemicals({ 
        category: undefined, 
        search: 'test' 
      });

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).not.toContain('category=');
      expect(calledUrl).toContain('search=test');
    });

    it('should ignore "all" param value', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      await fetchChemicals({ category: 'all' });

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).not.toContain('category=');
    });

    it('should throw error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error'
      });

      await expect(fetchChemicals()).rejects.toThrow('Server error');
    });

    it('should throw error with status code when no error text', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => ''
      });

      await expect(fetchChemicals()).rejects.toThrow(
        'Request failed with status 404'
      );
    });
  });

  describe('createChemical', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'test-token' 
      }));
    });

    it('should create a new chemical with auth token', async () => {
      const newChemical = { 
        name: 'Benzene', 
        cas: '71-43-2', 
        risk: 'high' 
      };

      const mockResponse = { 
        success: true, 
        data: { id: 1, ...newChemical } 
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await createChemical(newChemical);

      const callArgs = fetch.mock.calls[0];
      expect(callArgs[0]).toContain('/api/chemicals');
      expect(callArgs[1].method).toBe('POST');
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
      expect(callArgs[1].headers.Authorization).toBe('Bearer test-token');
      expect(callArgs[1].body).toBe(JSON.stringify(newChemical));
      expect(result).toEqual(mockResponse);
    });

    it('should create chemical without auth token', async () => {
      localStorage.clear();

      const newChemical = { name: 'Toluene' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await createChemical(newChemical);

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should handle invalid JSON in localStorage gracefully', async () => {
      localStorage.setItem('session', 'invalid-json');

      const newChemical = { name: 'Toluene' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await createChemical(newChemical);

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });

    it('should throw error on validation failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Name is required'
      });

      await expect(
        createChemical({ cas: '71-43-2' })
      ).rejects.toThrow('Name is required');
    });
  });

  describe('updateChemical', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'test-token' 
      }));
    });

    it('should update an existing chemical', async () => {
      const updates = { name: 'Updated Benzene', risk: 'medium' };
      const mockResponse = { 
        success: true, 
        data: { id: 1, ...updates } 
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await updateChemical(1, updates);

      const callArgs = fetch.mock.calls[0];
      expect(callArgs[0]).toContain('/api/chemicals/1');
      expect(callArgs[1].method).toBe('PUT');
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
      expect(callArgs[1].headers.Authorization).toBe('Bearer test-token');
      expect(callArgs[1].body).toBe(JSON.stringify(updates));
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when chemical not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Chemical not found'
      });

      await expect(
        updateChemical(999, { name: 'Test' })
      ).rejects.toThrow('Chemical not found');
    });

    it('should update without auth token when not logged in', async () => {
      localStorage.clear();

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await updateChemical(1, { name: 'Test' });

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('deleteChemical', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'test-token' 
      }));
    });

    it('should delete a chemical successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true
      });

      const result = await deleteChemical(1);

      const callArgs = fetch.mock.calls[0];
      expect(callArgs[0]).toContain('/api/chemicals/1');
      expect(callArgs[1].method).toBe('DELETE');
      expect(callArgs[1].headers.Authorization).toBe('Bearer test-token');
      expect(result).toBe(true);
    });

    it('should throw error when delete fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Chemical not found'
      });

      await expect(deleteChemical(999)).rejects.toThrow('Chemical not found');
    });

    it('should throw error with status code when no text', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => ''
      });

      await expect(deleteChemical(1)).rejects.toThrow(
        'Failed to delete chemical (status 500)'
      );
    });

    it('should delete without auth token when not logged in', async () => {
      localStorage.clear();

      fetch.mockResolvedValueOnce({
        ok: true
      });

      const result = await deleteChemical(1);
      expect(result).toBe(true);

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('exportChemicals', () => {
    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ 
        token: 'test-token' 
      }));
    });

    it('should export chemicals as blob', async () => {
      const mockBlob = new Blob(['csv,data'], { type: 'text/csv' });

      fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob
      });

      const result = await exportChemicals();

      const callArgs = fetch.mock.calls[0];
      expect(callArgs[0]).toContain('/api/chemicals/export');
      expect(callArgs[1].method).toBe('GET');
      expect(callArgs[1].headers.Authorization).toBe('Bearer test-token');
      expect(result).toEqual(mockBlob);
    });

    it('should export with filter params', async () => {
      const mockBlob = new Blob(['csv,data']);

      fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob
      });

      await exportChemicals({ category: 'solvents', risk: 'high' });

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('category=solvents');
      expect(calledUrl).toContain('risk=high');
    });

    it('should ignore empty params in export', async () => {
      const mockBlob = new Blob(['csv,data']);

      fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob
      });

      await exportChemicals({ 
        category: 'solvents', 
        risk: '', 
        search: null 
      });

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('category=solvents');
      expect(calledUrl).not.toContain('risk=');
      expect(calledUrl).not.toContain('search=');
    });

    it('should throw error when export fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Export failed'
      });

      await expect(exportChemicals()).rejects.toThrow('Export failed');
    });

    it('should use default error message when no text', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => ''
      });

      await expect(exportChemicals()).rejects.toThrow(
        'Failed to export chemicals'
      );
    });

    it('should export without auth token when not logged in', async () => {
      localStorage.clear();

      const mockBlob = new Blob(['csv,data']);
      fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob
      });

      await exportChemicals();

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });
  });
});