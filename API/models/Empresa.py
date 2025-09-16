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

class RelacionamentoRecebedores(BaseModel):
    cnpj: str
    nome: str
    totalEnt: float
    totalSai: float

class Semelhante(BaseModel):
    cnpj: str
    nome: str
    classificacao: str

class Empresa(BaseModel):
    nome: str
    cnpj: str
    faturamento: float
    medLucro: float | None
    classificacao: str | None
    cnae: str
    saldos: List[Saldo]
    relacionamentosPagadores: List[RelacionamentoPagadores]
    relacionamentosRecebedores: List[RelacionamentoRecebedores]
    semelhantes: List[Semelhante]