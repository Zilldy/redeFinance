# Use uma imagem base oficial do Python
FROM python:3.12-slim

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Instale as dependências do sistema necessárias para o pyodbc
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    unixodbc \
    unixodbc-dev \
    curl \
    apt-transport-https \
    gnupg \
    && curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg \
    && install -o root -g root -m 644 microsoft.gpg /usr/share/keyrings/ \
    && echo "deb [signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update && ACCEPT_EULA=Y apt-get install -y \
    msodbcsql17 \
    && apt-get clean && rm -rf /var/lib/apt/lists/* microsoft.gpg

# Copie os arquivos de requisitos e instale as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie o restante do código da API para o container
COPY . .

# Exponha a porta padrão do FastAPI
EXPOSE 8000

# Cria um entrypoint simples
RUN echo '#!/bin/sh\npython -m classification.main\nexec uvicorn api:app --host 0.0.0.0 --port 8000' > /entrypoint.sh && chmod +x /entrypoint.sh

# Comando para iniciar o entrypoint
CMD ["/entrypoint.sh"]