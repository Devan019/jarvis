import requests
import base64
from const.keys import spotify_client_id, spotify_client_secret
import webbrowser


class Spotify:

    def __init__(self):
        self.__token_url = "https://accounts.spotify.com/api/token"
        self.__search_url = "https://api.spotify.com/v1/search"


    # get access token
    def __get_access_token(self):

        auth_str = f"{spotify_client_id}:{spotify_client_secret}"

        # base 64 auth
        b64_auth = base64.b64encode(auth_str.encode()).decode()

        # api of token
        url = self.__token_url

        # header
        headers = {
            "Authorization": f"Basic {b64_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        data = {
            "grant_type": "client_credentials"
        }

        # call post req
        res = requests.post(url, headers=headers, data=data)

        # return token
        return res.json()["access_token"]

    def __helper_song(self,song_name):
        # get token
        access_token = self.__get_access_token()

        # search
        search_url = self.__search_url
        headers = {"Authorization": f"Bearer {access_token}"}

        # params
        params = {
            "q": song_name,
            "type": "track",
            "limit": 1
        }

        # call api, get req
        res = requests.get(search_url, headers=headers, params=params)
        data = res.json()

        # get track url
        track_uri = data["tracks"]["items"][0]["external_urls"]["spotify"]

        return track_uri
    



    # play song
    def play_spotify_song(self,song_name):

        # get track url
        track_uri = self.__helper_song(song_name)

        # play song
        webbrowser.open(track_uri)

        return f"Playing {song_name}"

    # get track link
    def get_spotify_song_link(self,song_name):
        return self.__helper_song(song_name)

    # play playlist
    def play_spotify_playlist(self,playlist_name: str):
        # get token
        access_token = self.__get_access_token()

        # search
        search_url = self.__search_url
        headers = {"Authorization": f"Bearer {access_token}"}

        # params
        params = {
            "q": playlist_name,
            "type": "playlist",
            "limit": 1
        }

        # call api, get playlist
        res = requests.get(search_url, headers=headers, params=params)
        data = res.json()

        # get id
        url = data["playlists"]["items"][0]["external_urls"]["spotify"]

        # open playlist
        webbrowser.open(url)

        return f"playing {playlist_name}"

        # TODO :- more on artist, espisode, audiobook, ....
