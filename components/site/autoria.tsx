/** "dd/mm/aaaa" a partir de "aaaa-mm-dd". */
function dataBr(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

/**
 * Linha de autoria das páginas de conteúdo jurídico (dentro do PageHero): quem
 * responde pelo texto e, quando existe uma validação real, a data da última
 * revisão. Não passe `revisadoEm` sem data de validação registrada no código.
 */
export function Autoria({
  nome,
  oab,
  revisadoEm,
}: {
  nome: string;
  oab: string;
  revisadoEm?: string;
}) {
  return (
    <p className="rotulo m-0 mt-8 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-cinza-escuro">
      <span>Advogado responsável: {nome}</span>
      <span aria-hidden="true">·</span>
      <span>{oab}</span>
      {revisadoEm && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Última revisão: <time dateTime={revisadoEm}>{dataBr(revisadoEm)}</time>
          </span>
        </>
      )}
    </p>
  );
}
