import json
import re
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
import ollama
from models.Ia import ChatResponse, ChatRequest

router = APIRouter()

RULE_PROMPT = (
    """
    Você é um especialista em crédito bancário para empresas. Analise os dados da empresa fornecidos no JSON a seguir e recomende os produtos bancários mais adequados.\n\n
    Considere os seguintes campos como principais para sua análise:\n
    - saldo_total: liquidez da empresa (Peso 3)\n
    - medLucro: lucratividade média (Peso 2)\n
    - classificacao: estágio da empresa (Início, Expansão, Declínio, Madura) (Peso 3)\n
    - cnae: setor de atuação (Peso 2)\n
    - saldos: evolução financeira recente (Peso 3)\n
    - relacionamentos: volume e frequência de transações com parceiros (Peso 2)\n
    - semelhantes: empresas similares e seus estágios (Peso 1)\n
    - Demais campos do JSON que considerar importante para a analise (Peso 1)\n\n
    Responda apenas com um JSON em português, sem explicações ou texto extra, com os seguintes campos:\n
    - \"ReplyProducts\": uma lista de objetos que não pode vir vazia, cada um contendo os campos \"product\" (nome do produto bancário recomendado que sera oferecido do banco para o cliente) e \"why\" (justificativa para a recomendação personalizada para o cliente recebido no JSON).\n
    JSON da empresa:\n
    """
)

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    string_json = json.dumps(req.json_object, ensure_ascii=False)
    full_prompt = RULE_PROMPT + string_json
    res = ollama.chat(model="llama3", messages=[
        {"role": "user", "content": full_prompt}
    ])

    try:
        parsed = json.loads(res['message']['content'])

        reply_products = parsed.get("ReplyProducts", [])

        # Se ReplyProducts vier como string contendo JSON, faz o parsing
        if isinstance(reply_products, str) and "[" in reply_products:
            match = re.search(r'(\[.*\])', reply_products, re.DOTALL)
            if match:
                reply_products = json.loads(match.group(1))

        # Garante que é uma lista
        if not isinstance(reply_products, list):
            reply_products = [reply_products]

        return ChatResponse(ReplyProducts=reply_products)
    except Exception:
        return ChatResponse(ReplyProducts=[])