import {
  Bell,
  BriefcaseBusiness,
  CalendarClock,

  Gavel,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type ItemNav = {
  id: string;
  titulo: string;
  href: string;
  icone: LucideIcon;
  /** Chave do contador mostrado ao lado (calculado com os dados). */
  contador?: 'prazosSemana' | 'publicacoesHoje' | 'leadsNovos' | 'alertasAtivos';
};

export type GrupoNav = { titulo?: string; itens: ItemNav[] };

const BASE = '/sistema/demo';

export const NAVEGACAO: GrupoNav[] = [
  {
    itens: [{ id: 'painel', titulo: 'Painel', href: BASE, icone: LayoutDashboard }],
  },
  {
    titulo: 'Contencioso',
    itens: [
      { id: 'processos', titulo: 'Processos', href: `${BASE}/processos`, icone: Gavel },
      { id: 'prazos', titulo: 'Prazos', href: `${BASE}/prazos`, icone: CalendarClock, contador: 'prazosSemana' },
      { id: 'publicacoes', titulo: 'Publicações', href: `${BASE}/publicacoes`, icone: Newspaper, contador: 'publicacoesHoje' },
    ],
  },
  {
    titulo: 'Relacionamento',
    itens: [
      { id: 'comercial', titulo: 'Comercial', href: `${BASE}/comercial`, icone: BriefcaseBusiness, contador: 'leadsNovos' },
      { id: 'clientes', titulo: 'Clientes', href: `${BASE}/clientes`, icone: Users },
    ],
  },
  {
    titulo: 'Automação',
    itens: [{ id: 'alertas', titulo: 'Alertas', href: `${BASE}/alertas`, icone: Bell, contador: 'alertasAtivos' }],
  },
];

export const NAV_RODAPE: ItemNav[] = [{ id: 'configuracoes', titulo: 'Configurações', href: `${BASE}/configuracoes`, icone: Settings }];

export const TODAS_NAV = [...NAVEGACAO.flatMap((g) => g.itens), ...NAV_RODAPE];

