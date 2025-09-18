from API import dbconfig
from backend import classification
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


        df = dbconfig.DatabaseTableData().preencher_dataframe("SALDO_CLIENTE")
        # print(df["CLIENTE"])
        # print()
        # print(df["DT_ABRT"])
        # print()
        # print(df["SALDO_TOTAL_CLIENTE"])

        #classifier = classification.CNPJClassifier(df)
        #classifier.classify()

       

        conn.close()
    except Exception as e:
        print(f"Erro ao conectar: {e}")
