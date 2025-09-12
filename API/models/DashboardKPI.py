from pydantic import BaseModel

class DashboardKPIs(BaseModel):
    total_empresas: int
    empresas_risco: int
    crescimento: float