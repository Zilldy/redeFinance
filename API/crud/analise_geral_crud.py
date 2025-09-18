from typing import List
from dbconfig import execute_query
from models.AnaliseGeral import *

def get_analise_geral() -> AnaliseGeral:
    analise_geral = AnaliseGeral(
        total_empresas=get_total_empresas(),
        empresas_declinio=get_empresas_declinio(),
        qtdTipoTransacao=get_qtd_tipo_transacao(),
        tipoTransacao=get_tipo_transacao(),
        classificacoes=get_classificacoes()
        )
    return analise_geral

def get_total_empresas() -> int:
    query = "SELECT COUNT(DISTINCT ID) AS TOTAL_CLIENTES FROM CLIENTE;"
    resultados = execute_query(query)
    if resultados:
        return resultados[0].get("TOTAL_CLIENTES", 0)
    return 0

def get_empresas_declinio() -> int:
    query = """
        SELECT 
            COUNT(DISTINCT ID) AS TOTAL_DECLINIO 
        FROM CLIENTE WHERE CLASSIFICACAO = 'Declínio'
    """
    resultados = execute_query(query)
    if resultados:
        return resultados[0].get("TOTAL_DECLINIO", 0)
    return 0

def get_qtd_tipo_transacao() -> QtdTipoTransacao:
    query = """
        SELECT TOP 1 
            DS_TRAN AS DESCRICAO, 
            COUNT(*) AS QUANTIDADE
        FROM FATURAMENTO
        GROUP BY DS_TRAN
        ORDER BY QUANTIDADE DESC;
    """
    resultados = execute_query(query)
    qtd_tipo_transacao = None
    if resultados:
        for row in resultados:
            qtd_tipo_transacao = QtdTipoTransacao(
                tipo=row.get("DESCRICAO"), 
                quantidade=row.get("QUANTIDADE", 0)
            )
    return qtd_tipo_transacao

def get_tipo_transacao() -> List[TipoTransacao]:
    query = """
        SELECT 
            DS_TRAN AS TIPO_TRANSACAO, 
            SUM(VL) AS TOTAL_TRANSACAO_TIPO 
        FROM FATURAMENTO
        GROUP BY DS_TRAN
        ORDER BY TOTAL_TRANSACAO_TIPO DESC;
    """
    resultados = execute_query(query)
    tipos_transacao = []
    for row in resultados:
        tipo_transacao = TipoTransacao(
            tipo=row.get("TIPO_TRANSACAO"), 
            valor_total=row.get("TOTAL_TRANSACAO_TIPO", 0.0)
        )
        tipos_transacao.append(tipo_transacao) 
    return tipos_transacao

def get_classificacoes() -> List[Classificacao]:
    query = """
        SELECT 
            ISNULL(CLASSIFICACAO, 'Não Classificado') AS CLASSIFICACAO,
            COUNT(DISTINCT ID) AS QTD_CLIENTES,
            CAST(
                ROUND(
                COUNT(DISTINCT ID) * 100.0 / 
                (SELECT COUNT(DISTINCT ID) FROM CLIENTE), 2
                ) AS DECIMAL(5,2)
            ) AS PORCENTAGEM
        FROM CLIENTE
        GROUP BY CLASSIFICACAO
        ORDER BY PORCENTAGEM DESC;
    """
    resultados = execute_query(query)
    classificacoes = []
    for row in resultados:
        classificacao = Classificacao(
            classificacao=row.get("CLASSIFICACAO"), 
            quantidade=row.get("QTD_CLIENTES", 0),
            porcentagem=row.get("PORCENTAGEM", 0.0)
        )
        classificacoes.append(classificacao) 
    return classificacoes