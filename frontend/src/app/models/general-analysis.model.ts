export enum TransactionTypeEnum {
  PIX = 'PIX',
  TED = 'TED',
  BOLETO = 'BOLETO',
  SISTEMICO = 'SISTEMICO',
}

export interface TransactionTypeCount {
  tipo: TransactionTypeEnum;
  quantidade: number;
}

export interface TransactionType {
  tipo: TransactionTypeEnum;
  valor_total: number;
}

export enum ClassificationEnum {
  INICIO = 'Início',
  EXPANSAO = 'Expansão',
  MADURA = 'Madura',
  DECLINIO = 'Declínio',
  NAO_CLASSIFICADO = 'Não Classificado',
}

export interface Classification {
  classificacao: ClassificationEnum;
  porcentagem: number;
  quantidade: number;
}

export class GeneralAnalysis {
  total_empresas!: number;
  empresas_declinio!: number;
  qtdTipoTransacao!: TransactionTypeCount;
  tipoTransacao!: TransactionType[];
  classificacoes!: Classification[];
}
