CREATE TABLE CLIENTE(
ID VARCHAR(50) NOT NULL,	
VL_FATU FLOAT,
VL_SLDO FLOAT,
DT_ABRT SMALLDATETIME,
DS_CNAE VARCHAR(200),
DT_REFE SMALLDATETIME 
);
CREATE INDEX IX_CLIENTE_ID ON CLIENTE(ID);

-- Tabela temporária para consumir a base em .csv
CREATE TABLE CLIENTE_TEMP (
    ID VARCHAR(50),
    VL_FATU FLOAT,
    VL_SLDO FLOAT,
    DT_ABRT VARCHAR(20),
    DS_CNAE VARCHAR(200),
    DT_REFE VARCHAR(20)
);

-- BULK INSERT processo util para SQL SERVER (Não sei se funciona para outros bancos, só usei no SSMS)
BULK INSERT CLIENTE_TEMP
FROM 'C:\Users\osval\Downloads\base1 (2).csv'
	WITH (
		CODEPAGE = '65001',         -- UTF-8
		FIELDTERMINATOR = ';',      -- Separador de campos (ex: vírgula)
		ROWTERMINATOR = '\n',       -- Separador de linhas
		FIRSTROW = 2                -- Ignora o cabeçalho, se houver
	);

-- Conversão para tabela final
SET DATEFORMAT DMY;

INSERT INTO CLIENTE (ID, VL_FATU, VL_SLDO, DT_ABRT, DS_CNAE, DT_REFE)
SELECT
    ID,
    VL_FATU,
    VL_SLDO,
    CONVERT(SMALLDATETIME, DT_ABRT, 103),
    DS_CNAE,
    CONVERT(SMALLDATETIME, DT_REFE, 103)
FROM CLIENTE_TEMP;