from fastapi import APIRouter
from fastapi import HTTPException
from models.AnaliseGeral import AnaliseGeral
from crud.analise_geral_crud import *

router = APIRouter()

@router.get("/analise_geral", response_model=AnaliseGeral)
def buscar_analise_geral():
    analise = get_analise_geral()
    return analise