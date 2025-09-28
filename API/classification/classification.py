import pandas as pd
import sys
import os

# Adiciona o diretório pai ao PYTHONPATH para importações
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dbconfig import get_connection


class CNPJClassifier:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def classify(self) -> pd.DataFrame:
        """
        Classifica os clientes no DataFrame com base nas regras fornecidas.
        """
        self.df['CLASSIFICACAO'] = self.df.apply(self._classify_row, axis=1)
        return self._update_database(self.df)

    def _classify_row(self, row) -> str:
        """
        Classifica uma única linha do DataFrame.
        """
        saldo_total = row['SALDO_TOTAL_CLIENTE']
        dt_criacao = pd.to_datetime(row['DT_ABRT'])
        cliente = row['CLIENTE']


        
        # Buscar saldo do último mês no banco de dados
        saldo_ultimo_mes = self._get_last_month_balance(cliente)
        count_meses = self._qtd_meses(cliente)
        media_min, media_max = self._calculate_balance_range(saldo_total, count_meses)

        # Regra: Não Classificado
        if saldo_total is None or count_meses == 0:
            return 'Não Classificado'

        # Regra: Início
        if self._is_new_company(dt_criacao):
            return 'Início'
        
        # Regra: Expansão
        if saldo_ultimo_mes > media_max:
            return 'Expansão'

        # Regra: Declínio
        if saldo_ultimo_mes < media_min:
            return 'Declínio'

        # Regra: Madura
        if media_min <= saldo_ultimo_mes <= media_max:
            return 'Madura'

        return 'Não Classificado'

    def _is_new_company(self, dt_criacao) -> bool:
        """
        Verifica se a empresa foi criada há menos de 5 anos.
        """
        anos_atividade = (pd.Timestamp.now() - dt_criacao).days / 365.25
        return anos_atividade < 5

    def _get_last_month_balance(self, cliente) -> float:
        """
        Consulta o saldo do último mês para o cliente no banco de dados.
        """
        query = f"""
		SELECT TOP 1
           SALDO_MES  AS SALDO_MES_CONVERTIDO
        FROM FATURAMENTO_CLIENTE
        WHERE CLIENTE = '{cliente}'
        ORDER BY MES_REFERENCIA DESC;
        """
        conn = get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query)
            result = cursor.fetchone()
            if result and result[0] is not None:
                try:
                    return float(result[0])
                except ValueError:
                    return 0.0
            return 0.0
        finally:
            cursor.close()
            conn.close()

    def _calculate_balance_range(self, saldo_total, count_meses) -> tuple:
        """
        Calcula a média mínima e máxima com margem de 15%.
        """
        if saldo_total is None or count_meses == 0:
            return 0.0, 0
        media_saldo = saldo_total / count_meses
        margem = media_saldo * 0.15
        if(margem < 0):
            return media_saldo + margem, media_saldo - margem
        
        return media_saldo - margem, media_saldo + margem

    def _qtd_meses(self, cliente) -> float:
        query = f"""
        SELECT COUNT(MES_REFERENCIA) FROM FATURAMENTO_CLIENTE
        WHERE CLIENTE = '{cliente}'
        """
        conn = get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query)
            result = cursor.fetchone()
            return result[0] if result else 1.0
        finally:
            cursor.close()
            conn.close()

    def _update_database(self, df) -> pd.DataFrame:
        """
        Atualiza a coluna CLASSIFICACAO no banco de dados linha a linha.
        """
        conn = get_connection()
        try:
            cursor = conn.cursor()
            for _, row in df.iterrows():
                query = f"""
                UPDATE CLIENTE
                SET CLASSIFICACAO = '{row['CLASSIFICACAO']}'
                WHERE ID = '{row['CLIENTE']}'
                """
                cursor.execute(query)
            conn.commit()
            return df
        finally:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    data = {
        "CLIENTE": ["CNPJ_00001", "CNPJ_00002"],
        "SALDO_TOTAL_CLIENTE": [10000, 20000],
        "DT_ABRT": ["2020-01-01", "2010-01-01"]
    }
    df = pd.DataFrame(data)
    print("aqui esta o df:")
    print(df)

    classifier = CNPJClassifier(df)
    df_classificado = classifier.classify()
    print("DataFrame classificado:")
    print(df_classificado)
