import requests
from const.keys import open_weather_key


class Weather:
    def __init__(self):
        self.base = "http://api.openweathermap.org/data/2.5/weather"

    def getWeather(self, location: str) -> str:
    
        # api calling of weather
        api = requests.get(f"{self.base}?q={location}&appid={open_weather_key}&units=metric")
        
        data = api.json()

        #return the data
        return data
