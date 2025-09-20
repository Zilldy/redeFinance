from fastapi import FastAPI
from routers.empresa_router import router as empresa_router
from routers.analise_geral_router import router as geral_router
from routers.ia_router import router as ia_router

app = FastAPI(title="RedeFinance API", description="API para dashboard financeiro", version="1.0.0")

# Registrar os roteadores
app.include_router(empresa_router, prefix="/api", tags=["Empresas"])
app.include_router(geral_router, prefix="/api", tags=["AnaliseGeral"])
app.include_router(ia_router, prefix="/api", tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
