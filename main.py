from API import dbconfig
from backend import classification
import pyodbc

if __name__ == "__main__":
    print(r"""
██████╗ ███████╗██████╗ ███████╗███████╗██╗███╗   ██╗ █████╗ ███╗   ██╗ ██████╗███████╗
██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝██║████╗  ██║██╔══██╗████╗  ██║██╔════╝██╔════╝
██████╔╝█████╗  ██║  ██║█████╗  █████╗  ██║██╔██╗ ██║███████║██╔██╗ ██║██║     █████╗  
██╔══██╗██╔══╝  ██║  ██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██╔══██║██║╚██╗██║██║     ██╔══╝  
██║  ██║███████╗██████╔╝███████╗██║     ██║██║ ╚████║██║  ██║██║ ╚████║╚██████╗███████╗
╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝
    """)
    try:
        conn = dbconfig.get_connection()
        print("Conexão bem-sucedida com o banco de dados! \n")

        df = dbconfig.DatabaseTableData().preencher_dataframe("SALDO_CLIENTE")
        if df is None or df.empty:
            print("Nenhum cliente encontrado para ser classificado.\n")
        else:
            print("Total de clientes a serem classificados:", df.shape[0], "\n")
            #print("Lista de clientes classificados:\n", df[["CLIENTE"]].head(), "\n")

            classifier = classification.CNPJClassifier(df)
            classifier.classify()

        conn.close()
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
