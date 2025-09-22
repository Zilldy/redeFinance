#!/bin/bash
set -e

# Inicia o SQL Server em background
/opt/mssql/bin/sqlservr &

# Aguarda o SQL Server iniciar (tenta até 60 vezes, 5s cada)
for i in {1..60}; do
    /opt/mssql-tools18/bin/sqlcmd -C -S localhost,1433 -U SA -P "$SA_PASSWORD" -Q "SELECT 1" && break
    echo "Aguardando SQL Server iniciar... ($i/60)"
    sleep 5
    if [ "$i" -eq 60 ]; then
        echo "SQL Server não iniciou. Abortando restore."
        exit 1
    fi
done

# Executa o restore
/opt/mssql-tools18/bin/sqlcmd -C -S localhost,1433 -U SA -P "$SA_PASSWORD" -i /restore-db.sql

# Mantém o SQL Server rodando em primeiro plano
wait
