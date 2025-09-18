# redeFinance

o arquivo na raíz "main.py" serve unicamente para popular a tabela CLIENTE com o dado de CLASSIFICACAO [Início, Expansão, Declínio, Maduro].

Por isso, mudei o dbconfig.py para a pasta da API pra estabelecermos a conexão com o banco de dados no arquivo de CRUD.

a ideia é rodar a api em um container docker e aí no front a gnt bate direto na url da api rodando (vai ser o mesmo esquema localmente tbm kk).

PS: rodei via Docker a api e deu timeout todas as requisições na hr de conectar com o banco de dados, mas rodando local deu tudo certo

comando pra rodar a api:

```
uvicorn api:app
```