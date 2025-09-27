export interface Balance {
  data: string;
  saldo: number;
}

export interface Relationship {
  cnpj: string;
  nome: string;
  totalEnt: number;
  totalSai: number;
  interacoes: number;
}

export interface Relationships {
  pagadores: Relationship[];
  recebedores: Relationship[];
}

export class CompanyDetail {
  nome!: string;
  cnpj!: string;
  saldo_total!: number | null;
  medLucro!: number | null;
  classificacao!: string | null;
  cnae!: string;
  saldos!: Balance[];
  relacionamentos!: Relationships;
}
