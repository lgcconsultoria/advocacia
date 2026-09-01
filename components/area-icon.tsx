import {
  Shield, FileText, FileSignature, FileCheck2, User, ShieldCheck,
  Database, BookOpenCheck, Users, HeartHandshake, Briefcase,
  FileWarning, Coins, Percent,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const MAPA: Record<string, LucideIcon> = {
  'shield': Shield,
  'doc': FileText,
  'contract': FileSignature,
  'check-doc': FileCheck2,
  'person': User,
  'shield-check': ShieldCheck,
  'database': Database,
  'ledger': BookOpenCheck,
  'users': Users,
  'shield-heart': HeartHandshake,
  'briefcase': Briefcase,
  'doc-shield': FileWarning,
  'coins': Coins,
  'percent': Percent,
};

/** Ícone da área. Decorativo: o nome da área já está no <h3> ao lado. */
export function AreaIcon({ icon }: { icon: string }) {
  const Icone = MAPA[icon] ?? Shield;
  return <Icone size={24} strokeWidth={1.5} aria-hidden="true" />;
}
