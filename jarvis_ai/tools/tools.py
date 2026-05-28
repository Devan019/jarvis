from .get_weather import Weather
from .open_app import LocalApp
from .spotify import Spotify
from .yt import Youtube
from .whatsapp import WhatsApp
from .google_tool import GoogleTool
from .todo import TodoTool

# objects
weather = Weather()
localapp = LocalApp()
spotify = Spotify()
yt = Youtube()
wh = WhatsApp()
gt = GoogleTool()
todo = TodoTool()

# tool map
TOOL_MAP = {
    "current_weather": weather.watherReport,
    "open_app": localapp.open_app,
    "play_spotify_song": spotify.play_spotify_song,
    "play_spotify_playlist": spotify.play_spotify_playlist,
    "get_spotify_song_link": spotify.get_spotify_song_link,
    "play_youtube_video": yt.play_youtube_video,
    "get_youtube_video_link": yt.get_youtube_video_link,
    "download_youtube_video": yt.download_youtube_video,
    "download_youtube_audio_only": yt.download_youtube_audio_only,
    "send_whatsapp_message": wh.send_whatsapp_message,
    "create_google_meet_and_get_link": gt.googleMeet.create_google_meet_and_get_link,
    "open_meet_browser": gt.googleMeet.open_meet_browser,

    "open_todo_ui": todo.open_ui,
    "close_todo_ui": todo.close_ui,
    "add_todo": todo.add_todo,
    "remove_todo": todo.remove_todo,
    "toggle_todo": todo.toggle_todo,
    "get_todos": todo.get_todos
}


# avaliable tools and its schema
TOOLS_SCHEMA = [

    # get weather - tool
    {
        "type": "function",
        "function": {
            "name": "current_weather",
            "description": "Get current weather of a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            }
        }
    },

    # open an app - tool
    {
        "type": "function",
        "function": {
            "name": "open_app",
            "description": "Open an app",
            "parameters": {
                "type": "object",
                "properties": {
                    "app": {"type": "string"}
                },
                "required": ["app"]
            }
        }
    },


    # play a spotify song - tool
    {
        "type": "function",
        "function": {
            "name": "play_spotify_song",
            "description": "play a spotify song",
            "parameters": {
                "type": "object",
                "properties": {
                    "song_name": {"type": "string"}
                },
                "required": ["song_name"]
            }
        }
    },

    # play a spotify playlist - tool
    {
        "type": "function",
        "function": {
            "name": "play_spotify_playlist",
            "description": "play a spotify playlist",
            "parameters": {
                "type": "object",
                "properties": {
                    "playlist_name": {"type": "string"}
                },
                "required": ["playlist_name"]
            }
        }
    },

    # get spotify song link
    {
        "type": "function",
        "function": {
            "name": "get_spotify_song_link",
            "description": "get a spotify song link",
            "parameters": {
                "type": "object",
                "properties": {
                    "song_name": {"type": "string"}
                },
                "required": ["song_name"]
            }
        }
    },


    # play yt video
    {
        "type": "function",
        "function": {
            "name": "play_youtube_video",
            "description": "play a youtube video",
            "parameters": {
                "type": "object",
                "properties": {
                    "search": {"type": "string"}
                },
                "required": ["search"]
            }
        }
    },

    # get yt video link
    {
        "type": "function",
        "function": {
            "name": "get_youtube_video_link",
            "description": "get a youtube video link",
            "parameters": {
                "type": "object",
                "properties": {
                    "search": {"type": "string"}
                },
                "required": ["search"]
            }
        }
    },

    # download a yt video
    {
        "type": "function",
        "function": {
            "name": "download_youtube_video",
            "description": "download a youtube video",
            "parameters": {
                "type": "object",
                "properties": {
                    "search": {"type": "string"},
                    "resolution": {"type": "string"}
                },
                "required": ["search", "resolution"]
            }
        }
    },


    # download a yt audio only
    {
        "type": "function",
        "function": {
            "name": "download_youtube_audio_only",
            "description": "download a youtube video's audio only",
            "parameters": {
                "type": "object",
                "properties": {
                    "search": {"type": "string"}
                },
                "required": ["search"]
            }
        }
    },

    # send a message on whatsapp
    {
        "type": "function",
        "function": {
            "name": "send_whatsapp_message",
            "description": "send whatsapp message",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "message": {"type": "string"}
                },
                "required": ["name", "message"]
            }
        }
    },

    # create a google meet and get link
    {
        "type": "function",
        "function": {
            "name": "create_google_meet_and_get_link",
            "description": "create a google_meet and get link of that google meet",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {"type": "string"},
                    "start_time": {"type": "string"}
                }
            }
        }
    },

    # open a google meet
    {
        "type": "function",
        "function": {
            "name": "open_meet_browser",
            "description": "open a google meet at browser",
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {"type": "string"}
                },
                "required": ["url"]
            }
        }
    },

    # open todo UI
    {
        "type": "function",
        "function": {
            "name": "open_todo_ui",
            "description": "open todo UI window",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },

    # close todo UI
    {
        "type": "function",
        "function": {
            "name": "close_todo_ui",
            "description": "close todo UI window",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },

    # add todo task
    {
        "type": "function",
        "function": {
            "name": "add_todo",
            "description": "add a todo task with date, time and text",
            "parameters": {
                "type": "object",
                "properties": {
                    "date": {"type": "string"},
                    "time": {"type": "string"},
                    "task": {"type": "string"}
                },
                "required": ["date", "time", "task"]
            }
        }
    },

    # remove todo task by index
    {
        "type": "function",
        "function": {
            "name": "remove_todo",
            "description": "remove a todo task by index",
            "parameters": {
                "type": "object",
                "properties": {
                    "todo_id": {"type": "integer"}
                },
                "required": ["todo_id"]
            }
        }
    },

    # toggle todo task status by index
    {
        "type": "function",
        "function": {
            "name": "toggle_todo",
            "description": "toggle done or pending state of a todo by index",
            "parameters": {
                "type": "object",
                "properties": {
                    "todo_id": {"type": "integer"}
                },
                "required": ["todo_id"]
            }
        }
    },

    # get all todos
    {
        "type": "function",
        "function": {
            "name": "get_todos",
            "description": "get all todo tasks",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },

]
