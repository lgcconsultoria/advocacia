import type { FaqItem } from '@/components/faq-accordion';
import type { FrenteComLanding } from '@/lib/frentes';

/**
 * Conteúdo de uma landing `/f/<frente>`. Um arquivo por frente, só texto, num
 * lugar só, para o texto passar pelo validador jurídico antes de ir ao ar
 * (Provimento CFOAB 205/2021: informativo, sem promessa de resultado, sem
 * preço, sem caso de cliente, sem captação indevida).
 */
export type ConteudoFrente = {
  frente: FrenteComLanding;
  /** Título e descrição da página (aba do navegador, Google, redes). */
  meta: { titulo: string; descricao: string };
  /** Etiqueta acima do título. */
  rotulo: string;
  /** Título padrão (h1). O `?kw=` do anúncio pode trocá-lo por um de `titulosPorTermo`. */
  titulo: string;
  subtitulo: string;
  dorTitulo: string;
  /** Três situações em que a pessoa se reconhece. */
  dor: readonly [string, string, string];
  /** Três passos de como o escritório trabalha. */
  como: readonly [{ titulo: string; texto: string }, { titulo: string; texto: string }, { titulo: string; texto: string }];
  /** Só o que o site já afirma sobre o escritório. */
  credenciais: readonly string[];
  /** Pergunta aberta do formulário (vai em `detalhe`). */
  pergunta: { rotulo: string; exemplo: string };
  /** Mostrar o campo "Empresa (se houver)". Em branco, vai "Pessoa física". */
  mostrarEmpresa: boolean;
  /** Assunto enviado como `interesse` (a porta só conhece estes três). */
  interesse: 'licitacoes' | 'outro';
  /** Quatro perguntas frequentes. */
  perguntasFrequentes: readonly [FaqItem, FaqItem, FaqItem, FaqItem];
  /** Texto pronto do WhatsApp (o código da frente é acrescentado por `linkWhatsapp`). */
  textoWhatsapp: string;
  /**
   * Lista fechada de títulos por palavra-chave (`?kw=`): a chave é o termo
   * normalizado (minúsculas, sem acento, hífen). Termo fora da lista usa `titulo`.
   */
  titulosPorTermo: Record<string, string>;
};
