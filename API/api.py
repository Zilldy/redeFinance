from fastapi import FastAPI
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="RedeFinance API", description="API para dashboard financeiro", version="1.0.0")

class Relacionamentos:
    cnpj: str
    nome: str
    totalEnt: float
    totalSai: float

class Semelhantes:
        cnpj: str
        nome: str
        classificacao: str
class Saldos:
        data: datetime
        saldo: float

# Modelos de dados
class Empresa(BaseModel):
    nome: str
    cnpj: str
    faturamento: float
    medLucro: float
    classificacao: str
    cnae: str
    saldos: List[Saldos]
    relacionamentos: List[Relacionamentos]
    semelhantes: List[Semelhantes]

class DashboardKPIs(BaseModel):
    total_empresas: int
    empresas_risco: int
    crescimento: float

# Endpoints

@app.get("/empresas", response_model=List[Empresa])
def listar_empresas():
    # Exemplo estático, substitua por consulta ao banco
    return [
        Empresa(id="1", nome="Carrefour", cnpj="45.543.915/0001-81", classificacao="Expansão"),
        Empresa(id="2", nome="O Boticário", cnpj="11.317.051/0120-01", classificacao="Madura"),
    ]

@app.get("/empresas/{id}", response_model=Empresa)
def buscar_empresa(id: str):
    # Exemplo estático, substitua por consulta ao banco
    return Empresa(id=id, nome="Carrefour", cnpj="45.543.915/0001-81", classificacao="Expansão")
