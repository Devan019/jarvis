import os
import sys
import subprocess

class Weather:
    def __init__(self):
        self.url = "http://localhost:3000/weather"
        self.__process = None

    def watherReport(self, location: str) -> str:
        if self.__process and self.__process.poll() is None:
            return {"message": "UI is already running."}
            
        script_path = os.path.join(os.path.dirname(__file__), "open_ui.py")
        self.__process = subprocess.Popen([sys.executable, script_path, self.url + f"?location={location}", "Jarvis_Weather"])
        
        return {"message": "UI opened successfully."}
