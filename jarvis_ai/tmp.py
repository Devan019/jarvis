# import subprocess
# import time

# profile = "temp_profile_123"

# subprocess.Popen(
#     f'start chrome.exe --app=http://localhost:3000/todo --user-data-dir={profile}',
#     shell=True
# )


# time.sleep(4)

# subprocess.run(
#     ['taskkill', '/FI', 'WINDOWTITLE eq Jarvis_TODO*'],
#     stdout=subprocess.DEVNULL, 
#     stderr=subprocess.DEVNULL
# )







# 2.
# import requests
# import webview
# import multiprocessing

# # This function runs isolated in its own process
# def render_window(url):
#     # You can customize the size, title, and make it frameless if you want!
#     webview.create_window('Jarvis_TODO', url, width=1300, height=1200)
#     webview.start()

# if __name__ == '__main__':
#     url = "http://localhost:3000/todo"
#     # Start the webview in a separate process
#     p = multiprocessing.Process(target=render_window, args=(url,))
#     p.start()

#     # Wait for the webview to initialize (you might want to adjust this)
#     import time
#     time.sleep(7)

#     # end process
#     p.terminate()




#3.
import sys


if __name__ == '__main__':
    import os
    import subprocess
    import time
    script_path = os.path.join(os.path.dirname(__file__), "tmp2.py")
        
    p = subprocess.Popen([sys.executable, script_path, "http://localhost:3000/todo"])

    time.sleep(7)

    p.terminate()
    