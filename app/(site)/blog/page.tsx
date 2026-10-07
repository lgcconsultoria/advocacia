import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getSettings } from '@/lib/reader';
import { BlogList } from '@/components/blog-list';
import { PageHero } from '@/components/site/page-hero';
import { Cabecalho, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { buttonVariants } from '@/components/ui/button';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';

export const metadata: Metadata = {
  title: 'Blog — Análise técnica de Direito Administrativo',
  description:
    'Artigos técnicos de Direito Administrativo: mandado de segurança, licitações, contratos públicos, servidores, concursos, improbidade e execuções. Conteúdo informativo.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Análise técnica de Direito Administrativo',
    description:
      'Artigos sobre direito público: prazos, leis e decisões dos tribunais, em linguagem objetiva.',
    url: '/blog',
  },
};

const UPCOMING = [
  'Nova Lei de Improbidade: a defesa após a Lei 14.230/2021.',
  'Sanção administrativa em contrato público: roteiro de defesa.',
  'Habeas Data: o instrumento para acessar e corrigir dados públicos.',
  'Cobrança contra a Fazenda Pública: precatório, RPV e estratégias.',
  'Mandado de Segurança coletivo: legitimados e hipóteses.',
];

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  const cards = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    area: p.area,
    areaKey: p.areaKey,
    description: p.description,
    readingTime: p.readingTime,
  }));

  return (
    <>
      <PageHero
        trilha={[{ label: 'Blog' }]}
        rotulo={`${posts.length} artigos · análise técnica`}
        titulo="Blog"
        lead="Artigos sobre direito público — prazos, leis e decisões dos tribunais, em linguagem objetiva para quem precisa entender o próprio caso."
      />

      <Secao>
        <div className="notice mb-10 max-w-[760px]">
          Os artigos têm caráter informativo e não substituem a análise de um
          caso concreto.
        </div>
        <BlogList posts={cards} />
      </Secao>

      <Secao escura grade>
        <Cabecalho n="→" rotulo="Em pauta" titulo="Próximos temas que entram no blog" escura />
        <ol className="m-0 mt-12 grid list-none gap-0 p-0 md:ml-[calc(9rem+2.5rem)]">
          {UPCOMING.map((t, i) => (
            <li key={i} className="grid grid-cols-[2.6rem_minmax(0,1fr)] items-baseline gap-3 border-t border-sinal/15 py-4">
              <span className="rotulo num text-[10px] text-sinal">{String(i + 1).padStart(2, '0')}</span>
              <span className="citacao text-[clamp(1.25rem,2vw,1.6rem)] leading-snug text-white">{t}</span>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao>
        <div className="grid max-w-[860px] items-center gap-7 rounded-3xl bg-white p-7 shadow-[0_30px_80px_-50px_rgb(29_27_154/0.35)] sm:grid-cols-[auto_minmax(0,1fr)] sm:p-10">
          <Image
            src="/assets/img/douglas-institucional.jpg"
            alt={settings.lawyerName}
            width={232}
            height={232}
            className="h-[116px] w-[116px] rounded-full object-cover object-[50%_18%]"
          />
          <div className="min-w-0">
            <p className="rotulo m-0 text-marca">Quem escreve</p>
            <p className="expandida m-0 mt-3 text-[1.25rem] font-[750]">{settings.lawyerName}</p>
            <p className="rotulo m-0 mt-1 text-[10.5px] text-cinza">{settings.oab}</p>
            <p className="m-0 mt-4 leading-relaxed text-cinza">
              Os artigos são escritos por {settings.lawyerName}, advogado com
              mais de dez anos de atuação em direito público e licitações. A
              proposta é explicar bem os instrumentos, os prazos e o que os
              tribunais vêm decidindo — sem juridiquês desnecessário.
            </p>
            <Link className="link-seta mt-5" href="/sobre">
              Conhecer o escritório <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Secao>

      <CtaFaixa
        titulo="Tem um caso concreto, e não apenas uma dúvida?"
        texto="Solicite uma triagem técnica inicial. Retornamos em até 1 dia útil com os próximos passos."
      >
        <BotaoDiagnostico variant="claro" size="lg">
          Solicitar diagnóstico
        </BotaoDiagnostico>
      </CtaFaixa>
    </>
  );
}
