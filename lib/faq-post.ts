/**
 * Extrai o bloco "Perguntas frequentes" de um artigo do blog (AST do Markdoc)
 * e monta o JSON-LD FAQPage. Convenção do conteúdo: um título de nível 2
 * "Perguntas frequentes"; cada pergunta é um título de nível 3 e a resposta
 * são os blocos seguintes, até a próxima pergunta ou seção.
 */

export type NoAst = {
  type: string;
  attributes?: Record<string, unknown>;
  children?: NoAst[];
};

export type PerguntaFaq = { pergunta: string; resposta: string };

function textoDe(no: NoAst): string {
  if ((no.type === 'text' || no.type === 'code') && typeof no.attributes?.content === 'string') {
    return no.attributes.content;
  }
  if (no.type === 'softbreak' || no.type === 'hardbreak') return ' ';
  return (no.children ?? []).map(textoDe).join('');
}

function limpar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}

function nivel(no: NoAst): number | null {
  return no.type === 'heading' && typeof no.attributes?.level === 'number'
    ? (no.attributes.level as number)
    : null;
}

function ehTituloFaq(texto: string): boolean {
  return /^perguntas?\s+frequentes?\b/i.test(limpar(texto));
}

export function extrairFaq(documento: NoAst): PerguntaFaq[] {
  const blocos = documento.children ?? [];
  const inicio = blocos.findIndex((b) => nivel(b) === 2 && ehTituloFaq(textoDe(b)));
  if (inicio === -1) return [];

  const perguntas: PerguntaFaq[] = [];
  let atual: { pergunta: string; partes: string[] } | null = null;

  const fechar = () => {
    if (!atual) return;
    const resposta = limpar(atual.partes.join(' '));
    if (atual.pergunta && resposta) perguntas.push({ pergunta: atual.pergunta, resposta });
    atual = null;
  };

  for (const bloco of blocos.slice(inicio + 1)) {
    const n = nivel(bloco);
    if (n !== null && n <= 2) break;
    if (n === 3) {
      fechar();
      atual = { pergunta: limpar(textoDe(bloco)), partes: [] };
      continue;
    }
    if (atual) atual.partes.push(textoDe(bloco));
  }
  fechar();
  return perguntas;
}

export function faqLd(perguntas: PerguntaFaq[], urlPagina: string) {
  if (perguntas.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${urlPagina}#faq`,
    inLanguage: 'pt-BR',
    mainEntity: perguntas.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  };
}
