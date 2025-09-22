USE master;
GO

RESTORE DATABASE CHALLENGE
FROM DISK = N'/backuup/SeuBanco.bak'
WITH MOVE 'CHALLANGE' TO '/var/opt/mssql/data/CHALLENGE.mdf',
     MOVE 'CHALLANGE_log' TO '/var/opt/mssql/data/CHALLENGE_log.ldf',
     REPLACE;
GO
