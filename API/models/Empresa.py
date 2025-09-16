from pydantic import BaseModel
from typing import List

class Saldo(BaseModel):
    data: str
    saldo: float

class RelacionamentoPagadores(BaseModel):
    cnpj: str
    nome: str
    totalEnt: float
    totalSai: float
    interacoes: int

class RelacionamentoRecebedores(BaseModel):
    cnpj: str
    nome: str
    totalEnt: float
    totalSai: float
    interacoes: int

class Relacionamentos(BaseModel):
    pagadores: List[RelacionamentoPagadores]
    recebedores: List[RelacionamentoRecebedores]

class Semelhante(BaseModel):
    cnpj: str
    nome: str
    cnae: str
    classificacao: str

class Empresa(BaseModel):
    nome: str
    cnpj: str
    saldo_total: float
    medLucro: float | None
    classificacao: str | None
    cnae: str
    saldos: List[Saldo]
    relacionamentos: Relacionamentos
    semelhantes: List[Semelhante]