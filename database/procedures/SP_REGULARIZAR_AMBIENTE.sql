IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_REGULARIZAR_AMBIENTE')
BEGIN
    DROP PROCEDURE SP_REGULARIZAR_AMBIENTE;
    PRINT('Procedure SP_REGULARIZAR_AMBIENTE dropada com sucesso.');
END
GO


CREATE PROCEDURE SP_REGULARIZAR_AMBIENTE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @NOME_DB VARCHAR(50) = 'AA', --Definir o nome da base 
        @FIND_BASE1 VARCHAR(250) = 'C:\Users\osval\Downloads\base1 (2).csv', -- Direcionar para a base 1
        @FIND_BASE2 VARCHAR(250) = 'C:\Users\osval\Downloads\base2 (1).csv', -- Direcionar para a base 2
        @SQL NVARCHAR(MAX);

    -- Criar a base de dados se não existir
    IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = @NOME_DB)
    BEGIN
        SET @SQL = 'CREATE DATABASE [' + @NOME_DB + ']';
        EXEC(@SQL);
    END

    -- Criar estrutura e importar dados
    SET @SQL = '
    USE [' + @NOME_DB + '];

    IF OBJECT_ID(''CLIENTE'', ''U'') IS NULL
    BEGIN
        CREATE TABLE CLIENTE (
            ID VARCHAR(50) NOT NULL,
            VL_FATU FLOAT,
            VL_SLDO FLOAT,
            DT_ABRT SMALLDATETIME,
            DS_CNAE VARCHAR(200),
            DT_REFE SMALLDATETIME
        );
        CREATE INDEX IX_CLIENTE_ID ON CLIENTE(ID);
    END

    IF OBJECT_ID(''CLIENTE_TEMP'', ''U'') IS NULL
    BEGIN
        CREATE TABLE CLIENTE_TEMP (
            ID VARCHAR(50),
            VL_FATU FLOAT,
            VL_SLDO FLOAT,
            DT_ABRT VARCHAR(20),
            DS_CNAE VARCHAR(200),
            DT_REFE VARCHAR(20)
        );
    END
    ';
    EXEC(@SQL);

    SET @SQL = '
    BULK INSERT [' + @NOME_DB + '].dbo.CLIENTE_TEMP
    FROM ''' + @FIND_BASE1 + '''
    WITH (
        CODEPAGE = ''65001'',
        FIELDTERMINATOR = '';'',
        ROWTERMINATOR = ''\n'',
        FIRSTROW = 2
    );
    ';
    EXEC(@SQL);

    SET @SQL = '
    USE [' + @NOME_DB + '];
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
    ';
    EXEC(@SQL);

    -- FATURAMENTO
    SET @SQL = '
    USE [' + @NOME_DB + '];

    IF OBJECT_ID(''FATURAMENTO'', ''U'') IS NULL
    BEGIN
        CREATE TABLE FATURAMENTO (
            ID_PGTO VARCHAR(50) NOT NULL,
            ID_RCBE VARCHAR(50) NOT NULL,
            VL FLOAT DEFAULT 0.0,
            DS_TRAN VARCHAR(50),
            DT_REFE SMALLDATETIME
        );
        CREATE INDEX IX_FATURAMENTO_ID_PGTO ON FATURAMENTO(ID_PGTO);
        CREATE INDEX IX_FATURAMENTO_ID_RCBE ON FATURAMENTO(ID_RCBE);
        CREATE INDEX IX_FATURAMENTO_DT_REFE ON FATURAMENTO(DT_REFE);
    END

    IF OBJECT_ID(''FATURAMENTO_TEMP'', ''U'') IS NULL
    BEGIN
        CREATE TABLE FATURAMENTO_TEMP (
            ID_PGTO VARCHAR(50),
            ID_RCBE VARCHAR(50),
            VL FLOAT,
            DS_TRAN VARCHAR(50),
            DT_REFE VARCHAR(20)
        );
    END
    ';
    EXEC(@SQL);

    SET @SQL = '
    BULK INSERT [' + @NOME_DB + '].dbo.FATURAMENTO_TEMP
    FROM ''' + @FIND_BASE2 + '''
    WITH (
        CODEPAGE = ''65001'',
        FIELDTERMINATOR = '';'',
        ROWTERMINATOR = ''\n'',
        FIRSTROW = 2
    );
    ';
    EXEC(@SQL);

    SET @SQL = '
    USE [' + @NOME_DB + '];
    SET DATEFORMAT DMY;

    INSERT INTO FATURAMENTO (ID_PGTO, ID_RCBE, VL, DS_TRAN, DT_REFE)
    SELECT
        ID_PGTO,
        ID_RCBE,
        VL,
        DS_TRAN,
        CONVERT(SMALLDATETIME, DT_REFE, 103)
    FROM FATURAMENTO_TEMP;
    ';
    EXEC(@SQL);

    IF EXISTS(SELECT * FROM SYS.OBJECTS WHERE NAME = 'CLIENTE_TEMP')
    BEGIN
        DROP TABLE IF EXISTS CLIENTE_TEMP;
        PRINT 'TABELA "CLIENTE_TEMP" TEMPORARIA DROPADA COM SUCESSO.';
    END
    IF EXISTS(SELECT * FROM SYS.OBJECTS WHERE NAME = 'FATURAMENTO_TEMP')
    BEGIN
        DROP TABLE IF EXISTS FATURAMENTO_TEMP;
        PRINT 'TABELA "FATURAMENTO_TEMP" TEMPORARIA DROPADA COM SUCESSO.';
    END

    PRINT 'Ambiente regularizado com sucesso.';
END
GO

EXEC SP_REGULARIZAR_AMBIENTE

/*
!IMPORTANTE!!
É necessario ajustar as views na mão, o script deles estão na pasta views.
*/