import { describe, it, expect } from 'vitest';

describe('toolchain', () => {
  it('roda testes unitários em jsdom', () => {
    expect(typeof window).toBe('object');
    expect(typeof localStorage).toBe('object');
  });
});
