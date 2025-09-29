#!/bin/bash
set -e

echo "Iniciando SQL Server..."

# Inicia o SQL Server em background
/opt/mssql/bin/sqlservr &

# Aguarda o SQL Server iniciar (tenta até 60 vezes, 5s cada)
echo "Aguardando SQL Server inicializar..."
for i in {1..60}; do
    if /opt/mssql-tools18/bin/sqlcmd -C -S localhost,1433 -U SA -P "$SA_PASSWORD" -Q "SELECT 1" &>/dev/null; then
        echo "SQL Server iniciado com sucesso!"
        break
    fi
    echo "Aguardando SQL Server iniciar... ($i/60)"
    sleep 5
    if [ "$i" -eq 60 ]; then
        echo "ERRO: SQL Server não iniciou. Abortando restore."
        exit 1
    fi
done

# Verifica se o banco já existe (para evitar restore desnecessário)
echo "Verificando se o banco CHALLENGE já existe..."
DB_EXISTS=$(/opt/mssql-tools18/bin/sqlcmd -C -S localhost,1433 -U SA -P "$SA_PASSWORD" -Q "SELECT COUNT(*) FROM sys.databases WHERE name = 'CHALLENGE'" -h -1 2>/dev/null || echo "0")

if [ "$DB_EXISTS" -eq "0" ]; then
    echo "Banco não existe. Verificando arquivos de backup disponíveis..."
    if [ -d "/backuup" ]; then
        echo "Arquivos disponíveis em /backuup/:"
        ls -la /backuup/ || echo "Diretório vazio ou inacessível"
    fi
    
    echo "Executando script de inicialização do banco..."
    if /opt/mssql-tools18/bin/sqlcmd -C -S localhost,1433 -U SA -P "$SA_PASSWORD" -i /restore-db.sql; then
        echo "Inicialização do banco executada com sucesso!"
    else
        echo "ERRO: Falha na inicialização do banco de dados!"
        exit 1
    fi
else
    echo "Banco CHALLENGE já existe. Pulando inicialização."
fi

echo "SQL Server pronto para uso!"

# Mantém o SQL Server rodando em primeiro plano
wait
