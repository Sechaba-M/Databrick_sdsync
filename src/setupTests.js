import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock console.error to reduce noise in tests
// but still allow real errors to be seen
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Ignore specific expected errors in tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Invalid credentials') ||
       args[0].includes('Cannot read properties'))
    ) {
      return;
    }
    // Allow other errors through
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});