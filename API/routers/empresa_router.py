from fastapi import APIRouter
from typing import List
from models.Empresa import Empresa
from crud.empresa_crud import get_saldos, get_relacionamentos, get_semelhantes

router = APIRouter()


@router.get("/empresas", response_model=List[Empresa])
def listar_empresas():
    # Exemplo estático, substitua por consulta ao banco
    return [
        Empresa(nome="Carrefour", cnpj="45.543.915/0001-81", faturamento=1000000, medLucro=50000, classificacao="Expansão", cnae="4711-3/01", saldos=[], relacionamentos=[], semelhantes=[]),
        Empresa(nome="O Boticário", cnpj="11.317.051/0120-01", faturamento=2000000, medLucro=150000, classificacao="Madura", cnae="4772-5/00", saldos=[], relacionamentos=[], semelhantes=[]),
    ]


@router.get("/empresas/{id}", response_model=Empresa)
def buscar_empresa(id: str):
    # Exemplo estático, substitua por consulta ao banco
    saldos = get_saldos(id)
    relacionamentos = get_relacionamentos(id)
    semelhantes = get_semelhantes(id)
    return Empresa(nome="Carrefour", cnpj=id, faturamento=1000000, medLucro=50000, classificacao="Expansão", cnae="4711-3/01", saldos=saldos, relacionamentos=relacionamentos, semelhantes=semelhantes)
