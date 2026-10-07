import Link from 'next/link';
import { ArrowUpRight, LockKeyhole, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Assinatura } from '@/components/site/marca';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';

/**
 * Rodapé v2 — no espírito do 21st.dev `@solaceui/footer-section-5` (id 19358):
 * a assinatura "SENTURIÃO" gigante e vazada no pé da página, sobre um brilho
 * azul (em CSS, sem shader, para não pesar em todas as páginas). Mantém o que
 * é obrigatório: advogado e OAB, endereço, contato, aviso de publicidade e os
 * links de privacidade (LGPD).
 */

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
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(29_27_154/0.85),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="grade-planta absolute inset-0 -z-10 opacity-[0.10] [mask-image:linear-gradient(180deg,black,transparent_80%)]"
      />

      {/* faixa de contato */}
      <div className="container pt-16 md:pt-20">
        <div className="vidro-escuro grid gap-6 rounded-[28px] p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-10">
          <div className="min-w-0">
            <p className="etiqueta m-0">Atendimento por agendamento</p>
            <p className="expandida m-0 mt-4 max-w-[24ch] text-[clamp(1.5rem,3vw,2.25rem)] font-[780] leading-[1.04] tracking-[-0.035em] text-white">
              Conte o que está acontecendo na sua empresa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <BotaoDiagnostico variant="claro">
              Fazer diagnóstico <ArrowUpRight className="seta h-4 w-4" aria-hidden="true" />
            </BotaoDiagnostico>
            <a
              className="btn btn-lg btn-contorno-claro"
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá, gostaria de agendar um atendimento.')}`}
              target="_blank"
              rel="noopener"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="container grid gap-12 pb-10 pt-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
        <div className="min-w-0">
          <Link href="/" className="inline-block text-white no-underline" title="Página inicial">
            <Assinatura tamanho="lg" />
          </Link>
          <p className="mt-6 max-w-[36ch] text-cinza-escuro">
            Direito Tributário e Direito Público para empresas: Reforma Tributária,
            licitações e contratos públicos, e a defesa contra atos ilegais do
            Poder Público.
          </p>
          <p className="rotulo mt-5 inline-flex rounded-full border border-sinal/30 px-3 py-1.5 text-[10px] text-white/85">
            {settings.lawyerName} · {settings.oab}
          </p>
        </div>

        <div className="min-w-0">
          <h2 className="rotulo m-0 text-[10.5px] text-sinal">Direito Público e Tributário</h2>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            <li>
              <Link className={linkCls} href="/tributario">Assessoria tributária e Reforma</Link>
            </li>
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
            <li><Link className={linkCls} href="/diagnostico">Diagnóstico inicial</Link></li>
            <li><Link className={linkCls} href="/contato">Contato</Link></li>
            <li>
              <Link className={`${linkCls} inline-flex items-center gap-1.5`} href="/entrar">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> Área do cliente
              </Link>
            </li>
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
          <ul className="m-0 mt-4 grid list-none gap-3.5 p-0 text-cinza-escuro">
            <li className="flex gap-2.5">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-sinal" aria-hidden="true" />
              <a className={`${linkCls} break-all`} href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li className="flex gap-2.5">
              <MessageCircle className="mt-1 h-4 w-4 shrink-0 text-sinal" aria-hidden="true" />
              <span>
                <a className={linkCls} href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener">
                  {settings.phone}
                </a>
                <span className="block text-[0.82rem]">atendimento por agendamento</span>
              </span>
            </li>
            {settings.address && (
              <li className="flex gap-2.5">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-sinal" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
            )}
            <li>
              <a className={linkCls} href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener">
                Instagram · @{settings.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col gap-4 border-t border-sinal/15 py-7 text-[0.82rem] text-cinza-escuro md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="m-0 max-w-[80ch]">
            Conteúdo institucional de caráter informativo, em conformidade com o
            Código de Ética e Disciplina da OAB, o Estatuto da Advocacia (Lei
            8.906/94) e o Provimento CFOAB nº 205/2021. Não constitui oferta de
            serviços nem aconselhamento jurídico individualizado. Simulações e
            números ilustrativos não são promessa de resultado.
          </p>
          <p className="rotulo m-0 shrink-0 text-[10px]">
            © <span>{new Date().getFullYear()}</span> {settings.firmName}
          </p>
        </div>
      </div>

      {/* assinatura gigante, vazada */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-[2.2vw] select-none overflow-hidden">
        <p
          className="expandida m-0 whitespace-nowrap text-center text-[11.2vw] font-[900] leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgb(142_139_255/0.35)] bg-[linear-gradient(180deg,rgb(142_139_255/0.22),transparent_75%)] bg-clip-text"
        >
          SENTURIÃO
        </p>
      </div>
    </footer>
  );
}
