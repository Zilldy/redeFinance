from fastapi import APIRouter
from fastapi import HTTPException
from typing import List
from models.Empresa import Empresa
from crud.empresa_crud import *

router = APIRouter()

@router.get("/empresas", response_model=List[EmpresaSimples] | None)
def buscar_empresa():
    empresa = get_all_empresas()
    return empresa

@router.get("/empresas/{id}", response_model=Empresa | None)
def buscar_empresa(id: str):
    empresa = get_empresa_by_id(id)
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa