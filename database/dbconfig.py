import pyodbc

# Configurações de conexão
server = r'(LocalDB)\MSSQLLocalDB'
database = 'CHALLANGE'  # Altere para o nome do seu banco de dados, se necessário
username = 'dev'
password = '1234'

def get_connection():
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
    )
    print(server)
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

if __name__ == "__main__":
    try:
        conn = get_connection()
        print("Conexão bem-sucedida com o banco de dados!")
        conn.close()
    except Exception as e:
        print(f"Erro ao conectar: {e}")
