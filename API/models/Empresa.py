from pydantic import BaseModel
from typing import List

class Saldo(BaseModel):
    data: str
    saldo: float

class Relacionamento(BaseModel):
    cnpj: str
    nome: str
    totalEnt: float
    totalSai: float
    interacoes: int

class Relacionamentos(BaseModel):
    pagadores: List[Relacionamento]
    recebedores: List[Relacionamento]

class Empresa(BaseModel):
    nome: str
    cnpj: str
    saldo_total: float | None
    medLucro: float | None
    classificacao: str | None
    cnae: str
    saldos: List[Saldo]
    relacionamentos: Relacionamentos

class EmpresaSimples(BaseModel):
    nome: str
    cnpj: str
    classificacao: str
    cnae: str