// Tabelas de referência do termômetro: as 27 UFs (com a capital e suas
// coordenadas, para o globo/mapa), as modalidades da Lei 14.133/2021 e as
// esferas, com os códigos usados pelo PNCP.

export interface ReferenciaUf {
  uf: string;
  nome: string;
  capital: string;
  lat: number;
  lng: number;
}

/** Coordenadas da capital de cada UF (graus decimais, WGS84). */
export const UFS: readonly ReferenciaUf[] = [
  { uf: 'AC', nome: 'Acre', capital: 'Rio Branco', lat: -9.9747, lng: -67.8243 },
  { uf: 'AL', nome: 'Alagoas', capital: 'Maceió', lat: -9.6658, lng: -35.735 },
  { uf: 'AP', nome: 'Amapá', capital: 'Macapá', lat: 0.0349, lng: -51.0694 },
  { uf: 'AM', nome: 'Amazonas', capital: 'Manaus', lat: -3.119, lng: -60.0217 },
  { uf: 'BA', nome: 'Bahia', capital: 'Salvador', lat: -12.9714, lng: -38.5014 },
  { uf: 'CE', nome: 'Ceará', capital: 'Fortaleza', lat: -3.7319, lng: -38.5267 },
  { uf: 'DF', nome: 'Distrito Federal', capital: 'Brasília', lat: -15.7939, lng: -47.8828 },
  { uf: 'ES', nome: 'Espírito Santo', capital: 'Vitória', lat: -20.3155, lng: -40.3128 },
  { uf: 'GO', nome: 'Goiás', capital: 'Goiânia', lat: -16.6869, lng: -49.2648 },
  { uf: 'MA', nome: 'Maranhão', capital: 'São Luís', lat: -2.5307, lng: -44.3068 },
  { uf: 'MT', nome: 'Mato Grosso', capital: 'Cuiabá', lat: -15.601, lng: -56.0974 },
  { uf: 'MS', nome: 'Mato Grosso do Sul', capital: 'Campo Grande', lat: -20.4697, lng: -54.6201 },
  { uf: 'MG', nome: 'Minas Gerais', capital: 'Belo Horizonte', lat: -19.9167, lng: -43.9345 },
  { uf: 'PA', nome: 'Pará', capital: 'Belém', lat: -1.4558, lng: -48.4902 },
  { uf: 'PB', nome: 'Paraíba', capital: 'João Pessoa', lat: -7.1195, lng: -34.845 },
  { uf: 'PR', nome: 'Paraná', capital: 'Curitiba', lat: -25.4284, lng: -49.2733 },
  { uf: 'PE', nome: 'Pernambuco', capital: 'Recife', lat: -8.0476, lng: -34.877 },
  { uf: 'PI', nome: 'Piauí', capital: 'Teresina', lat: -5.0892, lng: -42.8019 },
  { uf: 'RJ', nome: 'Rio de Janeiro', capital: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { uf: 'RN', nome: 'Rio Grande do Norte', capital: 'Natal', lat: -5.7945, lng: -35.211 },
  { uf: 'RS', nome: 'Rio Grande do Sul', capital: 'Porto Alegre', lat: -30.0346, lng: -51.2177 },
  { uf: 'RO', nome: 'Rondônia', capital: 'Porto Velho', lat: -8.7612, lng: -63.9004 },
  { uf: 'RR', nome: 'Roraima', capital: 'Boa Vista', lat: 2.8235, lng: -60.6758 },
  { uf: 'SC', nome: 'Santa Catarina', capital: 'Florianópolis', lat: -27.5954, lng: -48.548 },
  { uf: 'SP', nome: 'São Paulo', capital: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { uf: 'SE', nome: 'Sergipe', capital: 'Aracaju', lat: -10.9472, lng: -37.0731 },
  { uf: 'TO', nome: 'Tocantins', capital: 'Palmas', lat: -10.2491, lng: -48.3243 },
];

/** Modalidades de contratação (código PNCP → nome exibido pelo PNCP). */
export const MODALIDADES: readonly { id: number; nome: string }[] = [
  { id: 1, nome: 'Leilão - Eletrônico' },
  { id: 2, nome: 'Diálogo Competitivo' },
  { id: 3, nome: 'Concurso' },
  { id: 4, nome: 'Concorrência - Eletrônica' },
  { id: 5, nome: 'Concorrência - Presencial' },
  { id: 6, nome: 'Pregão - Eletrônico' },
  { id: 7, nome: 'Pregão - Presencial' },
  { id: 8, nome: 'Dispensa' },
  { id: 9, nome: 'Inexigibilidade' },
  { id: 10, nome: 'Manifestação de Interesse' },
  { id: 11, nome: 'Pré-qualificação' },
  { id: 12, nome: 'Credenciamento' },
  { id: 13, nome: 'Leilão - Presencial' },
];

/** Esferas (campo `esfera_id` da busca do PNCP). */
export const ESFERAS: readonly { id: string; nome: string }[] = [
  { id: 'M', nome: 'Municipal' },
  { id: 'E', nome: 'Estadual' },
  { id: 'F', nome: 'Federal' },
  { id: 'D', nome: 'Distrital' },
];
