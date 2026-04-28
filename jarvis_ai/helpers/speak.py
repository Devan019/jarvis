import threading
import edge_tts
import subprocess
import asyncio


async def stream_audio(text, voice):
    process = subprocess.Popen(
        ["mpv", "--no-cache", "--no-terminal", "--", "fd://0"],
        stdin=subprocess.PIPE,
    )

    communicate = edge_tts.Communicate(text, voice)

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            process.stdin.write(chunk["data"])
            process.stdin.flush()

    process.stdin.close()
    process.wait()


def speak_async(text, voice):
    def runner():
        asyncio.run(stream_audio(text, voice))
    
    threading.Thread(target=runner, daemon=True).start()



