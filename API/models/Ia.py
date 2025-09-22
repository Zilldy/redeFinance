from typing import List
from pydantic import BaseModel


class ChatRequest(BaseModel):
    json_object: object

class ChatResponse(BaseModel):
    ReplyProducts: List['ReplyProducts']

class ReplyProducts(BaseModel):
    product: str
    why: str