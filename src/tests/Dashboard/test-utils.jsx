import React from 'react';
import { render } from '@testing-library/react';

/**
 * Custom render function that wraps components with common providers
 */
export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock data generators for consistent test data
 */
export const mockDataGenerators = {
  kpi: (overrides = {}) => ({
    id: 'test-kpi',
    title: 'Test KPI',
    value: '100',
    completed: 80,
    pending: 15,
    overdue: 5,
    trendDirection: 'up',
    trendLabel: '+10%',
    ...overrides,
  }),

  medicalTestStat: (overrides = {}) => ({
    id: 'test-stat',
    label: 'Test Stat',
    value: '50',
    change: '+5%',
    ...overrides,
  }),

  riskAssessment: (overrides = {}) => ({
    title: 'Test Assessment',
    date: 'Dec 2024',
    assessor: 'Test Assessor',
    chemicals: 'Test Chemicals',
    risk: 'Medium',
    recommendations: '2 pending',
    ...overrides,
  }),
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => 
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock window.open for PDF export tests
 */
export function mockWindowOpen() {
  const mockWrite = jest.fn();
  const mockClose = jest.fn();
  const mockWindow = {
    document: {
      write: mockWrite,
      close: mockClose,
    },
  };
  
  window.open = jest.fn(() => mockWindow);
  
  return { mockWrite, mockClose, mockWindow };
}

/**
 * Mock document.createElement for download tests
 * Uses spyOn to avoid infinite recursion
 */
export function mockDownload() {
  const linkClickSpy = jest.fn();
  
  const createElementSpy = jest.spyOn(document, 'createElement');
  
  createElementSpy.mockImplementation((tag) => {
    // Call the original implementation
    const element = createElementSpy.wrappedMethod.call(document, tag);
    
    // Override click for anchor tags
    if (tag === 'a') {
      element.click = linkClickSpy;
    }
    
    return element;
  });
  
  return { 
    linkClickSpy, 
    createElementSpy,
    cleanup: () => createElementSpy.mockRestore()
  };
}

/**
 * Setup URL mocks for blob/file operations
 */
export function mockURLs() {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
  global.URL.revokeObjectURL = jest.fn();
}

/**
 * Create a mock fetch response
 */
export function createMockResponse(data, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

/**
 * Re-export everything from testing library
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';