import Link from 'next/link';
import { Assinatura } from '@/components/site/marca';
import { GradePlanta } from '@/components/site/secao';

type FooterProps = {
  areas: { slug: string; title: string; group?: string | null }[];
  settings: {
    firmName: string;
    lawyerName: string;
    oab: string;
    phone: string;
    whatsapp: string;
    email: string;
    instagram: string;
    address?: string;
  };
};

const linkCls = 'text-cinza-escuro no-underline transition-colors hover:text-white';

export function SiteFooter({ areas, settings }: FooterProps) {
  const publico = areas.filter((a) => a.group !== 'civel');
  const civel = areas.filter((a) => a.group === 'civel');

  return (
    <footer className="planta relative isolate overflow-hidden text-[0.93rem]">
      <GradePlanta className="opacity-[0.12]" />
      <div className="container grid gap-12 pb-12 pt-16 md:pt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0">
          <Link href="/" className="inline-block text-white no-underline" aria-label={`${settings.firmName} — página inicial`}>
            <Assinatura tamanho="lg" />
          </Link>
          <p className="mt-6 max-w-[34ch] text-cinza-escuro">
            Escritório-boutique dedicado a conflitos entre o setor privado, o
            cidadão e a Administração Pública.
          </p>
          <p className="rotulo mt-5 text-[10.5px] text-white/80">
            {settings.lawyerName} · {settings.oab}
          </p>
        </div>

        <div className="min-w-0">
          <h2 className="rotulo m-0 text-[10.5px] text-sinal">Direito Público</h2>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            {publico.map((a) => (
              <li key={a.slug}>
                <Link className={linkCls} href={`/areas/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
          {civel.length > 0 && (
            <>
              <h2 className="rotulo m-0 mt-8 text-[10.5px] text-sinal">Cível e Empresarial</h2>
              <ul className="m-0 mt-4 grid list-none gap-2 p-0">
                {civel.map((a) => (
                  <li key={a.slug}>
                    <Link className={linkCls} href={`/areas/${a.slug}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="rotulo m-0 text-[10.5px] text-sinal">Institucional</h2>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            <li><Link className={linkCls} href="/sobre">Sobre o escritório</Link></li>
            <li><Link className={linkCls} href="/licitacoes">Departamento de Licitações</Link></li>
            <li><Link className={linkCls} href="/blog">Blog</Link></li>
            <li><Link className={linkCls} href="/modelos">Materiais gratuitos</Link></li>
            <li><Link className={linkCls} href="/diagnostico">Diagnóstico jurídico inicial</Link></li>
            <li><Link className={linkCls} href="/contato">Contato</Link></li>
          </ul>
          <h2 className="rotulo m-0 mt-8 text-[10.5px] text-sinal">Privacidade e ética</h2>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            <li><Link className={linkCls} href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link className={linkCls} href="/exclusao-de-dados">Exclusão de dados</Link></li>
            <li><Link className={linkCls} href="/aviso-publicidade">Aviso de Publicidade</Link></li>
          </ul>
        </div>

        <div className="min-w-0">
          <h2 className="rotulo m-0 text-[10.5px] text-sinal">Contato</h2>
          <ul className="m-0 mt-4 grid list-none gap-3 p-0 text-cinza-escuro">
            <li>
              <a className={`${linkCls} break-all`} href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <a className={linkCls} href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener">
                {settings.phone}
              </a>{' '}
              — atendimento por agendamento
            </li>
            <li>
              <a className={linkCls} href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener">
                Instagram · @{settings.instagram}
              </a>
            </li>
            {settings.address && <li>{settings.address}</li>}
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col gap-4 border-t border-sinal/15 py-7 text-[0.82rem] text-cinza-escuro md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="m-0 max-w-[78ch]">
            Conteúdo institucional de caráter informativo, em conformidade com o
            Código de Ética e Disciplina da OAB, o Estatuto da Advocacia (Lei
            8.906/94) e o Provimento CFOAB nº 205/2021. Não constitui oferta de
            serviços nem aconselhamento jurídico individualizado.
          </p>
          <p className="rotulo m-0 shrink-0 text-[10px]">
            © <span>{new Date().getFullYear()}</span> {settings.firmName}
          </p>
        </div>
      </div>
    </footer>
  );
}
