import Link from 'next/link';
import { Medicao, PreferenciasCookies } from '@/components/medicao';
import { HA_MEDICAO } from '@/lib/medicao';
import { getSettings } from '@/lib/reader';

/**
 * Layout das landings de anúncio (/f/<frente>): sem menu de saída. Só a
 * marca (dentro da página), o conteúdo, o aviso de medição e um rodapé
 * mínimo com a identificação da OAB e os links legais (privacidade, aviso de
 * publicidade), que a lei e a OAB exigem.
 */
export default async function LayoutFrente({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const linkCls = 'text-cinza-escuro underline underline-offset-2 hover:text-white';
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <main id="conteudo">{children}</main>
      <footer className="planta relative isolate overflow-hidden pb-24 pt-10 text-[0.85rem] text-cinza-escuro">
        <div className="container relative grid gap-4">
          <p className="m-0 text-white">
            <strong className="font-[650]">{settings.firmName}</strong> · {settings.lawyerName} · {settings.oab}
          </p>
          {settings.address && <p className="m-0">{settings.address}</p>}
          <p className="m-0 flex flex-wrap gap-x-5 gap-y-1">
            <Link className={linkCls} href="/politica-de-privacidade">Política de Privacidade</Link>
            <Link className={linkCls} href="/aviso-publicidade">Aviso de Publicidade</Link>
            {HA_MEDICAO && (
              <PreferenciasCookies className={`${linkCls} cursor-pointer border-0 bg-transparent p-0 text-left font-[inherit]`} />
            )}
          </p>
          <p className="m-0 max-w-[80ch]">
            Conteúdo informativo, em conformidade com o Código de Ética e Disciplina da OAB, o Estatuto da Advocacia
            (Lei 8.906/94) e o Provimento CFOAB nº 205/2021. Não constitui oferta de serviços nem aconselhamento
            jurídico individualizado. Nenhum resultado é garantido.
          </p>
        </div>
      </footer>
      <Medicao />
    </>
  );
}
