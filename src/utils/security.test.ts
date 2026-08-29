import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  sanitizeHTML,
  sanitizeTextInput,
  sanitizeURL,
  sanitizeEmail,
  sanitizeFilename,
  ClientRateLimiter,
  generateSecureId,
  generateTicketHash,
} from './security';

describe('Security Utilities - Input Sanitization', () => {
  it('sanitizeHTML escapes XSS vectors properly', () => {
    expect(sanitizeHTML('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    expect(sanitizeHTML('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
    expect(sanitizeHTML('Hello & "World" \'123\'')).toBe('Hello &amp; &quot;World&quot; &#x27;123&#x27;');
  });

  it('sanitizeTextInput strips control characters and clamps length', () => {
    expect(sanitizeTextInput('Hello\x00\x08 World')).toBe('Hello World');
    expect(sanitizeTextInput('   Trimmed String   ')).toBe('Trimmed String');
    expect(sanitizeTextInput('Hello World', 5)).toBe('Hello');
  });

  it('sanitizeURL permits safe http, https, and mailto protocols and neutralizes dangerous ones', () => {
    expect(sanitizeURL('https://eventos.ai')).toBe('https://eventos.ai/');
    expect(sanitizeURL('http://localhost:3000')).toBe('http://localhost:3000/');
    expect(sanitizeURL('mailto:support@eventos.ai')).toBe('mailto:support@eventos.ai');
    expect(sanitizeURL('/dashboard/judging')).toBe('/dashboard/judging');
    expect(sanitizeURL('javascript:alert(document.cookie)')).toBe('#');
    expect(sanitizeURL('vbscript:msgbox(1)')).toBe('#');
    expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('#');
    expect(sanitizeURL('  JAVASCRIPT:alert(1)  ')).toBe('#');
  });

  it('sanitizeEmail validates and normalizes emails', () => {
    expect(sanitizeEmail('  Alex.Rivera@HackMatrix.IO ')).toBe('alex.rivera@hackmatrix.io');
    expect(sanitizeEmail('invalid-email')).toBe('');
    expect(sanitizeEmail('user<script>@domain.com')).toBe('');
  });

  it('sanitizeFilename removes directory traversal and path characters', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('._._._etc_passwd');
    expect(sanitizeFilename('my file *? name:.txt')).toBe('my_file____name_.txt');
  });
});

describe('Security Utilities - ClientRateLimiter', () => {
  let rateLimiter: ClientRateLimiter;

  beforeEach(() => {
    vi.useFakeTimers();
    rateLimiter = new ClientRateLimiter(3, 5000); // 3 requests per 5000ms
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within limit and throttles excess requests', () => {
    expect(rateLimiter.isAllowed('chat_user1')).toBe(true);
    expect(rateLimiter.isAllowed('chat_user1')).toBe(true);
    expect(rateLimiter.isAllowed('chat_user1')).toBe(true);
    // 4th request should be blocked
    expect(rateLimiter.isAllowed('chat_user1')).toBe(false);

    // Advance time past window
    vi.advanceTimersByTime(5001);
    expect(rateLimiter.isAllowed('chat_user1')).toBe(true);
  });

  it('reports remaining attempts accurately', () => {
    expect(rateLimiter.getRemainingAttempts('user2')).toBe(3);
    rateLimiter.isAllowed('user2');
    expect(rateLimiter.getRemainingAttempts('user2')).toBe(2);
  });
});

describe('Security Utilities - Cryptographic ID and Hash Generation', () => {
  it('generateSecureId creates valid alphanumeric string with prefix', () => {
    const id = generateSecureId('tkt_');
    expect(id).toMatch(/^tkt_[a-z0-9]+$/);
  });

  it('generateTicketHash creates SHA-256 hash or deterministic crypto fallback', async () => {
    const hash = await generateTicketHash('EVOS-2026-X892', 'EVENTOS_SECRET_2026');
    expect(hash).toBeTruthy();
    expect(typeof hash).toBe('string');
  });
});
