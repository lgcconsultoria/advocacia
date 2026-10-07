import type { Metadata } from 'next';
import { getSettings } from '@/lib/reader';
import { PageHero } from '@/components/site/page-hero';
import { Secao } from '@/components/site/secao';
import { FormularioDiagnostico } from '@/components/diagnostico/formulario';
import { BorderBeam } from '@/components/ui/border-beam';

export const metadata: Metadata = {
  title: 'Contato — Douglas Senturião Advocacia | Direito Tributário e Público em São Paulo',
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
        lead="Atendimento por agendamento. O caminho mais rápido é o diagnóstico: quatro campos, e o escritório retorna em até 1 dia útil com a triagem inicial e os próximos passos."
      />

      <Secao>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="etiqueta m-0">
              <span className="num opacity-70">01</span>Dados do escritório
            </p>
            <h2 className="titulo m-0 mt-5 text-[clamp(1.8rem,3.8vw,2.9rem)] text-grafite">
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
            <p className="m-0 mt-6 text-[0.88rem] text-cinza">
              Para questões institucionais que não envolvam um caso concreto, escreva para o e-mail acima.
            </p>
          </div>

          <aside id="formulario" className="planta relative self-start overflow-hidden rounded-[30px] p-6 sm:p-9 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <BorderBeam size={220} duration={10} />
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(142_139_255/0.35),transparent_65%)]" />
            <FormularioDiagnostico
              whatsapp={settings.whatsapp}
              escuro
              titulo="Tem um caso? Comece por aqui."
              subtitulo="Quatro campos. O escritório retorna em até 1 dia útil, pelo WhatsApp ou por e-mail."
              className="relative"
            />
          </aside>
        </div>
      </Secao>

      <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))] pt-0 md:pt-0">
        <p className="etiqueta m-0">
          <span className="num opacity-70">02</span>Localização
        </p>
        <h2 className="titulo m-0 mb-8 mt-5 text-[clamp(1.6rem,3.2vw,2.4rem)] text-grafite">São Paulo/SP</h2>
        <div className="overflow-hidden rounded-[28px] border border-papel-2 bg-white shadow-[0_40px_80px_-50px_rgb(29_27_154/0.45)]">
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
