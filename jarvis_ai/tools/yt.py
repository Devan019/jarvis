import pywhatkit
import yt_dlp
import os


class Youtube:

    # play youtube video
    def play_youtube_video(self, search: str):
        pywhatkit.playonyt(search)
        return f"{search} youtube video playing"

    # get link of search video
    def get_youtube_video_link(self, search: str):
        yt_dlp_opt = {
            "quiet": True,
            "skip_download": True
        }

        with yt_dlp.YoutubeDL(yt_dlp_opt) as yt:
            info = yt.extract_info(f"ytsearch:{search}", download=False)
            entry = info['entries'][0]
            link = entry['webpage_url']
            return link

    # download video
    def download_youtube_video(self, search: str, resolution: int):
        folder = "./yt_videos"
        os.makedirs(folder, exist_ok=True)

        ydl_opts = {
            'format': f'bestvideo[height<={resolution}]+bestaudio/best[height<={resolution}]',
            'outtmpl': f'{folder}/%(title)s.%(ext)s'
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"ytsearch:{search}", download=True)
            video = info['entries'][0]

        return f"Downloaded ({resolution}p): {video['title']}"

    # only audio download
    def download_youtube_audio_only(self, search: str):
        folder = "./yt_videos"
        os.makedirs(folder, exist_ok=True)

        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
            }],
            'outtmpl': f'{folder}/%(title)s.%(ext)s'
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"ytsearch:{search}", download=True)
            audio = info['entries'][0]

        return f"Downloaded  {audio['title']}"


