import os
import subprocess
import sys

import requests
import time 

class TodoTool:
    def __init__(self):
        self.__todo_url = "http://localhost:3000/api/todo"
        self.__todo = "http://localhost:3000/todo"
        self.__process = None

    def __delay(self, seconds):
        time.sleep(seconds)

    def get_todos(self):
        try:
            response = requests.get(self.__todo_url)
            response.raise_for_status() 

            self.__delay(1.5)  
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Failed to fetch todos: {e}"}

    def remove_todo(self, todo_id):
        try:
            response = requests.delete(f"{self.__todo_url}/{todo_id}")
            response.raise_for_status()
            self.__delay(1.5)  
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Failed to delete todo: {e}"}

    def add_todo(self, date=None, time=None, task=""):
        payload = {"task": task}
        if date and time:
            payload["date"] = f"{date} {time}"
        elif date:
            payload["date"] = date
            
        try:
            response = requests.post(self.__todo_url, json=payload)
            self.__delay(1.5)  
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Failed to add todo: {e}"}

    def toggle_todo(self, todo_id, completed=True):
        try:
            self.__delay(1.5)  
            response = requests.patch(f"{self.__todo_url}/{todo_id}", json={"completed": completed})
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Failed to toggle todo: {e}"}

    def open_ui(self):
        if self.__process and self.__process.poll() is None:
            return {"message": "UI is already running."}
            
        script_path = os.path.join(os.path.dirname(__file__), "open_ui.py")
        self.__process = subprocess.Popen([sys.executable, script_path, self.__todo])
        self.__delay(3)
        
        return {"message": "UI opened successfully."}

    def close_ui(self):
        try:
            if self.__process and self.__process.poll() is None:
                self.__process.terminate()
                return {"message": "UI closed successfully."}
            else:
                return {"message": "UI is not running."}
                
        except Exception as e:
            return {"error": f"Failed to close UI: {str(e)}"}
