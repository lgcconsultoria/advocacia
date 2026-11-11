# Fontes do reforço dos 5 posts (27/10/2026)

Cada afirmação legal nova ou conferida, com a fonte consultada. Método: leitura do texto no Planalto e no portal do STF
por WebFetch (o `curl` não obteve resposta do Planalto). Quando o texto veio resumido ou só em trecho, está marcado
"parcial": o revisor deve cotejar o dispositivo inteiro. Nenhum número de jurisprudência foi incluído sem fonte; ver "Omitido".

URLs-base:
- L14133 = https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm
- L8112 = https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm
- L12016 = https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm
- L9784 = https://www.planalto.gov.br/ccivil_03/leis/l9784.htm
- CF = https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm

## Impugnação ao edital

| Afirmação no post | Dispositivo | Fonte | Situação |
|---|---|---|---|
| Qualquer pessoa pode impugnar o edital por irregularidade na aplicação da lei; protocolo até 3 dias úteis antes da abertura | Lei 14.133, art. 164, caput | L14133 | Conferido (trecho literal; a frase "irregularidade" aparece no caput) |
| Resposta divulgada em até 3 dias úteis, limitada ao último dia útil anterior à abertura | art. 164, parágrafo único | L14133 | Conferido |
| Prazos contados com exclusão do dia do começo e inclusão do dia do vencimento | art. 183, caput | L14133 | Conferido |
| Recurso em 3 dias úteis da intimação ou da lavratura da ata, contra julgamento das propostas (b) e habilitação ou inabilitação (c) | art. 165, I, "b" e "c" | L14133 | Conferido |
| Qualquer licitante, contratado ou pessoa pode representar ao controle interno ou ao tribunal de contas contra irregularidades | art. 170, § 4º | L14133 | Conferido |
| Licitação pública com igualdade de condições a todos os concorrentes | CF, art. 37, XXI | CF | Parcial (trecho "mantidas as condições efetivas da proposta... o qual somente permitirá as exigências" visto; a parte inicial é o texto conhecido do inciso) |

Rotas internas conferidas no código: `/licitacoes`, `/licitacoes/impugnacao-de-edital`, `/licitacoes/recurso-administrativo` (`lib/licitacoes/dores.ts`), `/licitacoes/mandado-de-seguranca` (`app/(site)/licitacoes/mandado-de-seguranca/page.tsx`), `/blog/mandado-de-seguranca-analise-de-cabimento`.

## Eliminação em concurso

| Afirmação | Dispositivo | Fonte | Situação |
|---|---|---|---|
| Acesso a cargos e investidura por concurso | CF, art. 37, I e II | CF | Conferido (parcial: trechos do caput de cada inciso) |
| Lesão ou ameaça a direito não é excluída do Judiciário | CF, art. 5º, XXXV | CF | Conferido |
| Contraditório e ampla defesa em processo administrativo | CF, art. 5º, LV | CF | Conferido |
| Motivação dos atos que decidam concurso ou seleção pública (Administração federal) | Lei 9.784, art. 50, III; art. 1º (âmbito federal) | L9784 | Conferido |
| Prazo de 120 dias do MS, da ciência | Lei 12.016, art. 23 | L12016 | Conferido |
| Judiciário não substitui a banca para reexaminar conteúdo das questões e critérios de correção, salvo ilegalidade ou inconstitucionalidade | STF, Tema 485, RE 632.853, rel. Min. Gilmar Mendes | Portal STF (página do Tema 485: paradigma RE 632853, relator, tema "controle jurisdicional de questões de concurso"); texto da tese e dados (Pleno, 23/04/2015) conferidos na página do TJDFT: https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/jurisprudencia-em-detalhes/concurso-publico/criterios-de-correcao-de-prova-2013-controle-judicial-2013-excepcionalidade | A página do STF não exibiu o texto da tese. O post parafraseia e não cita data nem DJe. Revisor: cotejar a tese no STF |
| Só por lei se pode sujeitar a exame psicotécnico a habilitação de candidato a cargo público | Súmula Vinculante 44 | https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=26&sumula=2358 | Conferido (enunciado literal) |
| É inconstitucional o veto não motivado à participação de candidato a concurso público | Súmula 684/STF | https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=30&sumula=3631 | Conferido (enunciado literal) |

Rotas: `/areas/concursos`, `/areas/mandado-de-seguranca`, `/blog/mandado-de-seguranca-analise-de-cabimento`.

## Processo administrativo disciplinar

| Afirmação | Dispositivo | Fonte | Situação |
|---|---|---|---|
| Lei 8.112 vale para servidores civis da União, autarquias e fundações públicas federais | art. 1º | L8112 | Conferido |
| Penalidades: advertência, suspensão, demissão, cassação de aposentadoria ou disponibilidade, destituição de cargo em comissão e de função comissionada | art. 127, I a VI | L8112 | Conferido |
| PAD apura responsabilidade de servidor por infração no exercício de atribuições ou com elas relacionada | art. 148 | L8112 | Conferido (resumo do texto; cotejar a redação literal) |
| PAD obrigatório quando houver suspensão por mais de 30 dias, demissão, cassação ou destituição de cargo em comissão | art. 146 | L8112 | Conferido |
| Sindicância pode resultar em arquivamento, advertência ou suspensão até 30 dias, ou instauração de PAD | art. 145 | L8112 | Conferido |
| Prescrição: 5 anos (demissão); abertura de sindicância ou PAD interrompe | art. 142, I e § 3º | L8112 | Conferido (trecho literal) |
| Comissão de 3 servidores estáveis; vedado cônjuge, companheiro ou parente do acusado; independência e imparcialidade | arts. 149, caput e § 2º, e 150 | L8112 | Conferido (trecho literal) |
| Fases: instauração, inquérito (instrução, defesa, relatório) e julgamento | art. 151 | L8112 | Conferido |
| Contraditório e ampla defesa no inquérito | art. 153 | L8112 | Conferido |
| Direito de acompanhar o processo pessoalmente ou por procurador | art. 156, caput | L8112 | Conferido |
| Procurador pode assistir ao interrogatório e à inquirição de testemunhas | art. 159, § 2º | L8112 | Conferido |
| Citação para defesa escrita em 10 dias com vista do processo; prorrogação pelo dobro para diligências indispensáveis | art. 161, §§ 1º e 3º | L8112 | Conferido (§ 3º literal; prazo de 10 dias e vista na repartição pelo resumo do § 1º) |
| Julgamento em 20 dias; acata o relatório salvo se contrário às provas | arts. 167, caput, e 168 | L8112 | Conferido |
| Vício insanável leva à nulidade total ou parcial e a nova comissão | art. 169, caput | L8112 | Conferido (resumo) |
| Servidor estável só perde o cargo por sentença transitada, processo administrativo com ampla defesa ou avaliação periódica | CF, art. 41, § 1º | CF | Conferido |
| A falta de defesa técnica por advogado no PAD não ofende a Constituição | Súmula Vinculante 5 | https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=26&sumula=1199 | Conferido (literal, DJe 16-5-2008) |

Rotas: `/areas/servidores`, `/areas/defesa-agentes`, `/blog/mandado-de-seguranca-analise-de-cabimento`.

## Reequilíbrio econômico-financeiro

| Afirmação | Dispositivo | Fonte | Situação |
|---|---|---|---|
| Alteração por acordo para restabelecer equilíbrio em caso de força maior, caso fortuito, fato do príncipe ou fatos imprevisíveis ou previsíveis de consequências incalculáveis que inviabilizem a execução, respeitada a repartição objetiva de risco | art. 124, II, "d" | L14133 | Conferido (literal) |
| Matriz de riscos: cláusula definidora de riscos e responsabilidades e do equilíbrio inicial | art. 6º, XXVII | L14133 | Conferido (a lei usa "matriz de riscos" no art. 6º; "matriz de alocação de riscos" no art. 103) |
| Matriz define o equilíbrio inicial e deve ser observada nos pleitos; efeito do § 5º e suas exceções | art. 103, §§ 4º e 5º | L14133 | Conferido (literal) |
| Alteração unilateral: restabelecer o equilíbrio no mesmo termo aditivo | art. 130 | L14133 | Conferido |
| Pedido durante a vigência e antes de eventual prorrogação; extinção não impede reconhecimento, com termo indenizatório | art. 131, caput e parágrafo único | L14133 | Conferido |
| Formalização do termo aditivo como condição para execução de prestações determinadas pela Administração | art. 132 | L14133 | Conferido (citado só como base do termo aditivo) |
| Tributos: preços alterados para mais ou para menos | art. 134 | L14133 | Conferido (resumo: "após a apresentação da proposta") |
| Repactuação para serviços contínuos com dedicação exclusiva de mão de obra; interregno mínimo de 1 ano | art. 135 | L14133 | Conferido |
| Apostila para reajuste ou repactuação previstos no contrato | art. 136 | L14133 | Conferido (resumo dos incisos) |
| Índice de reajustamento obrigatório no edital, com data-base; interregno mínimo de 1 ano; reajustamento em sentido estrito ou repactuação | art. 25, §§ 7º e 8º | L14133 | Conferido (literal) |
| Reajustamento em sentido estrito: aplicação do índice previsto no contrato | art. 6º, LVIII | L14133 | Conferido |
| Contrato assinado antes da vigência continua regido pela lei revogada | art. 190 | L14133 | Conferido |

Rotas: `/areas/contratos-publicos`, `/licitacoes`, `/blog/impugnacao-ao-edital-prazos-e-estrategia`.

## Mandado de segurança

| Afirmação | Dispositivo | Fonte | Situação |
|---|---|---|---|
| MS contra ilegalidade ou abuso de poder que viole direito líquido e certo | Lei 12.016, art. 1º, caput | L12016 | Conferido |
| Equiparados a autoridades; § 2º exclui atos de gestão comercial; § 3º legitimados | art. 1º, §§ 1º a 3º | L12016 | Conferido |
| Não se concede MS contra ato com recurso administrativo com efeito suspensivo, decisão judicial com recurso suspensivo, trânsito em julgado | art. 5º, I a III | L12016 | Conferido |
| Inicial indica a autoridade coatora e a pessoa jurídica; conceito de autoridade coatora | art. 6º, caput e § 3º | L12016 | Conferido |
| Liminar: fundamento relevante e risco de ineficácia; caução; vedações | art. 7º, III e § 2º | L12016 | Conferido |
| Inicial indeferida quando decorrido o prazo legal | art. 10, caput | L12016 | Conferido |
| Pagamento de vencimentos a servidor só quanto às prestações vencidas a contar do ajuizamento | art. 14, § 4º | L12016 | Conferido |
| Prazo de 120 dias da ciência | art. 23 | L12016 | Conferido |
| CF, art. 5º, LXIX e LXX | CF | CF | Conferido (já constava no post) |
| Súmula 266/STF (lei em tese) | portal STF base=30 sumula=2459 | https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=30&sumula=2459 | Enunciado confirmado em buscas; página oficial mostra só jurisprudência |
| Súmula 269/STF | https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=30&sumula=2468 | | Conferido (literal) |
| Súmula 271/STF (efeitos patrimoniais; "reclamados administrativamente ou pela via judicial própria") | | compêndio do TJMG: https://www8.tjmg.jus.br/enciclopedia-nugep/DoMandadodeSeguranca.html | Fonte secundária oficial de tribunal; não achada a página do STF. Revisor: cotejar |
| Súmula 625/STF | https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=30&sumula=2817 | | Enunciado confirmado em busca; página do STF indicada no resultado |

Rotas: `/areas/mandado-de-seguranca`, `/licitacoes/mandado-de-seguranca`, `/blog/eliminacao-concurso-controle-judicial`, `/blog/processo-administrativo-disciplinar-defesa`.

## Omitido ou TODO

- Nenhum número de processo além do Tema 485 (RE 632.853) foi usado. Súmula 343/STJ (advogado obrigatório no PAD) foi deliberadamente omitida: confronta a SV 5 e não foi conferida em fonte oficial.
- Tema 485: tese literal não confirmada na página do próprio STF (só no TJDFT). Revisor deve cotejar.
- Súmulas 266 e 625: enunciado confirmado por busca, não pela página oficial (que exibiu só jurisprudência aplicada). Já constavam no post.
- Art. 37, XXI, da CF: texto inicial do inciso não visto na íntegra (apenas a parte final).
- Arts. 148, 161 § 1º, 169 e 134: texto conferido por resumo do fetch, não por transcrição literal.
- Lei 9.784 e Lei 8.112 são federais; os posts avisam. Leis estaduais e municipais (estatutos, processo administrativo) não foram conferidas.
- Contagem de prazos da Lei 14.133 (art. 183) só no caput; incisos e parágrafos não citados.
- Não foi feita revisão de OAB além da leitura própria: sem promessa de resultado, comparação, preço, superlativo ou caso reconhecível. O revisor independente (`revisao-peca`) ainda deve passar pelos 5 posts.
