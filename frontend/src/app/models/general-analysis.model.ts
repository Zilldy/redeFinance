

export enum TransactionTypeEnum {
  PIX = 'PIX',
  TED = 'TED',
  BOLETO = 'BOLETO',
  SISTEMICO = 'SISTEMICO',
}

export interface TransactionTypeCount {
  type: TransactionTypeEnum;
  quantity: number;
}

export interface TransactionType {
  type: TransactionTypeEnum;
  totalValue: number;
}

export enum ClassificationEnum {
  INICIO = 'Início',
  EXPANSAO = 'Expansão',
  MADURA = 'Madura',
  DECLINIO = 'Declínio',
  NAO_CLASSIFICADO = 'Não Classificado',
}

export interface Classification {
  classification: ClassificationEnum;
  quantity: number;
  percentage: number;
}

export class GeneralAnalysis {
  totalCompanies!: number;
  decliningCompanies!: number;
  transactionTypeCount!: TransactionTypeCount;
  transactionTypes!: TransactionType[];
  classifications!: Classification[];
}
