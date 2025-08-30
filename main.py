from database import dbconfig
import pyodbc

if __name__ == "__main__":
    print("Drivers ODBC disponíveis:")
    for driver in pyodbc.drivers():
        print(driver)
    print("\nTestando conexão com o banco de dados...")
    try:
        conn = dbconfig.get_connection()
        print("Conexão bem-sucedida com o banco de dados!")

        resultados = dbconfig.consultar_tabela("CLIENTE")
        for registro in resultados:
            print(registro)

        conn.close()
    except Exception as e:
        print(f"Erro ao conectar: {e}")
