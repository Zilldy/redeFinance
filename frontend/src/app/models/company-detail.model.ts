export interface Balance {
  date: string;
  balance: number;
}

export interface Relationship {
  cnpj: string;
  name: string;
  totalIn: number;
  totalOut: number;
  interactions: number;
}

export interface Relationships {
  payers: Relationship[];
  receivers: Relationship[];
}

export interface Similar {
  cnpj: string;
  name: string;
  cnae: string;
  classification: string | null;
}

export class CompanyDetail {
  name!: string;
  cnpj!: string;
  totalBalance!: number;
  avgProfit!: number | null;
  classification!: string | null;
  cnae!: string;
  balances!: Balance[];
  relationships!: Relationships;
  similar!: Similar[];
}
