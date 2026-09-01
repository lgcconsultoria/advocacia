'use client';

export function ConsentReopen() {
  return (
    <button
      type="button"
      className="link-button"
      onClick={() => window.dispatchEvent(new Event('dsa-consent-reopen'))}
    >
      Preferências de privacidade
    </button>
  );
}
