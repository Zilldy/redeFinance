import sys
import os
from . import classification
import time
from datetime import datetime
# Adiciona o diretório pai ao PYTHONPATH para importações
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import dbconfig

if __name__ == "__main__":
    start_time = time.time()
    
    print(r"""
██████╗ ███████╗██████╗ ███████╗███████╗██╗███╗   ██╗ █████╗ ███╗   ██╗ ██████╗███████╗
██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝██║████╗  ██║██╔══██╗████╗  ██║██╔════╝██╔════╝
██████╔╝█████╗  ██║  ██║█████╗  █████╗  ██║██╔██╗ ██║███████║██╔██╗ ██║██║     █████╗  
██╔══██╗██╔══╝  ██║  ██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██╔══██║██║╚██╗██║██║     ██╔══╝  
██║  ██║███████╗██████╔╝███████╗██║     ██║██║ ╚████║██║  ██║██║ ╚████║╚██████╗███████╗
╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝
    """)
    try:
        hour = time.localtime().tm_hour #- 3
        print(hour)
        if hour >= 0 and hour <= 2:
            conn = dbconfig.get_connection()
            print("Conexão bem-sucedida com o banco de dados! \n")

            df = dbconfig.DatabaseTableData().preencher_dataframe("CARGA_CLASSIFICATION")
            if df is None or df.empty:
                print("Nenhum cliente encontrado para ser classificado.\n")
            else:
                print("Total de clientes a serem classificados:", df.shape[0], "\n")
                #print("Lista de clientes classificados:\n", df[["CLIENTE"]].head(), "\n")

                classifier = classification.CNPJClassifier(df)
                df_classificado = classifier.classify()
                print("DataFrame classificado:")
                print(df_classificado[['CLIENTE', 'CLASSIFICACAO']])

            conn.close()
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
    
    end_time = time.time()
    execution_time = end_time - start_time
    start_datetime = datetime.fromtimestamp(start_time).strftime("%d/%m/%Y %H:%M:%S")
    end_datetime = datetime.fromtimestamp(end_time).strftime("%d/%m/%Y %H:%M:%S")
    print(f"\nComeçou a execução em {start_datetime} e terminou em {end_datetime}")
    print(f"\nTempo de execução: {execution_time:.2f} segundos")
    print("\nClassificação finalizada!")