import os
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
open_weather_key = os.getenv("OPEN_WEATHER_API_KEY")
spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

#phone numbers
mom_ph = os.getenv("MOM")
dad_ph = os.getenv("DAD")
mine_ph = os.getenv("MINE")
