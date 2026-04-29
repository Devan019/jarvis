import edge_tts
import asyncio
import json
import base64

async def stream_audio(text, voice, manager, websocket):
    communicate = edge_tts.Communicate(text, voice)

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            # 1. Encode the raw binary audio to a Base64 string
            audio_base64 = base64.b64encode(chunk["data"]).decode("utf-8")
            
            # 2. Format your dictionary exactly how you specified
            payload = {
                "event": "tts_chunk",  # You can name this event whatever you like
                "data": audio_base64
            }
            
            # 3. Convert the dictionary to a JSON string and send it
            await manager.send_personal(websocket, json.dumps(payload))


def speak_async(text, voice, manager, websocket):
    """
    Fires off the TTS stream in the background without blocking, 
    and keeps it in the SAME event loop as your websocket.
    """
    asyncio.create_task(stream_audio(text, voice, manager, websocket))