from typing import List
from dbconfig import execute_query
from models.Empresa import *

def get_all_empresas() -> List[EmpresaSimples]:
    query = """
        SELECT *
        FROM (
            SELECT DISTINCT 
                ID, 
                DS_CNAE AS CNAE, 
                ISNULL(CLASSIFICACAO, 'Não Classificado') AS CLASSIFICACAO
        FROM CLIENTE
        ) AS SUB;
    """
    resultados = execute_query(query)
    empresas = []
    for row in resultados:
        empresas.append(
            EmpresaSimples(
                nome=row.get("ID"),
                cnpj=row.get("ID"),
                classificacao=row.get("CLASSIFICACAO", ""),
                cnae=row.get("CNAE", "")
                )
            )
    return empresas

def get_empresa_by_id(id: str) -> Empresa:
    query = f"""
        SELECT DISTINCT
            C.ID as [NAME],
            C.ID as CNPJ,
            S.SALDO_TOTAL_CLIENTE AS SALDO,
            CAST(
                (
                SELECT (SUM( FC.SALDO_MES) / COUNT(*)) FROM FATURAMENTO_CLIENTE FC WHERE FC.CLIENTE = C.ID
                ) AS DECIMAL(18,2)
            ) AS MEDIA, -- CAMPO 2
            C.CLASSIFICACAO, --CAMPO 3
            C.DS_CNAE AS RAMO -- CAMPO 4
        FROM CLIENTE C
        LEFT JOIN SALDO_CLIENTE S ON C.ID = CLIENTE
        WHERE C.ID = '{id}'
        GROUP BY C.ID, C.CLASSIFICACAO, C.DS_CNAE, S.SALDO_TOTAL_CLIENTE
    """
    resultados = execute_query(query)
    if resultados:
        row = resultados[0]
        cnae = row.get("RAMO", "")
        empresa_infos = get_empresa_infos(id, cnae)
        empresa = Empresa(
            nome=row.get("NAME"),
            cnpj=row.get("CNPJ"),
            saldo_total=row.get("SALDO", 0.0) if row.get("SALDO") is not None else 0.0,
            medLucro=row.get("MEDIA", 0.0) if row.get("MEDIA") is not None else 0.0,
            cnae=cnae,
            classificacao=row.get("CLASSIFICACAO", "") if row.get("CLASSIFICACAO") is not None else "Não Classificado",
            saldos=empresa_infos["saldos"] if "saldos" in empresa_infos else [],
            relacionamentos=empresa_infos.get("relacionamentos", Relacionamentos(pagadores=[], recebedores=[]))
        )
        return empresa
    return None

def get_empresa_infos(id: str, cnae: str) -> object:
    empresa_infos = {
        "saldos": get_saldos(id),
        "relacionamentos": get_relacionamentos(id)
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
        saldos.append(
            Saldo(
                data=row.get("MES_REFERENCIA"), 
                saldo=row.get("SALDO_MES", 0.0) if row.get("SALDO_MES") is not None else 0.0
                )
            )
    return saldos

# TO DO: Query para os 2 métodos abaixo

def get_relacionamentos(id: str) -> Relacionamentos:
    # Implementação para buscar relacionamentos no banco de dados
    pagadores = get_pagadores_por_tipo(id, "SAIDA")
    recebedores = get_pagadores_por_tipo(id, "ENTRADA")
    return Relacionamentos(pagadores=pagadores, recebedores=recebedores)

def get_pagadores_por_tipo(id: str, tipo_pagador: str) -> List[Relacionamento]:
    query = f"""
    SELECT TOP 5
        R.PARCEIRO,
        SUM(R.ENTRADA) AS TOTAL_ENTRADA,
        SUM(R.SAIDA) AS TOTAL_SAIDA,
        COUNT(*) AS INTERACOES
    FROM (
    SELECT 
        F.ID_RCBE AS PARCEIRO,
        0 AS ENTRADA,
        TRY_CAST(REPLACE(CAST(F.VL AS VARCHAR), ',', '') AS DECIMAL(18,2)) AS SAIDA
    FROM FATURAMENTO F
    WHERE F.ID_PGTO = '{id}'

    UNION ALL

    SELECT 
        F.ID_PGTO AS PARCEIRO,
        TRY_CAST(REPLACE(CAST(F.VL AS VARCHAR), ',', '') AS DECIMAL(18,2)) AS ENTRADA,
        0 AS SAIDA
    FROM FATURAMENTO F
    WHERE F.ID_RCBE = '{id}'
    ) R
    WHERE R.{tipo_pagador} <> 0
    GROUP BY R.PARCEIRO
    ORDER BY INTERACOES DESC, TOTAL_{tipo_pagador} DESC
    """
    resultados = execute_query(query)
    recebedores = []
    for row in resultados:
        recebedores.append(
            Relacionamento(
                    cnpj=row.get("PARCEIRO"),
                    nome=row.get("PARCEIRO"),
                    totalEnt=row.get("TOTAL_ENTRADA", 0.0),
                    totalSai=row.get("TOTAL_SAIDA", 0.0),
                    interacoes=row.get("INTERACOES", 0)
                )
            )
    return recebedores