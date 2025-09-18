from typing import List
from pydantic import BaseModel
from models.Enum.AnaliseGeralEnums import *

class QtdTipoTransacao(BaseModel):
    tipo: TipoTransacaoEnum
    quantidade: int

class TipoTransacao(BaseModel):
    tipo: TipoTransacaoEnum
    valor_total: float

class Classificacao(BaseModel):
    classificacao: ClassificacaoEnum
    quantidade: int
    porcentagem: float

class AnaliseGeral(BaseModel):
    total_empresas: int
    empresas_declinio: int
    qtdTipoTransacao: QtdTipoTransacao
    tipoTransacao: List[TipoTransacao]
    classificacoes: List[Classificacao]