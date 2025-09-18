from fastapi import APIRouter
from fastapi import HTTPException
from typing import List
from models.Empresa import Empresa
from crud.empresa_crud import *

router = APIRouter()

@router.get("/empresas/{id}", response_model=Empresa | None)
def buscar_empresa(id: str):
    # Exemplo estático, substitua por consulta ao banco
    empresa = get_empresa_by_id(id)
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa