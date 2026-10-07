import type { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/reader';
import { PageHero } from '@/components/site/page-hero';
import { Secao } from '@/components/site/secao';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contato — Douglas Senturião Advocacia | Direito Administrativo em São Paulo',
  description:
    'Fale com o escritório Douglas Senturião Advocacia. Atendimento por agendamento em São Paulo/SP. Endereço, e-mail, telefone e horário de funcionamento.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato — Douglas Senturião Advocacia',
    description:
      'Atendimento por agendamento em São Paulo/SP. Para enviar um caso, use o diagnóstico jurídico inicial.',
    url: '/contato',
  },
};

export default async function ContatoPage() {
  const settings = await getSettings();
  const dados: [string, React.ReactNode][] = [
    ['Endereço', <>{settings.address}.</>],
    ['E-mail', <a key="e" className="break-all text-marca" href={`mailto:${settings.email}`}>{settings.email}</a>],
    [
      'Telefone / WhatsApp comercial',
      <>
        <a className="text-marca" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener">
          {settings.phone}
        </a>{' '}
        — atendimento exclusivamente para agendamento.
      </>,
    ],
    [
      'Instagram',
      <a key="i" className="text-marca" href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener">
        @{settings.instagram}
      </a>,
    ],
    ['Horário', 'Segunda a sexta, das 9h às 18h.'],
  ];

  return (
    <>
      <PageHero
        trilha={[{ label: 'Contato' }]}
        rotulo="Atendimento por agendamento"
        titulo="Fale com o escritório."
        lead="Atendimento por agendamento. Para que possamos entender o seu caso, o caminho mais rápido é o formulário de diagnóstico — retornamos em até 1 dia útil com a triagem inicial e os próximos passos."
      />

      <Secao>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="rotulo m-0 text-marca">01 — Dados do escritório</p>
            <h2 className="expandida m-0 mt-4 text-[clamp(1.7rem,3.6vw,2.7rem)] font-[780] leading-[1.05] tracking-[-0.03em]">
              Onde estamos e como falar conosco.
            </h2>
            <dl className="m-0 mt-10 grid gap-0">
              {dados.map(([k, v]) => (
                <div key={k} className="grid gap-1 border-t border-papel-2 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="rotulo pt-1 text-[10.5px] text-cinza">{k}</dt>
                  <dd className="m-0 text-[1.02rem] leading-relaxed text-grafite">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="planta self-start rounded-3xl p-7 sm:p-9">
            <p className="rotulo m-0 text-sinal">Tem um caso para enviar?</p>
            <h3 className="expandida m-0 mt-4 text-[1.4rem] font-[760] leading-tight text-white">
              Use o diagnóstico jurídico inicial
            </h3>
            <p className="m-0 mt-4 leading-relaxed text-cinza-escuro">
              O formulário de diagnóstico organiza as informações essenciais —
              frente, prazo e documentos — e garante uma triagem técnica mais
              precisa do que uma mensagem livre.
            </p>
            <Link className={buttonVariants({ variant: 'claro', block: true, className: 'mt-7' })} href="/diagnostico">
              Solicitar diagnóstico inicial
            </Link>
            <p className="m-0 mt-5 text-[0.85rem] text-cinza-escuro">
              Para questões institucionais que não envolvam um caso concreto,
              escreva para o e-mail ao lado.
            </p>
          </aside>
        </div>
      </Secao>

      <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))] pt-0 md:pt-0">
        <p className="rotulo m-0 pt-16 text-marca md:pt-20">02 — Localização</p>
        <h2 className="expandida m-0 mb-8 mt-4 text-[clamp(1.5rem,3vw,2.2rem)] font-[760] tracking-[-0.02em]">
          São Paulo/SP
        </h2>
        <div className="overflow-hidden rounded-3xl border border-papel-2 bg-white">
          <iframe
            title="Mapa — Av. Brigadeiro Faria Lima, 1768, São Paulo/SP"
            src="https://www.google.com/maps?q=Av.%20Brigadeiro%20Faria%20Lima%2C%201768%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001451-001&output=embed"
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
        <div className="notice mt-10 max-w-[860px]">
          <strong>Aviso.</strong> O contato por estes canais não constitui
          mandato profissional, não estabelece relação advogado-cliente e não
          gera honorários. As informações enviadas serão tratadas com sigilo
          profissional e em conformidade com a LGPD (Lei 13.709/2018).
          Honorários, escopo e condições são tratados exclusivamente em ambiente
          reservado e individual.
        </div>
      </Secao>
    </>
  );
}
