from dotenv import load_dotenv
from openai import OpenAI
import os

class GroqClient():
  def __init__(self):
    load_dotenv()
    self._client = OpenAI(
      api_key=  os.getenv("GROQ_API_KEY"),
      base_url= "https://api.groq.com/openai/v1"
    )

  @property
  def client(self):
    return self._client
