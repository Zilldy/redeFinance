from pydantic import BaseModel
from typing import List
from datetime import datetime

class Saldo(BaseModel):
    data: datetime
    saldo: float

class Relacionamento(BaseModel):
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
    relacionamentos: List[Relacionamento]
    semelhantes: List[Semelhante]