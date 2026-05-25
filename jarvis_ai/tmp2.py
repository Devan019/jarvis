# todo_ui.py
import webview
import sys

if __name__ == '__main__':
    # Grab the URL passed from the subprocess, or default to localhost
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/todo"
    webview.create_window('Jarvis_TODO', url, width=1300, height=1200)
    webview.start()