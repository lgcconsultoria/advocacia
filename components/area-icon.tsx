const PATHS: Record<string, React.ReactNode> = {
  shield: <path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.2 7.5 10 4.3-1.8 7.5-5 7.5-10v-6L12 2.5Z" />,
  doc: (
    <>
      <path d="M6 2.5h8l4 4v15H6z" />
      <path d="M14 2.5v4h4" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  contract: (
    <>
      <path d="M6 2.5h8l4 4v15H6z" />
      <path d="M14 2.5v4h4" />
      <circle cx="12" cy="13.6" r="2.5" />
      <path d="M12 16.1V19" />
    </>
  ),
  'check-doc': (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V2.5h6V4" />
      <path d="m8.5 12.4 2.2 2.2 4.3-4.6" />
    </>
  ),
  person: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M7.5 17c.8-2 2.6-3 4.5-3s3.7 1 4.5 3" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.2 7.5 10 4.3-1.8 7.5-5 7.5-10v-6L12 2.5Z" />
      <path d="m8.7 11.8 2.3 2.3 4.3-4.6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="3" />
      <path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      <path d="M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  ledger: (
    <>
      <path d="M6 2.5h8l4 4v15H6z" />
      <path d="M14 2.5v4h4" />
      <path d="M9.5 13.5h5M12 11l2.5 2.5L12 16.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c.9-2.6 3-4 5.5-4s4.6 1.4 5.5 4" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M16.5 15c2.1 0 3.9 1.2 4.7 3.4" />
    </>
  ),
  'shield-heart': (
    <>
      <path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.2 7.5 10 4.3-1.8 7.5-5 7.5-10v-6L12 2.5Z" />
      <path d="M12 15.5s-3.2-2-3.2-4.2c0-1.2.9-2 2-2 .7 0 1.2.4 1.2 1 0-.6.5-1 1.2-1 1.1 0 2 .8 2 2 0 2.2-3.2 4.2-3.2 4.2Z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="13" rx="2" />
      <path d="M9 7.5v-2A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2" />
      <path d="M3.5 12.5h17" />
      <path d="M10.5 12.5v2h3v-2" />
    </>
  ),
  'doc-shield': (
    <>
      <path d="M6 2.5h8l4 4V12" />
      <path d="M14 2.5v4h4" />
      <path d="M6 2.5v19h6" />
      <path d="M17 13.5 13.5 15v2.5c0 2.2 1.4 3.6 3.5 4.5 2.1-.9 3.5-2.3 3.5-4.5V15L17 13.5Z" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9.5" cy="6.5" rx="6" ry="2.7" />
      <path d="M3.5 6.5v5c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7v-5" />
      <path d="M3.5 11.5v5c0 1.5 2.7 2.7 6 2.7 1 0 2-.1 2.8-.3" />
      <circle cx="17.5" cy="17" r="4" />
      <path d="M17.5 15.2v3.6M15.7 17h3.6" />
    </>
  ),
  percent: (
    <>
      <path d="M6 2.5h8l4 4v15H6z" />
      <path d="M14 2.5v4h4" />
      <circle cx="10" cy="12" r="1.6" />
      <circle cx="14.5" cy="17" r="1.6" />
      <path d="m15 10.5-6 8" />
    </>
  ),
};

export function AreaIcon({ icon }: { icon: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[icon] ?? PATHS.shield}
    </svg>
  );
}
