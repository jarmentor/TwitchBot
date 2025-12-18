import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = {
  getItem: (key) => localStorageMock.store[key] || null,
  setItem: (key, value) => {
    localStorageMock.store[key] = value;
  },
  removeItem: (key) => {
    delete localStorageMock.store[key];
  },
  clear: () => {
    localStorageMock.store = {};
  },
  store: {},
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Reset localStorage before each test
beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.setItem("mode", "light");
});
