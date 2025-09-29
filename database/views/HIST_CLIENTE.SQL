ALTER VIEW HIST_CLIENTE AS
SELECT 
    F.ID_PGTO AS PAGADOR,
    F.ID_RCBE AS RECEBEDOR,
    CASE 
        WHEN C.ID = F.ID_PGTO THEN -1 * CONVERT(FLOAT, F.VL)
        WHEN C.ID = F.ID_RCBE THEN CONVERT(FLOAT, F.VL)
    END AS VALOR,
    F.DS_TRAN AS DESCRICAO,
    F.DT_REFE AS DATAREFERENCIA,
    C.ID AS CLIENTE
FROM FATURAMENTO F
JOIN CLIENTE C 
    ON C.ID = F.ID_PGTO OR C.ID = F.ID_RCBE;

/*
Como podemos usar essa View ?

Ela é util para descobrirmos todos os historicos de transação que terminado cliente teve.
Ela não é muito util sem a cláusula WHERE com o order by pois as informações ficariam desordenadas e confusas de se entender.

Em baixo temos 2 querrys que prepareiu para utilização:

Querry 1 - Responsavel por trazer o historico de transações de um cliente específico, ordenando pela DATAREFERENCIA. Ela ira trzar os casos em que o Cliente é o PAGADOR ou o RECEBEDOR.
Querry 2 - Responsavel por trazer o historico de transação de determinado cliente, porem é possivel filtrar se queremos que seja de um tipo específico (PAGADOR ou RECEBEDOR).
*/

--Query 1
SELECT * FROM HIST_CLIENTE where CLIENTE = 'CNPJ_00001'
ORDER BY DATAREFERENCIA;

--Query 2
-- Toda vez em que o PAGADOR for o cliente estara sendo descontado da conta dele umu valor, atribuindo assim um valor de saida "-";
-- Caso precise ver apenas os pagamentos de Recebimento para esse cliente é só alterar o VALOR dando o like no sinal de "+".
SELECT * FROM HIST_CLIENTE where CLIENTE = 'CNPJ_00001' and VALOR like '%-%' 
ORDER BY DATAREFERENCIA