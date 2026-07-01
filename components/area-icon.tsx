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
