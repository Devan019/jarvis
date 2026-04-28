from const.mapper import APPS_MAP
import subprocess


class LocalApp:
  
  def open_app(self, app:str):
    #check app is present
    app = APPS_MAP.get(app.lower())

    if not app:
      #not run command
      return f"this app - {app} is not present in your tool"
    
    #try to open it
    try:
      subprocess.Popen(app)
      return f"app is opened"
    except Exception as e:
          return f"Error opening {app}: {str(e)}"