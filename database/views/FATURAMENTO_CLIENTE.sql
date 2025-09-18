CREATE VIEW FATURAMENTO_CLIENTE
AS
SELECT 
    CAST(YEAR(F.DT_REFE) AS VARCHAR) + '-' + RIGHT('0' + CAST(MONTH(F.DT_REFE) AS VARCHAR), 2) AS MES_REFERENCIA,
    C.ID AS CLIENTE,
    '+' + FORMAT(SUM(CASE WHEN C.ID = F.ID_RCBE THEN F.VL ELSE 0 END), 'N2') AS TOTAL_ENTRADA,
    '-' + FORMAT(SUM(CASE WHEN C.ID = F.ID_PGTO THEN F.VL ELSE 0 END), 'N2') AS TOTAL_SAIDA,
    CASE 
        WHEN SUM(CASE WHEN C.ID = F.ID_RCBE THEN F.VL ELSE 0 END) -
             SUM(CASE WHEN C.ID = F.ID_PGTO THEN F.VL ELSE 0 END) >= 0
        THEN '+' + FORMAT(
            SUM(CASE WHEN C.ID = F.ID_RCBE THEN F.VL ELSE 0 END) -
            SUM(CASE WHEN C.ID = F.ID_PGTO THEN F.VL ELSE 0 END), 'N2')
        ELSE '-' + FORMAT(
            ABS(SUM(CASE WHEN C.ID = F.ID_RCBE THEN F.VL ELSE 0 END) -
                SUM(CASE WHEN C.ID = F.ID_PGTO THEN F.VL ELSE 0 END)), 'N2')
    END AS SALDO_MES
FROM FATURAMENTO F
JOIN CLIENTE C 
    ON C.ID = F.ID_PGTO OR C.ID = F.ID_RCBE
GROUP BY YEAR(F.DT_REFE), MONTH(F.DT_REFE), C.ID;
/*
Como podemos usar essa View ?

Essa View pode ser utilizada para obter um resumo mensal do faturamento de cada cliente, permitindo análises de receita e despesas ao longo do tempo.

Trazendo as informações de Total de entrada, Total de saída e Saldo de cada cliente para cada mês, facilita bastante a visualização do status financeiro de cada um.
Para melhor visualização é recomentado usar a Querry abaixo, que contem o ORDER BY que vai agrupar todos os clientes com os seus meses.
*/

--Querry
SELECT * FROM FATURAMENTO_CLIENTE 
ORDER BY CLIENTE, MES_REFERENCIA;