from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.empresa_router import router as empresa_router
from routers.analise_geral_router import router as geral_router
from routers.ia_router import router as ia_router
import uvicorn

app = FastAPI(title="RedeFinance API", description="API para dashboard financeiro", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar os roteadores
app.include_router(empresa_router, prefix="/api", tags=["Empresas"])
app.include_router(geral_router, prefix="/api", tags=["AnaliseGeral"])
app.include_router(ia_router, prefix="/api", tags=["Chat"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
