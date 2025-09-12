from fastapi import FastAPI
from routers.empresa_router import router as empresa_router

app = FastAPI(title="RedeFinance API", description="API para dashboard financeiro", version="1.0.0")

# Registrar os roteadores
app.include_router(empresa_router, prefix="/api", tags=["Empresas"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
