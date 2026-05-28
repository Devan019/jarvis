# todo_ui.py
import webview
import sys

if __name__ == '__main__':
    # Grab the URL passed from the subprocess, or default to localhost

    if len(sys.argv) > 1:
        url = sys.argv[1]
        name = sys.argv[2]
        webview.create_window(name, url, width=1300, height=1200)
        webview.start()
    else:
        raise ValueError("No URL provided for the webview.")