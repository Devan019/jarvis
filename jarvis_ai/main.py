from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from websocket.util import ConnectionManager
from fastapi.middleware.cors import CORSMiddleware
import json
from helpers.agent import Agent
from helpers.speak import speak_async
import asyncio

app = FastAPI()
manager = ConnectionManager()
agent = Agent()
voice = "en-GB-RyanNeural"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Event(BaseModel):
    data: dict
    event: str


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time chat"""
    await manager.connect(websocket)
    try:
        # await manager.broadcast(f"Client {client_id} joined. Active connections: {manager.get_active_connections_count()}")
        while True:
            data = await websocket.receive_text()
            E = Event(**json.loads(data))

            # check event
            if (E.event == "agent"):
                print(f"agent is working on {E.data["text"]}")

                # call agent
                res = await asyncio.to_thread(agent.run_agent, E.data["text"])

                #response log
                print(f"agent response: {res}")

                # # temp send
                # payload = {
                #     "event": "event",  # You can name this event whatever you like
                #     "data": "" + res  # The actual text response from your agent
                # }

                #  Convert the dictionary to a JSON string and send it
                # await manager.send_personal(websocket, json.dumps(payload))

                # speak async
                speak_async(res, voice, manager, websocket)   

    except WebSocketDisconnect:
        await manager.disconnect(websocket)
        await manager.broadcast(f"Client {client_id} left. Active connections: {manager.get_active_connections_count()}")


def main():
    """Run the FastAPI server with WebSocket support"""
    import uvicorn
    print("Starting FastAPI server with WebSocket support...")
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
