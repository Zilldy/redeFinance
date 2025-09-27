from typing import List
import pyodbc
import pandas as pd
import warnings


# Configurações de conexão Para SQL Docker
#server = 'redefinance_sql,1433'
# server = 'localhost,14330'
# database = 'CHALLENGE'
# username = 'sa'
# password = 'M@sterk3y'

# Configurações de conexão
server = r'(LocalDB)\MSSQLLocalDB'
database = 'CHALLANGE'  # Altere para o nome do seu banco de dados, se necessário
username = 'dev'
password = '1234'

################################## NICKÃO ########################################
#server = r'(LocalDB)\MSSQLLocalDB'
#database = 'CHALLENGE'  # Altere para o nome do seu banco de dados, se necessário
#username = 'dev'
#password = '1234'

################################### BIGAS ########################################
#server = r'(LocalDB)\MSSQLLocalDB'
#database = 'CHALLENGE'  # Altere para o nome do seu banco de dados, se necessário
#username = 'dev'
#password = '1234'

def get_connection():
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
        f"TrustServerCertificate=yes;"
    )
    return pyodbc.connect(conn_str)

def consultar_tabela(nome_tabela):
        """Consulta todos os registros de uma tabela e retorna como lista de dicionários."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(f"SELECT TOP 10 * FROM {nome_tabela}")
            colunas = [desc[0] for desc in cursor.description]
            resultados = [dict(zip(colunas, row)) for row in cursor.fetchall()]
            return resultados
        finally:
            cursor.close()
            conn.close()

def execute_query(query: str) -> List[object]:
    with DatabaseConnection() as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        results = cursor.fetchall()
        colunas = [desc[0] for desc in cursor.description]
        return [dict(zip(colunas, row)) for row in results]

# Objeto para compartilhar DataFrame entre arquivos/classes
class DatabaseTableData:
    def __init__(self):
        self.df = None

    def preencher_dataframe(self, nome_tabela, query=None) -> pd.DataFrame:
        """
        Preenche o DataFrame com os dados da tabela informada ou de um SELECT customizado.
        Se query for None, faz SELECT * FROM nome_tabela.
        """
        conn = get_connection()
        try:
            if query is None:
                query = f"SELECT * FROM {nome_tabela}"
            with warnings.catch_warnings():
                warnings.simplefilter("ignore", UserWarning)
                self.df = pd.read_sql(query, conn)
        finally:
            conn.close()

        return self.get_dataframe()


    def get_dataframe(self):
        """Retorna o DataFrame atual."""
        return self.df


class DatabaseConnection:
    def __init__(self):
        self.connection = None

    def __enter__(self):
        if self.connection is None:
            self.connection = get_connection()
        return self.connection

    def __exit__(self, exc_type, exc_value, traceback):
        if self.connection:
            self.connection.close()
            self.connection = None
    
    def get_connection(self):
        if self.connection is None:
            self.connection = get_connection()
        return self.connection

if __name__ == "__main__":
    try:
        conn = get_connection()
        print("Conexão bem-sucedida com o banco de dados!")
        conn.close()
    except Exception as e:
        print(f"Erro ao conectar: {e}")
