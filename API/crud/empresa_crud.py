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
        SELECT DISTINCT
            C.ID as NAME,
            C.ID as CNPJ,
            SUM(S.SALDO_TOTAL_CLIENTE) AS SALDO,
                CAST(
                (
                SELECT 
                    SUM(
                    TRY_CAST(REPLACE(REPLACE(LTRIM(RTRIM(FC.SALDO_MES)), '+', ''), ',', '') AS DECIMAL(18,2))
                    ) / COUNT(*)
                FROM FATURAMENTO_CLIENTE FC
                WHERE FC.CLIENTE = C.ID
                ) AS DECIMAL(18,2)
            ) AS MEDIA, -- CAMPO 2
            C.CLASSIFICACAO, --CAMPO 3
            C.DS_CNAE AS RAMO -- CAMPO 4
        FROM CLIENTE C
        JOIN SALDO_CLIENTE S ON C.ID = CLIENTE
        WHERE C.ID = {id}
        GROUP BY C.ID, C.CLASSIFICACAO, C.DS_CNAE
    """
    resultados = execute_query(query)
    cnae = row.get("CLASSIFICACAO", "")
    empresa_infos = get_empresa_infos(id, cnae)
    if resultados:
        row = resultados[0]
        empresa = Empresa(
            nome=row.get("NAME"),
            cnpj=row.get("CNPJ"),
            faturamento=row.get("SALDO", 0.0),
            medLucro=row.get("MEDIA", 0.0),
            cnae=row.get("RAMO", ""),
            classificacao=cnae,
            saldos=empresa_infos["saldos"], 
            relacionamentos=empresa_infos["relacionamentos"], 
            semelhantes=empresa_infos["semelhantes"] 
        )
        return empresa
    return None

def get_empresa_infos(id: str, cnae: str) -> object:
    empresa_infos = {
        "saldos": get_saldos(id),
        "relacionamentos": get_relacionamentos(id),
        "semelhantes": get_semelhantes(cnae)
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
                saldo=row.get("SALDO_MES", 0.0).replace(',', '')
                )
            )
    return saldos

# TO DO: Query para os 2 métodos abaixo

def get_relacionamentos(id: str) -> Relacionamentos:
    # Implementação para buscar relacionamentos no banco de dados
    pagadores = get_pagadores(id)
    recebedores = get_recebedores(id)
    return Relacionamentos(pagadores=pagadores, recebedores=recebedores)

def get_pagadores(id: str) -> List[RelacionamentoPagadores]:
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
    WHERE F.ID_PGTO = {id}

    UNION ALL

    SELECT 
        F.ID_PGTO AS PARCEIRO,
        TRY_CAST(REPLACE(CAST(F.VL AS VARCHAR), ',', '') AS DECIMAL(18,2)) AS ENTRADA,
        0 AS SAIDA
    FROM FATURAMENTO F
    WHERE F.ID_RCBE = {id}
    ) R
    GROUP BY R.PARCEIRO
    ORDER BY INTERACOES DESC, TOTAL_SAIDA DESC
    """
    resultados = execute_query(query)
    pagadores = []
    for row in resultados:
        pagadores.append(
            RelacionamentoPagadores(
                    cnpj=row.get("PARCEIRO"),
                    nome=row.get("PARCEIRO"),
                    totalEnt=row.get("TOTAL_ENTRADA", 0.0),
                    totalSai=row.get("TOTAL_SAIDA", 0.0),
                    interacoes=row.get("INTERACOES", 0)
                )
            )
    return pagadores

def get_recebedores(id: str) -> List[RelacionamentoRecebedores]:
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
    WHERE F.ID_PGTO = @ID

    UNION ALL

    SELECT 
        F.ID_PGTO AS PARCEIRO,
        TRY_CAST(REPLACE(CAST(F.VL AS VARCHAR), ',', '') AS DECIMAL(18,2)) AS ENTRADA,
        0 AS SAIDA
    FROM FATURAMENTO F
    WHERE F.ID_RCBE = @ID
    ) R
    GROUP BY R.PARCEIRO
    ORDER BY INTERACOES DESC, TOTAL_ENTRADA DESC
    """
    resultados = execute_query(query)
    recebedores = []
    for row in resultados:
        recebedores.append(
            RelacionamentoRecebedores(
                    cnpj=row.get("PARCEIRO"),
                    nome=row.get("PARCEIRO"),
                    totalEnt=row.get("TOTAL_ENTRADA", 0.0),
                    totalSai=row.get("TOTAL_SAIDA", 0.0),
                    interacoes=row.get("INTERACOES", 0)
                )
            )
    return recebedores

def get_semelhantes(cnae: str) -> List[Semelhante]:
    query = f"""
        SELECT DISTINCT 
            ID, 
            DS_CNAE, 
            CLASSIFICACAO  
        FROM CLIENTE where DS_CNAE = {cnae}
    """
    resultados = execute_query(query)
    semelhantes = []
    for row in resultados:
        semelhantes.append(
            Semelhante(
                cnpj=row.get("ID"),
                nome=row.get("ID"),
                cnae=cnae,
                classificacao=row.get("CLASSIFICACAO")
                )
            )
    return semelhantes