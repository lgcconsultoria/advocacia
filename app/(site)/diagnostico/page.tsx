import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Clock, FileSearch, MessageCircle, ShieldCheck } from 'lucide-react';
import { getSettings } from '@/lib/reader';
import { GradePlanta } from '@/components/site/secao';
import { BorderBeam } from '@/components/ui/border-beam';
import { FormularioDiagnostico } from '@/components/diagnostico/formulario';
import { FormularioPagina } from '@/components/diagnostico/formulario-pagina';

export const metadata: Metadata = {
  title: 'Diagnóstico inicial para empresas',
  description:
    'Peça um diagnóstico inicial: nome, empresa, e-mail e WhatsApp. O escritório retorna em até 1 dia útil. O envio não constitui mandato nem gera honorários.',
  alternates: { canonical: '/diagnostico' },
  openGraph: {
    title: 'Diagnóstico inicial — Douglas Senturião Advocacia',
    description: 'Quatro campos e o escritório retorna em até 1 dia útil com os próximos passos.',
    url: '/diagnostico',
  },
};

export default async function DiagnosticoPage() {
  const settings = await getSettings();
  const etapas = [
    { Icone: FileSearch, t: 'Você conta quem é', d: 'Nome, empresa, e-mail e WhatsApp. Nada de anexo nem formulário longo.' },
    { Icone: MessageCircle, t: 'O escritório chama', d: 'Em até 1 dia útil, pelo WhatsApp ou por e-mail, para entender o caso e o prazo.' },
    { Icone: Clock, t: 'Triagem com prazo', d: 'A frente aplicável, o instrumento cabível e o tempo de reação, por escrito.' },
    { Icone: ShieldCheck, t: 'Decisão informada', d: 'Havendo interesse, escopo e honorários são tratados por escrito, em ambiente reservado.' },
  ];

  return (
    <section className="planta ruido relative isolate overflow-hidden">
      <GradePlanta className="opacity-[0.14]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgb(91_87_255/0.4),transparent_62%)] blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-60 -left-40 -z-10 h-[560px] w-[680px] rounded-full bg-[radial-gradient(circle,rgb(29_27_154/0.6),transparent_65%)] blur-3xl" />
      <div className="container grid gap-12 pb-20 pt-[calc(var(--header-h)+2.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16 lg:pb-28 lg:pt-[calc(var(--header-h)+4rem)]">
        <div className="min-w-0">
          <nav className="rotulo flex items-center gap-2 text-[10.5px] text-cinza-escuro" aria-label="Trilha de navegação">
            <Link href="/" className="no-underline hover:text-white">Início</Link>
            <span aria-hidden="true" className="text-sinal">/</span>
            <span aria-current="page" className="text-white/80">Diagnóstico</span>
          </nav>
          <p className="etiqueta etiqueta--escura m-0 mt-10">Diagnóstico inicial</p>
          <h1 className="display m-0 mt-5 text-[clamp(2.4rem,6vw,4.8rem)] text-white">
            Quatro campos. <em className="text-sinal">Um caminho.</em>
          </h1>
          <p className="m-0 mt-6 max-w-[54ch] text-[1.08rem] leading-relaxed text-cinza-escuro">
            Reforma Tributária, licitação, contrato público ou um ato que trava a empresa: conte quem você é e o
            escritório retorna em até 1 dia útil com os próximos passos.
          </p>
          <ol className="m-0 mt-10 grid list-none gap-3 p-0 sm:grid-cols-2">
            {etapas.map(({ Icone, t, d }, i) => (
              <li key={t} className="vidro-escuro rounded-[20px] p-5">
                <span className="flex items-center justify-between">
                  <Icone className="h-5 w-5 text-sinal" aria-hidden="true" />
                  <span className="rotulo num text-[10px] text-cinza-escuro">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="semi mt-3 block text-[1.02rem] font-[700] text-white">{t}</span>
                <span className="mt-1 block text-[0.9rem] leading-snug text-cinza-escuro">{d}</span>
              </li>
            ))}
          </ol>
          <p className="m-0 mt-8 max-w-[62ch] text-[0.84rem] leading-relaxed text-cinza-escuro">
            O diagnóstico inicial é uma triagem técnica para identificar a frente, o instrumento e o prazo. Não é
            parecer jurídico, não antecipa resultado e o envio não constitui mandato nem relação advogado-cliente.
          </p>
        </div>

        <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div id="formulario" className="vidro-escuro relative overflow-hidden rounded-[30px] p-6 sm:p-9">
            <BorderBeam size={240} duration={10} />
            <Suspense fallback={<FormularioDiagnostico whatsapp={settings.whatsapp} escuro titulo="Conte quem é a sua empresa" />}>
              <FormularioPagina whatsapp={settings.whatsapp} />
            </Suspense>
          </div>
          <p className="m-0 mt-4 text-center text-[0.86rem] text-cinza-escuro">
            Prefere conversar agora?{' '}
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá, gostaria de um diagnóstico inicial.')}`}
              target="_blank"
              rel="noopener"
              className="font-[650] text-white underline underline-offset-2"
            >
              Chame no WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
