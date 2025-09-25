from typing import List
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    json_object: object

class ChatResponse(BaseModel):
    ReplyProducts: List['ReplyProducts']

class ReplyProducts(BaseModel):
    product: str
    why: str