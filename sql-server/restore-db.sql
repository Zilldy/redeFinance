USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CHALLENGE')
BEGIN
    RESTORE DATABASE CHALLENGE
    FROM DISK = N'/backuup/SeuBanco.bak'
    WITH MOVE 'CHALLANGE' TO '/var/opt/mssql/data/CHALLENGE.mdf',
        MOVE 'CHALLANGE_log' TO '/var/opt/mssql/data/CHALLENGE_log.ldf',
        REPLACE;
    END
ELSE
BEGIN
    PRINT 'Database CHALLENGE já existe.';
END
GO
