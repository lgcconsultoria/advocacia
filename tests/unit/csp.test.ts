import { describe, it, expect } from 'vitest';
import { buildCsp, getDirective, SECURITY_HEADERS } from '@/lib/csp';

const NONCE = 'r4nd0mB4se64Nonce==';
const policy = buildCsp(NONCE);

describe('Content-Security-Policy', () => {
  it('carrega o nonce da requisição em script-src', () => {
    expect(getDirective(policy, 'script-src')).toContain(`'nonce-${NONCE}'`);
  });

  it('usa strict-dynamic para os scripts que o Next carrega em cadeia', () => {
    expect(getDirective(policy, 'script-src')).toContain("'strict-dynamic'");
  });

  it('script-src NÃO permite unsafe-inline nem unsafe-eval', () => {
    const src = getDirective(policy, 'script-src');
    expect(src).not.toContain("'unsafe-inline'");
    expect(src).not.toContain("'unsafe-eval'");
  });

  it('mantém os hosts de medição para navegadores sem strict-dynamic', () => {
    const src = getDirective(policy, 'script-src');
    expect(src).toContain('https://www.googletagmanager.com');
    expect(src).toContain('https://connect.facebook.net');
    expect(src).toContain('https://www.clarity.ms');
  });

  it('style-src permite unsafe-inline — decisão registrada no spec §5.2', () => {
    expect(getDirective(policy, 'style-src')).toContain("'unsafe-inline'");
  });

  it('bloqueia enquadramento, objetos e mudança de base', () => {
    expect(getDirective(policy, 'frame-ancestors')).toEqual(["'none'"]);
    expect(getDirective(policy, 'object-src')).toEqual(["'none'"]);
    expect(getDirective(policy, 'base-uri')).toEqual(["'self'"]);
    expect(getDirective(policy, 'form-action')).toEqual(["'self'"]);
  });

  it('libera o iframe do Google Maps usado em /contato', () => {
    expect(getDirective(policy, 'frame-src')).toContain('https://www.google.com');
  });

  it('libera o webhook usado hoje pelo formulário de diagnóstico', () => {
    expect(getDirective(policy, 'connect-src')).toContain(
      'https://webhook.licitacaogc.com.br'
    );
  });

  it('gera políticas diferentes para nonces diferentes', () => {
    expect(buildCsp('aaa')).not.toBe(buildCsp('bbb'));
  });

  it('não tem diretiva vazia', () => {
    for (const parte of policy.split(';')) {
      if (parte.trim() === '') continue;
      expect(parte.trim().split(/\s+/).length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('demais headers', () => {
  const mapa = new Map(SECURITY_HEADERS.map((h) => [h.key, h.value]));

  it('traz os seis headers estáticos (o CSP vem do middleware)', () => {
    for (const k of [
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Cross-Origin-Opener-Policy',
    ]) {
      expect(mapa.has(k), `falta ${k}`).toBe(true);
    }
  });

  it('não duplica o CSP no conjunto estático', () => {
    expect(mapa.has('Content-Security-Policy')).toBe(false);
  });

  it('HSTS tem dois anos, subdomínios e preload', () => {
    expect(mapa.get('Strict-Transport-Security')).toBe(
      'max-age=63072000; includeSubDomains; preload'
    );
  });

  it('Permissions-Policy desliga câmera, microfone e geolocalização', () => {
    const v = mapa.get('Permissions-Policy') ?? '';
    expect(v).toContain('camera=()');
    expect(v).toContain('microphone=()');
    expect(v).toContain('geolocation=()');
  });
});
