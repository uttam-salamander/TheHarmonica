/**
 * Test setup for Bun test runner
 * Configures mocks for browser APIs
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

// Mock localStorage for Zustand persist middleware
const localStorageMock: Storage = {
  getItem: (key: string): string | null => null,
  setItem: (key: string, value: string): void => {},
  removeItem: (key: string): void => {},
  clear: (): void => {},
  length: 0,
  key: (index: number): string | null => null,
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock Web Audio API
class MockAudioContext {
  sampleRate = 44100;
  state: AudioContextState = "running";

  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      getFloatFrequencyData: (array: Float32Array) => {
        array.fill(-100);
      },
    };
  }

  createMediaStreamSource() {
    return {
      connect: () => {},
      disconnect: () => {},
    };
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

Object.defineProperty(globalThis, "AudioContext", {
  value: MockAudioContext,
  writable: true,
});

// Mock navigator.mediaDevices
Object.defineProperty(globalThis.navigator, "mediaDevices", {
  value: {
    getUserMedia: () =>
      Promise.resolve({
        getTracks: () => [{ stop: () => {} }],
      }),
  },
  writable: true,
});
