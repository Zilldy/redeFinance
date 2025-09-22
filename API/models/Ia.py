from typing import List
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    ReplyProducts: List['ReplyProducts']

class ReplyProducts(BaseModel):
    product: str
    why: str