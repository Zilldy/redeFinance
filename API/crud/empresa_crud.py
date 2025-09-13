from typing import List
from dbconfig import DatabaseConnection
from models.Empresa import *

def execute_query(query: str) -> List[object]:
    with DatabaseConnection() as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        results = cursor.fetchall()
        colunas = [desc[0] for desc in cursor.description]
        return [dict(zip(colunas, row)) for row in results]

def get_empresa_by_id(id: str) -> Empresa:
    query = f"""
        SELECT
            c.ID as NAME,
            c.ID as CNPJ,
            c.VL_FATU as FATURAMENTO,
            c.DS_CNAE AS DS_CNAE,
            c.CLASSIFICACAO
        FROM CLIENTE c
        WHERE ID = '{id}'
    """
    resultados = execute_query(query)
    empresa_infos = get_empresa_infos(id)
    if resultados:
        row = resultados[0]
        empresa = Empresa(
            nome=row.get("NAME"),
            cnpj=row.get("CNPJ"),
            faturamento=row.get("FATURAMENTO", 0.0),
            medLucro=get_media_lucro(id),
            cnae=row.get("DS_CNAE", ""),
            classificacao=row.get("CLASSIFICACAO", ""),
            saldos=empresa_infos["saldos"], 
            relacionamentos=empresa_infos["relacionamentos"], 
            semelhantes=empresa_infos["semelhantes"] 
        )
        return empresa
    return None

def get_media_lucro(id: str) -> float | None:
    saldo_total = get_saldo_total(id)
    count = get_qtd_meses(id)
    if saldo_total and count and count > 0:
        return saldo_total / count
    return None

def get_saldo_total(id: str) -> float | None:
    query = f"SELECT SALDO_TOTAL_CLIENTE FROM SALDO_CLIENTE WHERE CLIENTE = '{id}'"
    saldo_total = execute_query(query)
    return saldo_total[0].get("SALDO_TOTAL_CLIENTE", 0.0)

def get_qtd_meses(id: str) -> int | None:
    query = f"""
        SELECT COUNT(MES_REFERENCIA) as QTD_MESES FROM FATURAMENTO_CLIENTE
        WHERE CLIENTE = '{id}'
        """
    count = execute_query(query)
    return count[0].get("QTD_MESES", 0)

def get_empresa_infos(id: str) -> object:
    empresa_infos = {
        "saldos": get_saldos(id),
        "relacionamentos": get_relacionamentos(id),
        "semelhantes": get_semelhantes(id)
    }
    return empresa_infos

def get_saldos(id: str) -> List[Saldo]:
    # Implementação para buscar saldos no banco de dados
    query = f"""
        SELECT 
            MES_REFERENCIA,
            SALDO_MES
        FROM FATURAMENTO_CLIENTE 
        WHERE CLIENTE = '{id}'
        ORDER BY CLIENTE, MES_REFERENCIA;
    """
    resultados = execute_query(query)
    saldos = []
    for row in resultados:
        date_str = row.get("MES_REFERENCIA")
        saldos.append(
            Saldo(
                data=row.get("MES_REFERENCIA"), 
                saldo=row.get("SALDO_MES", 0.0).replace(',', '')
                )
            )
    return saldos

# TO DO: Query para os 2 métodos abaixo

def get_relacionamentos(id: str) -> List[Relacionamento]:
    # Implementação para buscar relacionamentos no banco de dados
    return [Relacionamento(cnpj="12.345.678/0001-90", nome="Empresa X", totalEnt=5000.0, totalSai=3000.0)]

def get_semelhantes(id: str) -> List[Semelhante]:
    # Implementação para buscar empresas semelhantes no banco de dados
    return [Semelhante(cnpj="98.765.432/0001-09", nome="Empresa Y", classificacao="Madura")]